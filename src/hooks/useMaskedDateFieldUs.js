import { useState } from "react";

/**
 * Fonction de validation métier appliquée à une date déjà parsée.
 *
 * Elle permet d’ajouter une contrainte spécifique au champ,
 * par exemple :
 * - interdire les dates futures
 * - limiter une date de naissance à 120 ans
 * - limiter une date d’entrée entre deux bornes
 *
 * @callback DateAllowanceValidator
 * @param {Date} date - Date déjà validée au format JavaScript.
 * @returns {boolean} `true` si la date est autorisée, sinon `false`.
 */

/**
 * Résultat de validation d’une valeur texte de date.
 *
 * @typedef {Object} MaskedDateValidationResult
 * @property {Date|null} date - Date JavaScript valide si la validation réussit, sinon `null`.
 * @property {string} error - Message d’erreur vide si la validation réussit.
 */

/**
 * Options de configuration du hook `useMaskedDateField`.
 *
 * @typedef {Object} MaskedDateFieldOptions
 * @property {Date|null} [initialDate=null]
 * Date initiale du champ.
 *
 * @property {string} [requiredMessage="Date is required"]
 * Message affiché si le champ est vide.
 *
 * @property {string} [invalidMessage="Enter a valid date in MM/DD/YYYY format"]
 * Message affiché si la date saisie n’a pas un format valide
 * ou ne correspond pas à une vraie date calendaire.
 *
 * @property {DateAllowanceValidator} [isDateAllowed]
 * Fonction métier permettant de vérifier si une date valide
 * est autorisée dans le contexte du champ.
 *
 * @property {string} [notAllowedMessage="Enter a valid date"]
 * Message affiché si la date est bien formée mais n’est pas autorisée
 * par la règle métier.
 */

/**
 * API exposée par le hook `useMaskedDateField`.
 *
 * @typedef {Object} MaskedDateFieldHook
 * @property {Date|null} date
 * Dernière date JavaScript validée.
 *
 * @property {string} inputValue
 * Valeur texte affichée dans le champ.
 *
 * @property {string} error
 * Message d’erreur courant du champ.
 *
 * @property {boolean} isOpen
 * Indique si le calendrier du DatePicker est ouvert.
 *
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsOpen
 * Setter React permettant d’ouvrir ou fermer le calendrier.
 *
 * @property {React.Dispatch<React.SetStateAction<string>>} setError
 * Setter React permettant de modifier manuellement le message d’erreur.
 *
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} handleInputChange
 * Gère la saisie manuelle dans l’input masqué.
 *
 * @property {() => void} handleBlur
 * Gère la validation finale lorsque le champ perd le focus.
 *
 * @property {(newDate: Date|null) => void} handleDatePickerChange
 * Gère la sélection d’une date depuis le calendrier.
 *
 * @property {(nextDate?: Date|null) => void} reset
 * Réinitialise complètement le champ, avec éventuellement
 * une nouvelle date initiale.
 */

/**
 * Parse une chaîne au format américain `MM/DD/YYYY`.
 *
 * La fonction vérifie successivement :
 * - que la chaîne respecte bien le format `MM/DD/YYYY`
 * - que le mois est compris entre 1 et 12
 * - que le jour est compris entre 1 et 31
 * - que la date construite est réellement valide
 *
 * Cette dernière vérification est essentielle car JavaScript peut
 * "corriger" automatiquement certaines dates invalides
 * (par exemple en débordant sur le mois suivant).
 *
 * @param {string} value - Valeur brute saisie dans le champ date.
 * @returns {Date|null}
 * Retourne un objet `Date` valide si la chaîne représente une vraie date,
 * sinon `null`.
 *
 * @example
 * parseUSDate("02/29/2024");
 * // Date valide
 *
 * @example
 * parseUSDate("02/31/2024");
 * // null
 */
export function parseUSDate(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, month, day, year] = match;

  const monthNumber = Number(month);
  const dayNumber = Number(day);
  const yearNumber = Number(year);

  if (monthNumber < 1 || monthNumber > 12) return null;
  if (dayNumber < 1 || dayNumber > 31) return null;

  const date = new Date(yearNumber, monthNumber - 1, dayNumber);

  if (Number.isNaN(date.getTime())) return null;

  if (
    date.getFullYear() !== yearNumber ||
    date.getMonth() !== monthNumber - 1 ||
    date.getDate() !== dayNumber
  ) {
    return null;
  }

  return date;
}

/**
 * Formate un objet `Date` au format américain `MM/DD/YYYY`.
 *
 * @param {Date|null} date - Date à formater.
 * @returns {string}
 * Retourne une chaîne formatée en `MM/DD/YYYY`,
 * ou une chaîne vide si aucune date n’est fournie.
 *
 * @example
 * formatUSDate(new Date(2026, 3, 17));
 * // "04/17/2026"
 */
