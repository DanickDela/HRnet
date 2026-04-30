import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Protège l’accès à une route nécessitant une authentification.
 *
 * Ce composant vérifie la présence d’un token d’authentification
 * dans le store Redux.
 *
 * Comportement :
 * - si un token existe, le contenu enfant est affiché ;
 * - si aucun token n’est présent, l’utilisateur est redirigé vers `/login` ;
 * - l’option `replace` évite d’ajouter la route protégée à l’historique
 *   de navigation.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {React.ReactNode} props.children - Contenu à afficher uniquement si l’utilisateur est authentifié.
 * @returns {JSX.Element|React.ReactNode} Le contenu protégé ou une redirection vers la page de connexion.
 */
function RequiredAuth({ children }) {
  // Récupère le token d’authentification depuis le store Redux.
  const token = useSelector((state) => state.auth.token);

  // Redirige l’utilisateur non authentifié vers la page de connexion.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Affiche la route protégée si l’utilisateur est authentifié.
  return children;
}

export default RequiredAuth;
