/**
 * Profile page component.
 *
 * This component displays the authenticated user's profile information,
 * including their first and last name, and a list of bank accounts.
 *
 * Features:
 * - Displays a welcome message with the user's name
 * - Allows editing the user's name via the EditNameForm component
 * - Shows account summaries with balances
 *
 * State:
 * - isEditing: controls whether the edit name form is visible
 *
 * Redux:
 * - Retrieves user information (firstName, lastName) from the global store
 *
 * @component
 * @returns {JSX.Element} The profile page layout
 */

import { useState } from "react";
import "../../styles/main.scss";
import styles from "../../styles/profile.module.scss";
import { useSelector } from "react-redux";
import EditNameForm from "../../components/EditNameForm/EditNameForm";

function Profile() {
  const { firstName, lastName } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className={`${styles.main} ${styles.bgdark}`}>
      <div className={styles.head_profile}>
        <h1>
          Welcome back
          <br />
          {!isEditing && `${firstName} ${lastName} !`}
        </h1>

        <EditNameForm isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>

      <h2 className="sr-only">Accounts</h2>

      <section className={styles.account}>
        <div className={styles.account__content_wrapper}>
          <h3 className={styles.account__title}>
            Argent Bank Checking (x8349)
          </h3>
          <p className={styles.account__amount}>$2,082.79</p>
          <p className={styles.account__amount_description}>
            Available Balance
          </p>
        </div>
        <div className="account-content-wrapper cta">
          <button className={styles.transaction_button}>
            View transactions
          </button>
        </div>
      </section>

      <section className={styles.account}>
        <div className={styles.account__content_wrapper}>
          <h3 className={styles.account__title}>Argent Bank Savings (x6712)</h3>
          <p className={styles.account__amount}>$10,928.42</p>
          <p className={styles.account__amount_description}>
            Available Balance
          </p>
        </div>
        <div className="account-content-wrapper cta">
          <button className={styles.transaction_button}>
            View transactions
          </button>
        </div>
      </section>

      <section className={styles.account}>
        <div className={styles.account__content_wrapper}>
          <h3 className={styles.account__title}>
            Argent Bank Credit Card (x8349)
          </h3>
          <p className={styles.account__amount}>$184.30</p>
          <p className={styles.account__amount_description}>Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className={styles.transaction_button}>
            View transactions
          </button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
