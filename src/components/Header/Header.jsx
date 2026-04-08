/**
 * Header component.
 *
 * This component represents the main navigation bar of the application.
 * It displays:
 * - The application logo
 * - Navigation links (Home, Profile, Login)
 * - User information when authenticated
 * - A sign-out button
 *
 * Features:
 * - Conditional rendering based on authentication state
 * - Displays the user's first name when logged in
 * - Handles user logout by clearing authentication and user state
 * - Redirects to the home page after logout
 *
 * Redux:
 * - Reads authentication token from auth slice
 * - Reads user first name from user slice
 * - Dispatches actions to clear token and user profile
 *
 * @component
 * @returns {JSX.Element} The header navigation bar
 */

import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/argentBankLogo.png";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../store/authSlice";
import { clearUserProfile } from "../../store/userSlice";
import styles from "../../styles/header.module.scss";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const { firstName } = useSelector((state) => state.user);

  /**
   * Handles user sign-out.
   *
   * Clears authentication token and user profile from Redux store,
   * then redirects the user to the home page.
   */
  function handleSignOut() {
    dispatch(clearToken());
    dispatch(clearUserProfile());
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.nav__logo}>
          <img
            className={styles.nav__logo_image}
            src={logo}
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </NavLink>

        {token ? (
          <div className={styles.nav__auth}>
            <NavLink to="/profile" className={styles.nav__item}>
              <FaUserCircle className={styles.nav__item_iconeuser} />
              <span className={styles.nav__item_sign_text}>{firstName}</span>
            </NavLink>

            <button
              type="button"
              onClick={handleSignOut}
              className={styles.nav__item_sign}
            >
              <FaSignOutAlt className={styles.nav__item_sign_iconeout} />
              <span className={styles.nav__item_sign_text}>Sign Out</span>
            </button>
          </div>
        ) : (
          <div>
            <NavLink to="/login" className={styles.nav__item}>
              <FaUserCircle className={styles.nav__item_iconeuser} />
              <span className={styles.nav__item_sign_text}>Sign In</span>
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
