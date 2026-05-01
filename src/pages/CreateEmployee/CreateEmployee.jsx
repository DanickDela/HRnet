import { useState, forwardRef } from "react";
import "../../styles/main.scss";
import styles from "./createemployee.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isValidName } from "../../hooks/useRegex";
import {
  useMaskedDateField,
  formatISODate,
} from "../../hooks/useMaskedDateFieldUs";
import departments from "../../data/services.json";
import statesUS from "../../data/states.json";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { addEmployee } from "../../store/employeesSlice";
import { InputMask } from "@react-input/mask";
import { X, Plus, Minus } from "lucide-react";
import HRnet_modal from "@delaroche/hrnet-modal";
import "@delaroche/hrnet-modal/style.css";
import {
  formatName,
  formatZipCode,
  incrementZipCode,
  decrementZipCode,
} from "../../utils/employeesFormatter";

/**
 * Champ de saisie personnalisé utilisé par `react-datepicker`.
 *
 * Ce composant encapsule un champ masqué permettant :
 * - la saisie manuelle d’une date au format américain `MM/DD/YYYY` ;
 * - l’ouverture du calendrier au clic ;
 * - la synchronisation entre la saisie clavier et le composant `DatePicker`.
 *
 * `forwardRef` est nécessaire car `react-datepicker` doit pouvoir accéder
 * directement à l’élément HTML natif `<input>`.
 *
 * @component
 * @param {Object} props - Propriétés injectées automatiquement par `react-datepicker`.
 * @param {string} [props.value] - Valeur actuellement affichée dans le champ.
 * @param {Function} [props.onClick] - Fonction appelée lors du clic sur l’input.
 * @param {Function} [props.onChange] - Fonction appelée lors de la saisie.
 * @param {Function} [props.onBlur] - Fonction appelée à la perte de focus.
 * @param {string} [props.id] - Identifiant HTML du champ.
 * @param {string} [props.name] - Nom HTML du champ.
 * @param {string} [props.className] - Classe CSS appliquée au champ.
 * @param {string} [props.placeholder] - Texte indicatif affiché lorsque le champ est vide.
 * @param {React.Ref<HTMLInputElement>} ref - Référence transmise à l’input natif.
 * @returns {JSX.Element} Champ masqué compatible avec `react-datepicker`.
 */
const CustomDateInput = forwardRef(function CustomDateInput(
  { value, onClick, onChange, onBlur, id, name, className, placeholder },
  ref,
) {
  return (
    <InputMask
      mask="__/__/____"
      replacement={{ _: /\d/ }}
      id={id}
      name={name}
      ref={ref}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      className={className}
      placeholder={placeholder || "MM/DD/YYYY"}
      autoComplete="off"
      inputMode="numeric"
    />
  );
});

/**
 * Page de création d’un employé.
 *
 * Ce composant gère l’ensemble du formulaire de création d’un employé :
 * - saisie des informations personnelles ;
 * - saisie de l’adresse ;
 * - sélection de l’État américain ;
 * - sélection du département ;
 * - validation des champs texte ;
 * - validation des dates via un hook personnalisé ;
 * - formatage du code postal américain ;
 * - création de l’objet employé ;
 * - ajout de l’employé dans le store Redux ;
 * - affichage d’une modale de succès après enregistrement.
 *
 * @component
 * @returns {JSX.Element} Formulaire complet de création d’un employé.
 */
