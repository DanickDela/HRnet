/**
 * Validates if the given email has a correct format.
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email format is valid, otherwise false
 */
export const isValidEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

/**
 * Validates if the password meets basic security requirements.
 *
 * Rules:
 * - Must contain at least one letter
 * - Must contain at least one number
 * - Must be at least 3 characters long
 *
 * @param {string} password - The password to validate
 * @returns {boolean} True if the password is valid, otherwise false
 */
export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;
  return regex.test(password);
};

/**
 * Validates if the name contains only allowed characters.
 *
 * Allowed:
 * - Letters (including accented characters)
 * - Numbers
 * - Spaces or hyphens between words
 *
 * @param {string} name - The name to validate
 * @returns {boolean} True if the name is valid, otherwise false
 */
export const isValidName = (name) => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+([ -][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/;
  return regex.test(name);
};
