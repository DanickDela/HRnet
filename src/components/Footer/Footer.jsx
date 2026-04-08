/**
 * Footer component.
 *
 * Displays the application's footer section, including
 * copyright information.
 *
 * @component
 * @returns {JSX.Element} The footer element
 */

import styles from "../../styles/footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footer__text}>Copyright 2020 Argent Bank</p>
    </footer>
  );
}

export default Footer;
