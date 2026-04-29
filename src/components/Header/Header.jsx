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
import { useState } from "react";
import logo from "../../assets/HRnet.svg";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
  FaPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../store/authSlice";
import { clearUserProfile } from "../../store/userSlice";
import styles from "./header.module.scss";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const { firstName } = useSelector((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);

  function handleSignOut() {
    dispatch(clearToken());
    dispatch(clearUserProfile());
    navigate("/");
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo */}
        <NavLink to="/" className={styles.nav__logo} onClick={closeMenu}>
          <img
            className={styles.nav__logo_image}
            src={logo}
            alt="Wealth Health logo"
          />
          <span className={styles.nav__logo_title}>WEALTH HEALTH</span>
        </NavLink>

        {/* Title */}
        <h1 className={styles.nav__title}>HRnet</h1>

        {/* Burger mobile */}
        <button
          type="button"
          className={styles.nav__burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu */}
        <div
          className={`${styles.nav__menu} ${
            menuOpen ? styles.nav__menu_open : ""
          }`}
        >
          {token ? (
            <>
              <NavLink
                to="/createemployee"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${styles.nav__link} ${isActive ? styles.active : ""}`
                }
              >
                <FaPlus />
                <span>Create Employee</span>
              </NavLink>

              <NavLink
                to="/listeemployees"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${styles.nav__link} ${isActive ? styles.active : ""}`
                }
              >
                <FaUsers />
                <span>View Employees</span>
              </NavLink>

              <div className={styles.nav__user}>
                <FaUserCircle />
                <span>{firstName}</span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className={styles.nav__logout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className={styles.nav__link}
            >
              <FaUserCircle />
              <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
