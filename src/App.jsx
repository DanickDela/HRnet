import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import RequiredAuth from "./components/RequiredAuth/RequiredAuth";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import { fetchUserProfile, clearUserProfile } from "./store/userSlice";

import styles from "../src/styles/app.module.scss";

/**
 * Chargement différé de la page Login.
 *
 * Le composant est téléchargé uniquement lorsqu’il est nécessaire,
 * ce qui permet d’alléger le bundle initial de l’application.
 */
const Login = lazy(() => import("./pages/Login/Login"));

/**
 * Chargement différé de la page CreateEmployee.
 *
 * Cette page est chargée dynamiquement lors de la navigation
 * vers la route de création d’employé.
 */
const CreateEmployee = lazy(
  () => import("./pages/CreateEmployee/CreateEmployee"),
);

/**
 * Chargement différé de la page ViewEmployees.
 *
 * Cette technique améliore les performances initiales
 * en séparant cette page dans un chunk JavaScript distinct.
 */
const ViewEmployees = lazy(() => import("./pages/ViewEmployees/ViewEmployees"));

/**
 * Composant racine de l’application HRnet.
 *
 * Ce composant gère :
 * - les redirections selon l’état d’authentification
 * - les routes protégées
 * - le chargement du profil utilisateur si un token existe
 * - le nettoyage du profil si aucun token n’est présent
 * - le chargement initial des employés
 * - le lazy loading des pages avec `React.Suspense`
 * - la structure générale avec header, contenu principal et footer
 *
 * @component
 * @returns {JSX.Element} Structure principale de l’application.
 */
function App() {
  // Permet de déclencher des actions Redux.
  const dispatch = useDispatch();

  // Récupère le token d’authentification depuis le store Redux.
  const token = useSelector((state) => state.auth.token);

  // Récupère le statut de chargement du profil utilisateur et les erreurs éventuelles.
  const { error, status } = useSelector((state) => state.user);

  useEffect(() => {
    // Si aucun token n’existe, suppression du profil utilisateur.
    if (!token) {
      dispatch(clearUserProfile());
      return;
    }

    // Si un token existe et que le profil n’est pas encore chargé,
    // récupération des données utilisateur.
    if (status === "idle") {
      dispatch(fetchUserProfile(token));
    }
  }, [token, status, dispatch]);

  return (
    <>
      {/* Affiche un message d’erreur global si le profil échoue à charger. */}
      {status === "failed" && (
        <div className={styles.error}>Error : {error}</div>
      )}

      {/* En-tête commun de l’application. */}
      <Header />

      <main className="main">
        {/* Affiche un contenu temporaire pendant le chargement des pages lazy. */}
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            {/* Route d’accueil : redirection si connecté, sinon page Login. */}
            <Route
              path="/"
              element={
                token ? <Navigate to="/createemployee" replace /> : <Login />
              }
            />

            {/* Route de connexion : inaccessible si déjà connecté. */}
            <Route
              path="/login"
              element={
                token ? <Navigate to="/createemployee" replace /> : <Login />
              }
            />

            {/* Route protégée : création d’un employé. */}
            <Route
              path="/createemployee"
              element={
                <RequiredAuth>
                  <CreateEmployee />
                </RequiredAuth>
              }
            />

            {/* Route protégée : consultation des employés. */}
            <Route
              path="/listeemployees"
              element={
                <RequiredAuth>
                  <ViewEmployees />
                </RequiredAuth>
              }
            />

            {/* Redirection des routes inconnues vers l’accueil. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Pied de page commun de l’application. */}
      <Footer />
    </>
  );
}

export default App;
