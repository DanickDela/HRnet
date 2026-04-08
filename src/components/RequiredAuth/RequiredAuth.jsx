/**
 * RequiredAuth component.
 *
 * This component protects routes that require authentication.
 * It checks if the user is authorized using a custom hook.
 *
 * - If the user is authorized, it renders the protected content (children)
 * - If not, it redirects the user to the login page
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content to render if authorized
 * @returns {JSX.Element} The protected content or a redirection to the login page
 */

import { Navigate } from "react-router-dom";
import { useAuthorized } from "../../hooks/useAuthorized";

function RequiredAuth({ children }) {
  const isAuthorized = useAuthorized();

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default RequiredAuth;
