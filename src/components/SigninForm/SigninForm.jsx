/**
 * SigninForm component.
 *
 * This component handles user authentication.
 * It provides a login form with validation and manages:
 * - Email and password input fields
 * - Form validation (onBlur and onSubmit)
 * - Error handling and display
 * - "Remember me" functionality (localStorage / sessionStorage)
 * - Automatic redirection after successful login
 *
 * Features:
 * - Validates email format using a custom hook
 * - Validates password length
 * - Displays error messages to the user
 * - Redirects to the profile page when the user is authenticated
 *
 * State:
 * - username: user's email input
 * - password: user's password input
 * - remember: boolean for persistent session
 * - error: error message displayed to the user
 *
 * Hooks:
 * - useLoginUser: custom hook to perform login API call
 * - useSelector: retrieves authentication token from Redux store
 * - useNavigate: handles navigation after login
 *
 * @component
 * @returns {JSX.Element} The sign-in form UI
 */

import { useEffect, useState } from "react";
import styles from "../../styles/signinform.module.scss";
import { FaUserCircle } from "react-icons/fa";
import { useLoginUser } from "../../hooks/useLoginUser";
import { useSelector } from "react-redux";
import { isValidEmail } from "../../hooks/useRegex";
import { useNavigate } from "react-router-dom";

function SigninForm() {
  const loginUser = useLoginUser();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  /**
   * Redirects the user to the profile page when authenticated.
   */
  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  /**
   * Validates the username field on blur.
   */
  function handleBlurUsername() {
    if (!username) {
      setError("Email is required");
    } else if (!isValidEmail(username)) {
      setError("Invalid email");
    } else {
      setError("");
    }
  }

  /**
   * Validates the password field on blur.
   */
  function handleBlurPassword() {
    if (!password) {
      setError("Password is required");
    } else if (password.length < 11) {
      setError("Password must be at least 11 characters");
    } else {
      setError("");
    }
  }

  /**
   * Handles form submission.
   *
   * Performs validation and triggers the login process.
   * Displays error messages if validation fails or login fails.
   *
   *  @param {Event} e
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!username) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(username)) {
      setError("Email invalide");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 11) {
      setError("Password must be at least 11 characters");
      return;
    }

    setError("");

    try {
      await loginUser(username, password, remember);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className={styles.signin_content}>
      <FaUserCircle className={styles.signin_icon} />
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.input_wrapper}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleBlurUsername}
          />
        </div>

        <div className={styles.input_wrapper}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleBlurPassword}
          />
        </div>

        <div className={styles.input_remember}>
          <input
            type="checkbox"
            id="remember-me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember-me">Remember me</label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" className={styles.signin_content_button}>
          Sign In
        </button>
      </form>
    </section>
  );
}

export default SigninForm;