export function formatUSDate(date) {
  if (!date) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export function formatIsoUS(isoDate) {
  if (!isoDate) return "";

  const [year, month, day] = isoDate.split("-");
  return `${month}/${day}/${year}`;
}

/**
 * Formats a JavaScript `Date` object into an ISO-like calendar date string (`YYYY-MM-DD`).
 *
 * This helper is intended for storing date-only values in a normalized format,
 * independent of the display format used in the UI.
 *
 * Unlike `date.toISOString()`, this function does not include time or timezone
 * information, which helps avoid unwanted date shifts when persisting form data.
 *
 * @param {Date|null|undefined} date - The date to format.
 * @returns {string} A date string in `YYYY-MM-DD` format, or an empty string if no date is provided.
 *
 * @example
 * formatISODate(new Date(2026, 3, 22));
 * // "2026-04-22"
 *
 * @example
 * formatISODate(null);
 * // ""
 */
export function formatISODate(date) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
/**
 * Hook réutilisable pour gérer un champ date masqué au format américain `MM/DD/YYYY`.
 *
 * Ce hook centralise :
 * - la valeur texte affichée dans l’input
 * - la dernière date JavaScript validée
 * - les erreurs de validation
 * - l’état d’ouverture du DatePicker
 * - la validation au fil de la saisie
 * - la validation finale au blur
 * - la synchronisation avec une sélection via calendrier
 *
 * Il permet d’éviter de dupliquer la logique entre plusieurs champs date
 * comme `dateOfBirth` et `startDate`.
 *
 * @param {MaskedDateFieldOptions} [options={}] - Options de configuration du champ.
 * @returns {MaskedDateFieldHook}
 * Retourne l’état et les handlers nécessaires pour piloter un champ date complet.
 *
 * @example
 * const birthDateField = useMaskedDateField({
 *   requiredMessage: "Date of birth is required",
 *   invalidMessage: "Enter a valid date in MM/DD/YYYY format",
 *   isDateAllowed: isPlausibleBirthDate,
 *   notAllowedMessage: "Enter a plausible birth date",
 * });
 */
export function useMaskedDateField({
  initialDate = null,
  requiredMessage = "Date is required",
  invalidMessage = "Enter a valid date in MM/DD/YYYY format",
  isDateAllowed = () => true,
  notAllowedMessage = "Enter a valid date",
} = {}) {
  const [date, setDate] = useState(initialDate);
  const [inputValue, setInputValue] = useState(
    initialDate ? formatUSDate(initialDate) : "",
  );
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Valide une valeur texte brute saisie dans l’input.
   *
   * Ordre de validation :
   * 1. présence d’une valeur
   * 2. validité de la date au format `MM/DD/YYYY`
   * 3. validation métier personnalisée
   *
   * @param {string} value - Valeur brute du champ texte.
   * @returns {MaskedDateValidationResult}
   * Retourne la date validée et le message d’erreur associé.
   */
  function validateValue(value) {
    if (!value.trim()) {
      return { date: null, error: requiredMessage };
    }

    const parsed = parseUSDate(value);

    if (!parsed) {
      return { date: null, error: invalidMessage };
    }

    if (!isDateAllowed(parsed)) {
      return { date: null, error: notAllowedMessage };
    }

    return { date: parsed, error: "" };
  }

  /**
   * Gère la saisie manuelle dans l’input.
   *
   * Tant que l’utilisateur n’a pas saisi une valeur complète,
   * seule la valeur texte est mise à jour.
   *
   * Dès que la longueur attendue est atteinte, une validation est lancée.
   * En cas d’erreur, le calendrier est refermé.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * Événement déclenché par la modification du champ texte.
   *
   * @returns {void}
   */
  function handleInputChange(e) {
    const value = e?.target?.value || "";
    setInputValue(value);

    if (value.length < 10) {
      if (error) setError("");
      return;
    }

    const result = validateValue(value);

    if (result.error) {
      setError(result.error);
      setIsOpen(false);
      return;
    }

    setDate(result.date);
    setError("");
  }

  /**
   * Gère la validation finale du champ lorsqu’il perd le focus.
   *
   * Si la valeur affichée est invalide :
   * - la date validée est supprimée
   * - le message d’erreur est mis à jour
   * - le calendrier est fermé
   *
   * Si la valeur est valide :
   * - la date validée est enregistrée
   * - la valeur texte est reformattée proprement
   * - l’erreur est effacée
   *
   * @returns {void}
   */
  function handleBlur() {
    const result = validateValue(inputValue);

    if (result.error) {
      setDate(null);
      setError(result.error);
      setIsOpen(false);
      return;
    }

    setDate(result.date);
    setInputValue(formatUSDate(result.date));
    setError("");
  }

  /**
   * Gère la sélection d’une date depuis le calendrier du DatePicker.
   *
   * Si l’utilisateur efface la date depuis le calendrier :
   * - le champ texte est vidé
   * - la date validée est supprimée
   *
   * Si la date sélectionnée n’est pas autorisée par la règle métier :
   * - la date est rejetée
   * - un message d’erreur est affiché
   * - le calendrier est fermé
   *
   * Si la date est valide :
   * - la date est enregistrée
   * - le texte est synchronisé au format `MM/DD/YYYY`
   * - le calendrier est fermé
   *
   * @param {Date|null} newDate - Date sélectionnée depuis le calendrier.
   * @returns {void}
   */
  function handleDatePickerChange(newDate) {
    if (!newDate) {
      setDate(null);
      setInputValue("");
      setError("");
      return;
    }

    if (!isDateAllowed(newDate)) {
      setDate(null);
      setError(notAllowedMessage);
      setIsOpen(false);
      return;
    }

    setDate(newDate);
    setInputValue(formatUSDate(newDate));
    setError("");
    setIsOpen(false);
  }

  /**
   * Réinitialise complètement l’état du champ date.
   *
   * Cette méthode :
   * - remplace la date courante par une nouvelle date éventuelle
   * - resynchronise le texte affiché
   * - efface le message d’erreur
   * - referme le calendrier
   *
   * @param {Date|null} [nextDate=null]
   * Nouvelle date à appliquer après réinitialisation.
   *
   * @returns {void}
   */
  function reset(nextDate = null) {
    setDate(nextDate);
    setInputValue(nextDate ? formatUSDate(nextDate) : "");
    setError("");
    setIsOpen(false);
  }

  return {
    date,
    inputValue,
    error,
    isOpen,
    setIsOpen,
    setError,
    handleInputChange,
    handleBlur,
    handleDatePickerChange,
    reset,
  };
}
