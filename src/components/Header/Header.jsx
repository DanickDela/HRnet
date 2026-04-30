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

/**
 * Composant d’en-tête principal de l’application.
 *
 * Ce composant affiche la barre de navigation globale de HRnet.
 *
 * Il gère :
 * - l’affichage du logo de l’application ;
 * - le titre principal ;
 * - les liens de navigation ;
 * - l’affichage conditionnel selon l’état d’authentification ;
 * - l’affichage du prénom de l’utilisateur connecté ;
 * - la déconnexion de l’utilisateur ;
 * - l’ouverture et la fermeture du menu burger sur mobile.
 *
 * Fonctionnement :
 * - si l’utilisateur est connecté, les liens vers la création et la liste
 *   des employés sont affichés ;
 * - si l’utilisateur n’est pas connecté, seul le lien de connexion apparaît ;
 * - lors de la déconnexion, le token et le profil utilisateur sont supprimés
 *   du store Redux, puis l’utilisateur est redirigé vers l’accueil.
 *
 * Redux :
 * - lit le token depuis le slice `auth` ;
 * - lit le prénom depuis le slice `user` ;
 * - déclenche `clearToken` pour supprimer l’authentification ;
 * - déclenche `clearUserProfile` pour nettoyer le profil utilisateur.
 *
 * @component
 * @returns {JSX.Element} Barre de navigation principale de l’application.
 */
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
