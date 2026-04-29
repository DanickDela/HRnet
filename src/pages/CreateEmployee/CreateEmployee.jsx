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

/**
 * Champ de saisie personnalisé utilisé par `react-datepicker`.
 *
 * Ce composant encapsule un input masqué afin de permettre :
 * - la saisie manuelle d'une date au format américain `MM/DD/YYYY`
 * - l'ouverture du calendrier au clic
 * - la synchronisation avec le composant `DatePicker`
 *
 * Il est construit avec `forwardRef` afin que `react-datepicker`
 * puisse accéder directement au véritable élément DOM de l’input.
 *
 * @param {Object} props - Propriétés injectées par `react-datepicker`.
 * @param {string} [props.value] - Valeur actuellement affichée dans le champ.
 * @param {Function} [props.onClick] - Gestionnaire déclenché au clic sur l’input.
 * @param {Function} [props.onChange] - Gestionnaire déclenché lors de la saisie.
 * @param {Function} [props.onBlur] - Gestionnaire déclenché à la perte de focus.
 * @param {string} [props.id] - Identifiant HTML du champ.
 * @param {string} [props.name] - Nom HTML du champ.
 * @param {string} [props.className] - Classe CSS appliquée à l’input.
 * @param {string} [props.placeholder] - Texte d’aide affiché si le champ est vide.
 * @param {React.Ref<HTMLInputElement>} ref - Référence transmise à l’input natif.
 * @returns {JSX.Element} Un input masqué compatible avec `react-datepicker`.
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
 * Formulaire de création d’un employé.
 *
 * Ce composant gère :
 * - la saisie des informations personnelles
 * - la validation des champs textuels
 * - la saisie et la validation des dates via un DatePicker masqué
 * - le formatage de certaines valeurs
 * - l’enregistrement final dans le store Redux
 *
 * Les dates sont gérées via le hook réutilisable `useMaskedDateField`,
 * ce qui permet de mutualiser la logique de :
 * - saisie manuelle
 * - validation
 * - gestion des erreurs
 * - synchronisation avec le calendrier
 *
 * @returns {JSX.Element} Le formulaire complet de création d’un employé.
 */
