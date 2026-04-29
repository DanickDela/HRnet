import { useDispatch, useSelector } from "react-redux";
import { patchUserProfile } from "../service/api";
import { setUserProfile } from "../store/userSlice";

/**
 * Custom hook to update the mock user's profile.
 *
 * @returns {(firstName: string, lastName: string) => Promise<Object>}
 */
export function useUpdateUser() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return async function updateUser(firstName, lastName) {
    const updatedUser = await patchUserProfile(token, firstName, lastName);
    dispatch(setUserProfile(updatedUser));
    return updatedUser;
  };
}
