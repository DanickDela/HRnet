/**
 * Home page component.
 *
 * This component represents the landing page of the application.
 * It displays a promotional hero section and a list of key features
 * highlighting the bank's services.
 *
 * Sections included:
 * - Hero section with marketing messages
 * - Features section presenting main benefits
 *
 * @component
 * @returns {JSX.Element} The home page layout
 */

import iconChat from "../../assets/icon-chat.png";
import iconMoney from "../../assets/icon-money.png";
import iconSecurity from "../../assets/icon-security.png";
import styles from "../../styles/home.module.scss";
import "../../styles/main.scss";

function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <section className={styles.hero__content}>
          <h2 className={styles.sr_only}>Promoted Content</h2>

          <p className={styles.subtitle}>No fees.</p>
          <p className={styles.subtitle}>No minimum deposit.</p>
          <p className={styles.subtitle}>High interest rates.</p>

          <p className={styles.text}>
            Open a savings account with Argent Bank today!
          </p>
        </section>
      </div>

      <section className={styles.features}>
        <h2 className={styles.sr_only}>Features</h2>

        <div className={styles.feature__item}>
          <img
            src={iconChat}
            alt="Chat Icon"
            className={styles.feature__icon}
          />
          <h3 className={styles.feature__item_title}>
            You are our #1 priority
          </h3>
          <p>
            Need to talk to a representative? You can get in touch through our
            24/7 chat or through a phone call in less than 5 minutes.
          </p>
        </div>

        <div className={styles.feature__item}>
          <img
            src={iconMoney}
            alt="Money Icon"
            className={styles.feature__icon}
          />
          <h3 className={styles.feature__item_title}>
            More savings means higher rates
          </h3>
          <p>
            The more you save with us, the higher your interest rate will be!
          </p>
        </div>

        <div className={styles.feature__item}>
          <img
            src={iconSecurity}
            alt="Security Icon"
            className={styles.feature__icon}
          />
          <h3 className={styles.feature__item_title}>Security you can trust</h3>
          <p>
            We use top of the line encryption to make sure your data and money
            is always safe.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
