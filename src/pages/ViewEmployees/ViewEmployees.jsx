import { useState, useMemo } from "react";
import DataTableBase from "../../components/DataTableBase/DataTableBase";
import styles from "./viewemployees.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmployee } from "../../store/employeesSlice";
import { Trash2, Check } from "lucide-react";
import HRnet_modal from "@delaroche/hrnet-modal";
import "@delaroche/hrnet-modal/style.css";
import normalizeSearch from "../../utils/normalizeSearch";
import { formatIsoUS } from "../../hooks/useMaskedDateFieldUs";
/**
 * Page d’affichage des employés.
 *
 * Ce composant permet de consulter, filtrer, sélectionner et supprimer
 * les employés enregistrés dans le store Redux.
 *
 * Fonctionnalités principales :
 * - récupération des employés depuis Redux ;
 * - recherche globale insensible à la casse et aux accents ;
 * - filtrage multi-mots ;
 * - formatage des dates ISO au format américain ;
 * - sélection manuelle de lignes via cases à cocher accessibles ;
 * - styles alternés sur les lignes filtrées ;
 * - suppression sécurisée avec modale de confirmation ;
 * - affichage du tableau via un composant DataTable réutilisable.
 *
 * @component
 * @returns {JSX.Element} Page contenant la liste des employés.
 */