function CreateEmployee() {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setState] = useState("AL");
  const [zipCode, setZipCode] = useState("");
  const [department, setDepartment] = useState("Sales");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdEmployeeName, setCreatedEmployeeName] = useState("");

  /**
   * Vérifie qu’une date de naissance est plausible.
   *
   * Règles appliquées :
   * - la date ne peut pas être dans le futur
   * - la date ne peut pas être antérieure à 120 ans avant aujourd’hui
   *
   * @param {Date} date - Date à contrôler.
   * @returns {boolean} `true` si la date est cohérente, sinon `false`.
   */
  function isPlausibleBirthDate(date) {
    if (!date) return false;

    const today = new Date();
    const oldestAllowedDate = new Date();
    oldestAllowedDate.setFullYear(today.getFullYear() - 120);

    return date <= today && date >= oldestAllowedDate;
  }

  /**
   * Vérifie qu’une date d’entrée dans l’entreprise est plausible.
   *
   * Règles appliquées :
   * - la date ne peut pas être trop ancienne
   * - la date ne peut pas être trop éloignée dans le futur
   *
   * @param {Date} date - Date à contrôler.
   * @returns {boolean} `true` si la date est cohérente, sinon `false`.
   */
  function isPlausibleStartDate(date) {
    if (!date) return false;

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 80, 0, 1);
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 10);

    return date >= minDate && date <= maxDate;
  }

  const today = new Date();
  const future = new Date(today);
  future.setFullYear(today.getFullYear() + 10);

  const minYear = new Date(today.getFullYear() - 80, 0, 1);

  const maxBirthDate = new Date();
  const minBirthDate = new Date();
  minBirthDate.setFullYear(maxBirthDate.getFullYear() - 76);

  const birthDateField = useMaskedDateField({
    requiredMessage: "Date of birth is required",
    invalidMessage: "Enter a valid date in mm/dd/yyyy format",
    isDateAllowed: isPlausibleBirthDate,
    notAllowedMessage: "Enter a plausible birth date",
  });

  const startDateField = useMaskedDateField({
    initialDate: new Date(),
    requiredMessage: "Start date is required",
    invalidMessage: "Enter a valid date in mm/mm/yyyy format",
    isDateAllowed: isPlausibleStartDate,
    notAllowedMessage: "Enter a plausible start date",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    stateUS: "",
    zipCode: "",
    department: "",
  });

  /**
   * Réinitialise l’ensemble du formulaire.
   *
   * Cette fonction :
   * - vide les champs texte
   * - remet les sélecteurs à leur valeur par défaut
   * - réinitialise les champs de date via leur hook dédié
   * - efface tous les messages d’erreur
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
   * Valide un champ standard selon son nom.
   *
   * Cette fonction centralise les règles de validation
   * des champs texte et des sélecteurs.
   *
   * @param {string} fieldName - Nom du champ à valider.
   * @param {*} fieldValue - Valeur actuelle du champ.
   * @returns {string} Une chaîne vide si le champ est valide, sinon un message d’erreur.
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
   * Valide l’ensemble du formulaire avant soumission.
   *
   * Cette validation combine :
   * - les champs standard (texte, sélecteurs)
   * - les champs de date pilotés par les hooks dédiés
   *
   * @returns {boolean} `true` si le formulaire est entièrement valide, sinon `false`.
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
   * Formate une chaîne de caractères en nom propre.
   *
   * Exemple :
   * - `jean` devient `Jean`
   * - `jean-paul` devient `Jean-Paul`
   * - `o'connor` devient `O'Connor`
   *
   * @param {string} value - Texte à formater.
   * @returns {string} Texte formaté avec une capitalisation adaptée.
   */
  function formatName(value) {
    if (!value) return "";

    return value
      .toLowerCase()
      .replace(/(^|\s|-|')\w/g, (char) => char.toUpperCase());
  }

  /**
   * Construit l’objet employé puis l’enregistre dans le store Redux.
   *
   * Les dates sont converties au format `MM/DD/YYYY`
   * avant stockage.
   *
   * @returns {void}
   */
  function saveEmployee() {
    const employee = {
      id: crypto.randomUUID(),
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
    dispatch(addEmployee(employee));
    setCreatedEmployeeName(`${employee.firstName}  ${employee.lastName}`);
    setIsModalOpen(true);
    //Pas de reset du formulaire dans la version initiale. A voir
    resetForm();
  }

  /**
   * Gère la validation d’un champ standard à la perte de focus.
   *
   * @param {string} fieldName - Nom du champ concerné.
   * @param {*} fieldValue - Valeur courante du champ.
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
   * Avant l’enregistrement :
   * - empêche le rechargement de la page
   * - force la validation finale des champs date
   * - valide l’ensemble du formulaire
   * - enregistre l’employé si tout est correct
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission du formulaire.
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
   * Formate le code postal américain pendant la saisie.
   *
   * Formats acceptés :
   * - `12345`
   * - `12345-6789`
   *
   * Cette fonction :
   * - supprime les caractères non autorisés
   * - insère automatiquement le tiret au bon moment
   * - efface l’erreur du champ si la saisie reprend
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de saisie.
   * @returns {void}
   */
  function handleZipCodeChange(e) {
    let value = e.target.value;

    value = value.replace(/[^\d-]/g, "");

    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length <= 5) {
      value = digitsOnly;
    } else {
      value = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 9)}`;
    }

    setZipCode(value);

    if (errors.zipCode) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "",
      }));
    }
  }

  function decrement() {
    setZipCode((prev) => {
      if (prev.includes("-")) {
        const [main, ext] = prev.split("-");
        const nextExt = Math.max(0, Number(ext || 0) - 1);
        return `${main}-${nextExt}`;
      }

      return String(Math.max(0, Number(prev || 0) - 1));
    });
  }

  function increment() {
    setZipCode((prev) => {
      if (prev.includes("-")) {
        const [main, ext] = prev.split("-");
        return `${main}-${Math.min(9999, Number(ext || 0) + 1)}`;
      }

      return String(Math.min(99999, Number(prev || 0) + 1));
    });
  }

  const stateOptions = statesUS.map((s) => ({
    value: s.abbreviation,
    label: s.name,
  }));

  const departmentOptions = departments.map((d) => ({
    value: d.name,
    label: d.name,
  }));

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
                    onClick={decrement}
                    className={styles.zipcode__wrapper_button}
                    aria-label="Decrease value"
                  >
                    <Minus size={16} strokeWidth={4} />
                  </button>
                  <button
                    type="button"
                    onClick={increment}
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
      <HRnet_modal
        isOpen={isModalOpen}
        title={`Employee Created! ( ${createdEmployeeName} )`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        showCloseIcon={true}
        fontFamily="Avenir, Helvetica, Arial, sans-serif"
        closeButtonClassName={styles.darkClose}
        closeIcon={<X size={25} />}
      />
    </section>
  );
}

export default CreateEmployee;
