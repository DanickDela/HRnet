import { useSelector } from "react-redux";
/**
 * EditNameForm component.
 *
 * Provides a form to update the user's first and last name.
 * Handles form state, validation, submission, and error display.
 *
 * Behavior:
 * - Displays an "Edit Name" button when not in editing mode
 * - Shows the form when editing is enabled
 * - Validates inputs (required fields, valid characters, changes detection)
 * - Submits updated data via a custom hook
 * - Displays error messages if validation or API call fails
 * - Resets form and exits edit mode on success or cancel
 *
 * Props:
 * @param {Object} props - Component props
 * @param {boolean} props.isEditing - Indicates whether the form is visible
 * @param {(value: boolean) => void} props.setIsEditing - Function to toggle edit mode
 *
 * @component
 * @returns {JSX.Element} The edit button or the edit name form
 */
export function useAuthorized() {
  const token = useSelector((state) => state.auth.token);
  //conversion en booelan : si token existe, retourne true, sinon false
  return !!token;
}
