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
 * Affiche la liste des employés avec recherche, tri, sélection et suppression.
 *
 * Ce composant :
 * - récupère les employés depuis le store Redux ;
 * - filtre les employés avec une recherche globale normalisée ;
 * - formate les dates ISO au format américain ;
 * - ajoute un index visuel pour les lignes alternées ;
 * - affiche une modale de confirmation avant suppression.
 *
 * @component
 * @returns {JSX.Element} Page de liste des employés.
 */
function ViewEmployees() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [search, setSearch] = useState("");

  function handleDeleteClick(employee) {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  }
  function cancelDelete() {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  }

  function confirmDelete() {
    if (!selectedEmployee) return;

    dispatch(deleteEmployee(selectedEmployee.id));
    setIsModalOpen(false);
    setSelectedEmployee(null);
  }

  //ajout de la colonne sans utiliser "selectableRows" de DateTable pour éviter le problème d'accesibilité

  const [selectedRows, setSelectedRows] = useState([]);
  function toggleEmployee(employeeId) {
    setSelectedRows((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  }
  const columns = [
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
      //width: "80px",
    },
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
      // wrap: true,
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

  const conditionalRowStyles = [
    {
      when: (row) => row.rowIndex % 2 === 0,
      style: {
        backgroundColor: "#f9f9f9",
      },
    },
  ];

  const filteredEmployees = useMemo(() => {
    // Normalize the user search to make matching case-insensitive and accent-insensitive.
    const normalizedSearch = normalizeSearch(search);

    // If the search field is empty, keep the full employee list.
    const filtered = !normalizedSearch
      ? employees
      : employees.filter((employee) => {
          // Build one searchable string from the main employee fields.
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

          // Split the search into words so "Joseph Petit" and "Petit Joseph" both match.
          const words = normalizedSearch.split(/\s+/);

          // Every searched word must exist somewhere in the employee searchable text.
          return words.every((word) => searchableText.includes(word));
        });

    // Add a visual index after filtering for alternating row styles.
    return filtered.map((emp, i) => ({
      ...emp,
      rowIndex: i,
    }));
  }, [employees, search]);

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
      ></HRnet_modal>
    </section>
  );
}

export default ViewEmployees;
