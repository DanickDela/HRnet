/**
 * Login page component.
 *
 * This component renders the login page layout and includes
 * the {@link SigninForm} component for user authentication.
 *
 * It applies specific styles for layout and background.
 *
 * @component
 * @returns {JSX.Element} The login page
 */

import styles from "./login.module.scss";
import SigninForm from "../../components/SigninForm/SigninForm";

function Login() {
  return (
    <main className={styles.main}>
      <SigninForm />
    </main>
  );
}

export default Login;
