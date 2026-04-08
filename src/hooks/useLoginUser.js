/**
 * Custom hook for user authentication.
 *
 * This hook handles the login process by:
 * - Calling the login API with user credentials
 * - Storing the authentication token in Redux
 * - Persisting the token in localStorage or sessionStorage based on the "remember me" option
 *
 * @hook
 * @returns {(email: string, password: string, remember: boolean) => Promise<string>}
 * A function that logs in the user and returns the authentication token
 */

import { loginUser } from "../service/api";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";

export const useLoginUser = () => {
  const dispatch = useDispatch();

  /**
   * Logs in the user with the provided credentials.
   *
   * @param {string} email - User email address
   * @param {string} password - User password
   * @param {boolean} remember - Whether to persist the session
   * @returns {Promise<string>} The authentication token
   */
  return async (email, password, remember) => {
    const token = await loginUser(email, password);
    dispatch(setToken(token));

    if (remember) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }

    return token;
  };
};