function CreateEmployee() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setState] = useState("AL");
  const [department, setDepartment] = useState("Sales");
  const [zipCode, setZipCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdEmployeeName, setCreatedEmployeeName] = useState("");

  // Dates limites utilisées pour borner les calendriers.
  const today = new Date();

  // Date maximale autorisée pour une date d’entrée : aujourd’hui + 10 ans.
  const future = new Date(today);
  future.setFullYear(today.getFullYear() + 10);

  // Date minimale autorisée pour une date d’entrée.
  const minYear = new Date(today.getFullYear() - 80, 0, 1);

  // Bornes utilisées pour le calendrier de date de naissance.
  const maxBirthDate = new Date();
  const minBirthDate = new Date();
  minBirthDate.setFullYear(maxBirthDate.getFullYear() - 76);

  // Champ de date de naissance géré par un hook personnalisé.
  const birthDateField = useMaskedDateField({
    requiredMessage: "Date of birth is required",
    invalidMessage: "Enter a valid date in mm/dd/yyyy format",
    isDateAllowed: isPlausibleBirthDate,
    notAllowedMessage: "Enter a plausible birth date",
  });

  // Champ de date d’entrée géré par un hook personnalisé.
  const startDateField = useMaskedDateField({
    initialDate: new Date(),
    requiredMessage: "Start date is required",
    invalidMessage: "Enter a valid date in mm/dd/yyyy format",
    isDateAllowed: isPlausibleStartDate,
    notAllowedMessage: "Enter a plausible start date",
  });

  // Centralise les messages d’erreur des champs standards.
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    stateUS: "",
    zipCode: "",
    department: "",
  });

  const stateOptions = statesUS.map((s) => ({
    value: s.abbreviation,
    label: s.name,
  }));

  const departmentOptions = departments.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  /**
   * Réinitialise l’ensemble du formulaire.
   *
   * Cette fonction :
   * - vide les champs texte ;
   * - remet les sélecteurs à leurs valeurs par défaut ;
   * - réinitialise les champs de date ;
   * - supprime tous les messages d’erreur.
   *
   * @returns {void}
   */
  function resetForm() {
    setFirstName("");
    setLastName("");
    setStreet("");
    setCity("");
    setState("AL");
    setZipCode("");
    setDepartment("Sales");

    birthDateField.reset();
    startDateField.reset(new Date());

    setErrors({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      stateUS: "",
      zipCode: "",
      department: "",
    });
  }
  /**
   * Vérifie qu’une date de naissance est plausible.
   *
   * Règles appliquées :
   * - la date ne peut pas être dans le futur ;
   * - la date ne peut pas être antérieure à 120 ans.
   *
   * @param {Date} date - Date de naissance à contrôler.
   * @returns {boolean} `true` si la date est plausible, sinon `false`.
   */
  function isPlausibleBirthDate(date) {
    if (!date) return false;

    const today = new Date();
    const oldestAllowedDate = new Date();
    oldestAllowedDate.setFullYear(today.getFullYear() - 120);

    return date <= today && date >= oldestAllowedDate;
  }
  /**
   * Valide un champ standard du formulaire selon son nom.
   *
   * @param {string} fieldName - Nom du champ à valider.
   * @param {*} fieldValue - Valeur actuelle du champ.
   * @returns {string} Message d’erreur ou chaîne vide si le champ est valide.
   */
  function validateField(fieldName, fieldValue) {
    switch (fieldName) {
      case "firstName": {
        const value = fieldValue.trim();

        if (!value) return "First name is required";
        if (!isValidName(value)) return "Invalid characters in first name";
        if (value.length < 2) {
          return "First name must contain at least 2 characters";
        }

        return "";
      }

      case "lastName": {
        const value = fieldValue.trim();

        if (!value) return "Last name is required";
        if (!isValidName(value)) return "Invalid characters in last name";
        if (value.length < 2) {
          return "Last name must contain at least 2 characters";
        }

        return "";
      }

      case "street": {
        const value = fieldValue.trim();

        if (!value) return "Street is required";
        if (value.length < 3) {
          return "Street must contain at least 3 characters";
        }

        return "";
      }

      case "city": {
        const value = fieldValue.trim();

        if (!value) return "City is required";
        if (!isValidName(value)) return "Invalid characters in city";

        return "";
      }

      case "stateUS":
        if (!fieldValue) return "State is required";
        return "";

      case "zipCode": {
        const value = fieldValue.trim();

        if (!value) return "Zip code is required";
        if (!/^\d{5}(-\d{4})?$/.test(value)) {
          return "Zip code must be in the format 12345 or 12345-6789";
        }

        return "";
      }

      case "department":
        if (!fieldValue) return "Department is required";
        return "";

      default:
        return "";
    }
  }

  /**
   * Vérifie qu’une date d’entrée dans l’entreprise est plausible.
   *
   * Règles appliquées :
   * - la date ne peut pas être trop ancienne ;
   * - la date ne peut pas être trop éloignée dans le futur.
   *
   * @param {Date} date - Date d’entrée à contrôler.
   * @returns {boolean} `true` si la date est plausible, sinon `false`.
   */
  function isPlausibleStartDate(date) {
    if (!date) return false;

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 80, 0, 1);
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 10);

    return date >= minDate && date <= maxDate;
  }

  /**
   * Valide l’ensemble du formulaire avant soumission.
   *
   * Combine :
   * - la validation des champs standards ;
   * - la validation de la date de naissance ;
   * - la validation de la date d’entrée.
   *
   * @returns {boolean} `true` si le formulaire est valide, sinon `false`.
   */
  function validateForm() {
    const newErrors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      street: validateField("street", street),
      city: validateField("city", city),
      stateUS: validateField("stateUS", stateUS),
      zipCode: validateField("zipCode", zipCode),
      department: validateField("department", department),
    };

    setErrors(newErrors);

    const standardFieldsAreValid = Object.values(newErrors).every(
      (error) => error === "",
    );

    const birthDateIsValid = !birthDateField.error && !!birthDateField.date;
    const startDateIsValid = !startDateField.error && !!startDateField.date;

    return standardFieldsAreValid && birthDateIsValid && startDateIsValid;
  }

  /**
   * Construit l’objet employé puis l’enregistre dans Redux.
   *
   * Un identifiant de secours est prévu, car `crypto.randomUUID`
   * peut être indisponible sur certains navigateurs mobiles.
   *
   * @returns {void}
   */
  function saveEmployee() {
    const employee = {
      id:
        crypto.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      firstName: formatName(firstName.trim()),
      lastName: formatName(lastName.trim()),
      dateOfBirth: birthDateField.date
        ? formatISODate(birthDateField.date)
        : "",
      startDate: startDateField.date ? formatISODate(startDateField.date) : "",
      department,
      street: street.trim(),
      city: formatName(city.trim()),
      stateUS,
      zipCode: zipCode.trim(),
    };

    // Ajoute le nouvel employé dans le store Redux.
    dispatch(addEmployee(employee));

    // Prépare le texte affiché dans la modale de succès.
    setCreatedEmployeeName(`${employee.firstName} ${employee.lastName}`);

    // Ouvre la modale de confirmation.
    setIsModalOpen(true);

    // Réinitialise le formulaire après l’enregistrement.
    resetForm();
  }

  /**
   * Valide un champ standard à la perte de focus.
   *
   * @param {string} fieldName - Nom du champ concerné.
   * @param {*} fieldValue - Valeur actuelle du champ.
   * @returns {void}
   */
  function handleBlurField(fieldName, fieldValue) {
    const errorMessage = validateField(fieldName, fieldValue);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  }

  /**
   * Gère la soumission du formulaire.
   *
   * Étapes :
   * - empêche le rechargement de la page ;
   * - force la validation finale des champs de date ;
   * - valide tous les champs standards ;
   * - enregistre l’employé uniquement si le formulaire est valide.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission.
   * @returns {void}
   */
  function handleSubmit(e) {
    e.preventDefault();

    birthDateField.handleBlur();
    startDateField.handleBlur();

    if (!validateForm()) return;

    saveEmployee();
  }

  /**
   * Formate automatiquement le code postal américain pendant la saisie.
   *
   * Formats acceptés :
   * - `12345`
   * - `12345-6789`
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de saisie.
   * @returns {void}
   */
  function handleZipCodeChange(e) {
    let value = e.target.value;

    value = formatZipCode(value);

    setZipCode(value);

    // Efface l’erreur dès que l’utilisateur corrige la saisie.
    if (errors.zipCode) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "",
      }));
    }
  }

  return (
    <section className={styles.createemployee}>
      <h1 id="form-title" className={styles.createemployee__title}>
        Create Employee
      </h1>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className={styles.createemployee__form}
        aria-labelledby="form-title"
      >
        {/* Groupe des champs d’identité. */}
        <div className={styles.identity}>
          <div className={styles.identity__group}>
            <label htmlFor="firstName" className={styles.identity__group_label}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your firstname"
              value={firstName}
              maxLength={20}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={(e) => handleBlurField("firstName", e.target.value)}
              autoComplete="password"
              className={styles.identity__group_input}
              aria-invalid={errors.firstName ? "true" : "false"}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />
            {errors.firstName && (
              <p id="firstName-error" className={styles.error}>
                {errors.firstName}
              </p>
            )}
          </div>

          <div className={styles.identity__group}>
            <label htmlFor="lastName" className={styles.identity__group_label}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your lastname"
              value={lastName}
              maxLength={50}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={(e) => handleBlurField("lastName", e.target.value)}
              autoComplete="password"
              className={styles.identity__group_input}
              aria-invalid={errors.lastName ? "true" : "false"}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className={styles.error}>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Groupe des champs date. */}
        <div className={styles.date}>
          <div className={styles.date__group}>
            <label htmlFor="dateOfBirth" className={styles.date__group_label}>
              Date of Birth
            </label>
            <DatePicker
              id="dateOfBirth"
              name="dateOfBirth"
              strictParsing
              dateFormat="MM/dd/yyyy"
              selected={birthDateField.date}
              value={birthDateField.inputValue}
              open={birthDateField.isOpen}
              onCalendarOpen={() => birthDateField.setIsOpen(true)}
              onCalendarClose={() => birthDateField.setIsOpen(false)}
              onInputClick={() => birthDateField.setIsOpen(true)}
              onChange={birthDateField.handleDatePickerChange}
              onChangeRaw={birthDateField.handleInputChange}
              onBlur={birthDateField.handleBlur}
              popperPlacement="bottom-start"
              peekNextMonth
              showMonthDropdown
              scrollableMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              minDate={minBirthDate}
              maxDate={maxBirthDate}
              todayButton="Aujourd'hui"
              calendarClassName={styles.calendar}
              aria-invalid={birthDateField.error ? "true" : "false"}
              aria-describedby={
                birthDateField.error ? "dateOfBirth-error" : undefined
              }
              customInput={
                <CustomDateInput className={styles.date__group_input} />
              }
            />
            {birthDateField.error && (
              <p id="dateOfBirth-error" className={styles.error}>
                {birthDateField.error}
              </p>
            )}
          </div>

          <div className={styles.date__group}>
            <label htmlFor="startDate" className={styles.date__group_label}>
              Start Date
            </label>
            <DatePicker
              id="startDate"
              name="startDate"
              strictParsing
              dateFormat="MM/dd/yyyy"
              selected={startDateField.date}
              value={startDateField.inputValue}
              open={startDateField.isOpen}
              onCalendarOpen={() => startDateField.setIsOpen(true)}
              onCalendarClose={() => startDateField.setIsOpen(false)}
              onInputClick={() => startDateField.setIsOpen(true)}
              onChange={startDateField.handleDatePickerChange}
              onChangeRaw={startDateField.handleInputChange}
              onBlur={startDateField.handleBlur}
              popperPlacement="bottom-start"
              peekNextMonth
              showMonthDropdown
              scrollableMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              minDate={minYear}
              maxDate={future}
              todayButton="Aujourd'hui"
              calendarClassName={styles.calendar}
              aria-invalid={startDateField.error ? "true" : "false"}
              aria-describedby={
                startDateField.error ? "startDate-error" : undefined
              }
              customInput={
                <CustomDateInput className={styles.date__group_input} />
              }
            />
            {startDateField.error && (
              <p id="startDate-error" className={styles.error}>
                {startDateField.error}
              </p>
            )}
          </div>
        </div>

        {/* Fieldset utilisé pour regrouper sémantiquement les champs d’adresse. */}
        <fieldset className={styles.address}>
          <legend className={styles.address__legend}>Address</legend>

          <div>
            <label htmlFor="street" className={styles.identity__group_label}>
              Street
            </label>
            <input
              id="street"
              name="street"
              type="text"
              maxLength={250}
              placeholder="600 Dexter Ave"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onBlur={(e) => handleBlurField("street", e.target.value)}
              className={styles.createemployee__input}
              autoComplete="password"
            />
            {errors.street && <p className={styles.error}>{errors.street}</p>}
          </div>

          <div className={styles.createemployee__row}>
            <div>
              <label htmlFor="city" className={styles.identity__group_label}>
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Montgomery"
                maxLength={50}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={(e) => handleBlurField("city", e.target.value)}
                className={styles.createemployee__input}
                autoComplete="password"
              />
              {errors.city && <p className={styles.error}>{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="stateUS" className={styles.identity__group_label}>
                State
              </label>
              <Select
                inputId="stateUS"
                name="stateUS"
                options={stateOptions}
                value={stateOptions.find((opt) => opt.value === stateUS)}
                onChange={(opt) => {
                  setState(opt.value);
                  handleBlurField("stateUS", opt.value);
                }}
                classNamePrefix="state"
                isSearchable={false}
              />
              {errors.stateUS && (
                <p className={styles.error}>{errors.stateUS}</p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className={styles.identity__group_label}>
                ZIP Code
              </label>
              <div className={styles.zipcode}>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="password"
                  step="1"
                  placeholder="12345 or 12345-6789"
                  maxLength={10}
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  onBlur={() => handleBlurField("zipCode", zipCode)}
                  className={styles.zipcode__input}
                  aria-invalid={errors.zipCode ? "true" : "false"}
                  aria-describedby={
                    errors.zipCode ? "zipCode-error" : undefined
                  }
                />
                <div className={styles.zipcode__wrapper}>
                  <button
                    type="button"
                    onClick={() => setZipCode((prev) => decrementZipCode(prev))}
                    className={styles.zipcode__wrapper_button}
                    aria-label="Decrease value"
                  >
                    <Minus size={16} strokeWidth={4} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZipCode((prev) => incrementZipCode(prev))}
                    className={styles.zipcode__wrapper_button}
                    aria-label="Increase value"
                  >
                    <Plus size={16} strokeWidth={4} />
                  </button>
                </div>
              </div>
              {errors.zipCode && (
                <p id="zipCode-error" className={styles.error}>
                  {errors.zipCode}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Sélection du département de l’employé. */}
        <div>
          <label htmlFor="department" className={styles.identity__group_label}>
            Department
          </label>
          <Select
            inputId="department"
            name="department"
            options={departmentOptions}
            value={departmentOptions.find((opt) => opt.value === department)}
            onChange={(opt) => {
              setDepartment(opt.value);
              handleBlurField("department", opt.value);
            }}
            classNamePrefix="department"
            placeholder="Select a Department"
            isSearchable={false}
          />
        </div>
        {errors.department && (
          <p className={styles.error}>{errors.department}</p>
        )}

        <button type="submit" className={styles.createemployee__button}>
          Save
        </button>
      </form>

      {/* Modale affichée après la création réussie d’un employé. */}
      <HRnet_modal
        isOpen={isModalOpen}
        title={`Employee Created! ( ${createdEmployeeName} )`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        showCloseIcon={true}
        fontFamily="Avenir, Helvetica, Arial, sans-serif"
        closeButtonClassName={styles.darkClose}
        closeIcon={<X size={25} />}
        overlayPosition="fixed"
        mobileMode="bottom-sheet"
      />
    </section>
  );
}

export default CreateEmployee;
