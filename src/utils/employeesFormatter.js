/**
 * Formate une chaîne de caractères en nom propre.
 *
 * La fonction met tout le texte en minuscules, puis met en majuscule
 * la première lettre :
 * - du mot ;
 * - d’un mot après un espace ;
 * - d’un mot après un tiret ;
 * - d’un mot après une apostrophe.
 *
 * Exemples :
 * - "jean" devient "Jean"
 * - "jean-paul" devient "Jean-Paul"
 * - "o'connor" devient "O'Connor"
 *
 * @param {string} value - Valeur texte à formater.
 * @returns {string} Valeur formatée en nom propre, ou chaîne vide si aucune valeur n’est fournie.
 */
export function formatName(value) {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/(^|\s|-|')\w/g, (char) => char.toUpperCase());
}

/**
 * Formate un code postal américain pendant la saisie utilisateur.
 *
 * La fonction supprime tous les caractères non numériques,
 * puis applique automatiquement le format ZIP ou ZIP+4 :
 * - `12345`
 * - `12345-6789`
 *
 * @param {string} value - Valeur saisie par l’utilisateur.
 * @returns {string} Code postal formaté.
 */
export function formatZipCode(value) {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length <= 5) return digitsOnly;

  return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 9)}`;
}

/**
 * Incrémente la valeur numérique d’un code postal américain.
 *
 * Si le code postal contient une extension ZIP+4,
 * seule l’extension située après le tiret est incrémentée.
 *
 * Limites appliquées :
 * - code ZIP principal : maximum `99999`
 * - extension ZIP+4 : maximum `9999`
 *
 * @param {string} value - Code postal actuel.
 * @returns {string} Code postal incrémenté.
 */
export function incrementZipCode(value) {
  if (value.includes("-")) {
    const [main, ext] = value.split("-");
    return `${main}-${Math.min(9999, Number(ext || 0) + 1)}`;
  }

  return String(Math.min(99999, Number(value || 0) + 1));
}

/**
 * Décrémente la valeur numérique d’un code postal américain.
 *
 * Si le code postal contient une extension ZIP+4,
 * seule l’extension située après le tiret est décrémentée.
 *
 * Limites appliquées :
 * - code ZIP principal : minimum `0`
 * - extension ZIP+4 : minimum `0`
 *
 * @param {string} value - Code postal actuel.
 * @returns {string} Code postal décrémenté.
 */
export function decrementZipCode(value) {
  if (value.includes("-")) {
    const [main, ext] = value.split("-");
    return `${main}-${Math.max(0, Number(ext || 0) - 1)}`;
  }

  return String(Math.max(0, Number(value || 0) - 1));
}
