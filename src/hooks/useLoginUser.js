import { useDispatch } from "react-redux";
import { loginUser } from "../service/api";
import { setToken } from "../store/authSlice";
import { fetchUserProfile } from "../store/userSlice";

/**
 * Custom hook to handle mock user login.
 *
 * @returns {(email: string, password: string, remember: boolean) => Promise<void>}
 */
export function useLoginUser() {
  const dispatch = useDispatch();

  return async function handleLogin(email, password, remember) {
    const token = await loginUser(email, password);

    dispatch(setToken(token));

    if (remember) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }

    await dispatch(fetchUserProfile(token)).unwrap();
  };
}
