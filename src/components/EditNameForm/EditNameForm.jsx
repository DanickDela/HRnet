import { useState } from "react";
import styles from "../../styles/editnameform.module.scss";
import { useSelector } from "react-redux";
import { isValidName } from "../../hooks/useRegex";
import { useUpdateUser } from "../../hooks/useUpdateUser";
/**
 * EditNameForm component.
 *
 * Allows the user to update their first and last name.
 * This component handles form display, validation, submission,
 * and error handling.
 *
 * Features:
 * - Toggles between display mode and edit mode
 * - Validates user input (non-empty, valid characters, changes detected)
 * - Sends updated user data via a custom hook
 * - Displays validation and API error messages
 * - Resets form state after successful submission or cancellation
 *
 * Props:
 * @param {Object} props - Component props
 * @param {boolean} props.isEditing - Indicates whether the form is in edit mode
 * @param {Function} props.setIsEditing - Function to toggle edit mode
 *
 * Redux:
 * - Retrieves current user data (firstName, lastName) from the store
 *
 * Hooks:
 * - useUpdateUser: custom hook to update user profile via API
 *
 * @component
 * @returns {JSX.Element} The edit name form or edit button
 */
function EditNameForm({ isEditing, setIsEditing }) {
  const { firstName, lastName } = useSelector((state) => state.user);
  const updateUser = useUpdateUser();

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setNewFirstName("");
    setNewLastName("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (newFirstName === firstName && newLastName === lastName) {
      setError("Firstname and last name are the same as the current ones");
      return;
    }

    if (newFirstName.length === 0 || newLastName.length === 0) {
      setError("Mandatory inputs for both first name and last name");
      return;
    }

    if (!isValidName(newFirstName) || !isValidName(newLastName)) {
      setError("Invalid characters in first name or last name");
      return;
    }
    try {
      await updateUser({ firstName: newFirstName, lastName: newLastName });
      resetForm();
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function toggleEditNameForm() {
    setIsEditing(!isEditing);
  }

  return (
    <div>
      {!isEditing && (
        <button className={styles.edit_button} onClick={toggleEditNameForm}>
          Edit Name
        </button>
      )}

      {isEditing && (
        <form className={styles.edit_name_form} onSubmit={handleSubmit}>
          <div className={styles.edit_name_form_row}>
            <label htmlFor="first-name" className="sr-only">
              First Name
            </label>
            <input
              id="first-name"
              className={styles.edit_name_form_input}
              type="text"
              placeholder={firstName}
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />

            <label htmlFor="last-name" className="sr-only">
              Last Name
            </label>
            <input
              id="last-name"
              className={styles.edit_name_form_input}
              type="text"
              placeholder={lastName}
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.edit_name_form_actions}>
            <button
              type="button"
              className={styles.edit_button}
              onClick={() => {
                resetForm();
                setIsEditing(false);
              }}
            >
              Cancel
            </button>

            <button type="submit" className={styles.edit_button}>
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditNameForm;
