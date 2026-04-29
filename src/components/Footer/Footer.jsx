/**
 * Footer component.
 *
 * Displays the application's footer section, including
 * copyright information.
 *
 * @component
 * @returns {JSX.Element} The footer element
 */

import styles from "./footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footer__text}>Copyright 2026 HRnet</p>
    </footer>
  );
}

export default Footer;
