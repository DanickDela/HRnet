/**
 * Custom hook to update the authenticated user's profile.
 *
 * This hook encapsulates the logic for updating user information by:
 * - Sending a PATCH request to the API with the updated data
 * - Using the authentication token from Redux
 * - Updating the global Redux state with the new user profile
 *
 * It ensures that the frontend state stays synchronized with the backend.
 *
 * @hook
 * @returns {(data: { firstName: string, lastName: string }) => Promise<Object>}
 * A function that updates the user profile and returns the updated data
 */

import { useDispatch, useSelector } from "react-redux";
import { patchUserProfile } from "../service/api";
import { setUserProfile } from "../store/userSlice";

export function useUpdateUser() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  /**
   * Updates the user's profile information.
   *
   * Sends the updated first and last name to the API,
   * then updates the Redux store with the response.
   *
   * @param {Object} data - The user data to update
   * @param {string} data.firstName - The new first name
   * @param {string} data.lastName - The new last name
   *
   * @returns {Promise<Object>} The updated user profile returned by the API
   *
   * @throws {Error} Throws an error if the API request fails
   */
  return async function updateUser({ firstName, lastName }) {
    const updatedProfile = await patchUserProfile(token, firstName, lastName);

    dispatch(
      setUserProfile({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
      }),
    );

    return updatedProfile;
  };
}