function ViewEmployees() {
  // Permet de déclencher des actions Redux.
  const dispatch = useDispatch();

  // Récupère la liste des employés depuis le store Redux.
  const employees = useSelector((state) => state.employees.employees);

  // Contrôle l’ouverture et la fermeture de la modale de confirmation.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stocke l’employé actuellement sélectionné pour suppression.
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Stocke la valeur saisie dans le champ de recherche.
  const [search, setSearch] = useState("");

  // Stocke les identifiants des employés sélectionnés dans le tableau.
  const [selectedRows, setSelectedRows] = useState([]);

  /**
   * Ouvre la modale de confirmation pour l’employé ciblé.
   *
   * @param {Object} employee - Employé sélectionné.
   * @returns {void}
   */
  function handleDeleteClick(employee) {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  }

  /**
   * Annule la suppression et réinitialise l’employé sélectionné.
   *
   * @returns {void}
   */
  function cancelDelete() {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  }

  /**
   * Confirme la suppression de l’employé sélectionné.
   *
   * Si aucun employé n’est sélectionné, la fonction s’arrête.
   *
   * @returns {void}
   */
  function confirmDelete() {
    if (!selectedEmployee) return;

    dispatch(deleteEmployee(selectedEmployee.id));
    setIsModalOpen(false);
    setSelectedEmployee(null);
  }

  /**
   * Ajoute ou retire un employé de la sélection manuelle.
   *
   * Cette sélection personnalisée remplace `selectableRows`
   * de DataTable afin de garder un meilleur contrôle sur l’accessibilité.
   *
   * @param {string} employeeId - Identifiant unique de l’employé.
   * @returns {void}
   */
  function toggleEmployee(employeeId) {
    setSelectedRows((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  }

  /**
   * Configuration des colonnes du tableau.
   *
   * Chaque colonne définit :
   * - un identifiant ;
   * - un libellé d’en-tête ;
   * - un sélecteur de donnée ;
   * - l’activation éventuelle du tri ;
   * - un formatage personnalisé si nécessaire.
   */
  const columns = [
    // Colonne de sélection accessible.
    {
      id: "select",
      name: <span className={styles.headerCell}>Select</span>,
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => toggleEmployee(row.id)}
          aria-label={`Select employee ${row.firstName} ${row.lastName}`}
        />
      ),
      ignoreRowClick: true,
    },

    // Colonnes principales triables.
    {
      id: "firstName",
      name: <span className={styles.headerCell}>First Name</span>,
      selector: (row) => row.firstName,
      sortable: true,
      wrap: true,
    },

    {
      id: "lastName",
      name: <span className={styles.headerCell}>Last Name</span>,
      selector: (row) => row.lastName,
      sortable: true,
      wrap: true,
    },

    // Date de début formatée en MM/DD/YYYY à l’affichage.
    {
      id: "startDate",
      name: <span className={styles.headerCell}>Start Date</span>,
      selector: (row) => row.startDate,
      sortable: true,
      format: (row) => formatIsoUS(row.startDate),
      wrap: true,
    },

    {
      id: "department",
      name: <span className={styles.headerCell}>Department</span>,
      selector: (row) => row.department,
      sortable: true,
      wrap: true,
    },

    // Date de naissance formatée en MM/DD/YYYY à l’affichage.
    {
      id: "dateOfBirth",
      name: <span className={styles.headerCell}>Date of Birth</span>,
      selector: (row) => row.dateOfBirth,
      sortable: true,
      format: (row) => formatIsoUS(row.dateOfBirth),
      wrap: true,
    },

    {
      id: "street",
      name: <span className={styles.headerCell}>Street</span>,
      selector: (row) => row.street,
      sortable: true,
    },

    {
      id: "city",
      name: <span className={styles.headerCell}>City</span>,
      selector: (row) => row.city,
      sortable: true,
      wrap: true,
    },

    {
      id: "stateUS",
      name: <span className={styles.headerCell}>State</span>,
      selector: (row) => row.stateUS,
      sortable: true,
      wrap: true,
    },

    {
      id: "zipCode",
      name: <span className={styles.headerCell}>Zip Code</span>,
      selector: (row) => row.zipCode,
      sortable: true,
      wrap: true,
    },

    // Colonne d’action pour lancer la suppression.
    {
      id: "actions",
      name: <span className={styles.headerCell}>Actions</span>,
      cell: (row) => (
        <button
          type="button"
          className={styles.listemployees__delete}
          aria-label={`Delete employee ${row.firstName} ${row.lastName}`}
          onClick={() => handleDeleteClick(row)}
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  /**
   * Styles personnalisés appliqués au composant DataTable.
   *
   * Ils permettent d’améliorer :
   * - la hauteur des lignes ;
   * - le retour à la ligne des en-têtes ;
   * - la lisibilité des cellules ;
   * - la gestion des contenus longs.
   */
  const customStyles = {
    rows: {
      style: {
        minHeight: "72px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "0px",
        paddingRight: "0px",
        whiteSpace: "normal",
        lineHeight: "1.3",
      },
    },
    cells: {
      style: {
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingTop: "0px",
        paddingBottom: "0px",
        whiteSpace: "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-word",
        lineHeight: "1.3",
      },
    },
  };

  /**
   * Styles conditionnels des lignes du tableau.
   *
   * Utilise l’index visuel `rowIndex` ajouté après filtrage,
   * afin de conserver une alternance correcte même après recherche.
   */
  const conditionalRowStyles = [
    {
      when: (row) => row.rowIndex % 2 === 0,
      style: {
        backgroundColor: "#f9f9f9",
      },
    },
  ];

  /**
   * Liste filtrée des employés.
   *
   * `useMemo` évite de recalculer le filtrage à chaque rendu
   * si `employees` et `search` n’ont pas changé.
   *
   * La recherche est :
   * - insensible à la casse ;
   * - insensible aux accents ;
   * - compatible avec plusieurs mots ;
   * - appliquée à plusieurs champs de l’employé.
   */
  const filteredEmployees = useMemo(() => {
    // Normalise la saisie utilisateur.
    const normalizedSearch = normalizeSearch(search);

    // Si le champ est vide, tous les employés sont conservés.
    const filtered = !normalizedSearch
      ? employees
      : employees.filter((employee) => {
          // Construit une chaîne unique contenant les champs recherchables.
          const searchableText = normalizeSearch(
            [
              employee.firstName,
              employee.lastName,
              formatIsoUS(employee.startDate),
              employee.department,
              formatIsoUS(employee.dateOfBirth),
              employee.street,
              employee.city,
              employee.stateUS,
              employee.zipCode,
            ]
              .filter(Boolean)
              .join(" "),
          );

          // Découpe la recherche en mots indépendants.
          const words = normalizedSearch.split(/\s+/);

          // Tous les mots saisis doivent être présents dans le texte recherché.
          return words.every((word) => searchableText.includes(word));
        });

    // Ajoute un index visuel utilisé pour les styles alternés.
    return filtered.map((emp, i) => ({
      ...emp,
      rowIndex: i,
    }));
  }, [employees, search]);

  /**
   * Sous-en-tête du tableau contenant le champ de recherche.
   *
   * Le champ est relié à un texte d’aide invisible
   * pour améliorer l’accessibilité avec les lecteurs d’écran.
   */
  const subHeaderComponent = (
    <div className={styles.listemployees__filter}>
      <label
        htmlFor="employee-search"
        className={styles.listemployees__filter_label}
      >
        Search
      </label>

      <input
        id="employee-search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search an employee"
        className={styles.listemployees__filter_input}
        aria-describedby="employee-search-help"
      />

      <p id="employee-search-help" className={styles.srOnly}>
        Search employees by first name, last name, department, city, state or
        zip code.
      </p>
    </div>
  );

  return (
    <section className={styles.listemployees}>
      <h1 className={styles.listemployees__title}>Current Employees</h1>

      <div className={styles.listemployees__table}>
        <DataTableBase
          columns={columns}
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
          noDataComponent="No employee found"
          data={filteredEmployees}
          subHeader
          subHeaderComponent={subHeaderComponent}
        />
      </div>

      <HRnet_modal
        isOpen={isModalOpen}
        title="Delete employee"
        showCancelButton={true}
        cancelIcon={<Check size={16} />}
        showConfirmButton={true}
        confirmButtonColor="var(--color-primary)"
        confirmIcon={<Trash2 size={16} />}
        fontFamily="Avenir, Helvetica, Arial, sans-serif"
        message={
          selectedEmployee
            ? `Are you sure you want to delete ${selectedEmployee.firstName} ${selectedEmployee.lastName}?`
            : "Are you sure you want to delete this employee?"
        }
        onClose={cancelDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        cancelText="Cancel"
        confirmText="Delete"
        bodyClassName={styles.test}
        mobileMode="bottom-sheet"
      />
    </section>
  );
}

export default ViewEmployees;
