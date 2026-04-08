/**
 * Main application component.
 *
 * This component handles:
 * - Global layout (Header, Footer)
 * - Application routing using React Router
 * - User authentication state via Redux
 * - Fetching the user profile when a valid token is present
 * - Displaying loading and error states related to the user profile
 *
 * @component
 * @returns {JSX.Element} The root application component
 */

import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./styles/app.module.scss";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import RequiredAuth from "./components/RequiredAuth/RequiredAuth";
import Profile from "./pages/Profile/Profile";
import { fetchUserProfile, clearUserProfile } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { error, status } = useSelector((state) => state.user);

  /**
   * Effect to manage user authentication state.
   *
   * - Clears user profile if no token is present
   * - Fetches user profile if token exists and status is idle
   *
   * @effect
   */
  useEffect(() => {
    if (!token) {
      dispatch(clearUserProfile());
      return;
    }

    if (status === "idle") {
      dispatch(fetchUserProfile(token));
    }
  }, [token, status, dispatch]);

  return (
    <>
      <Header />

      {status === "loading" && (
        <div className={styles.loading}>Loading profile...</div>
      )}

      {status === "failed" && (
        <div className={styles.error}>Error : {error}</div>
      )}

      <Routes>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/Liste-employees" element={<EmployeeList />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
