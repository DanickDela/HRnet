import { createSlice } from "@reduxjs/toolkit";
import { generateEmployees } from "../data/generateEmployees";

/**
 * Jeu de données par défaut utilisé en secours
 * lorsqu'aucune liste valide n'est trouvée dans le localStorage.
 *
 * @type {Array<Object>}
 */
const defaultEmployees = generateEmployees(100);

/**
 * État Redux du slice employees.
 *
 * @typedef {Object} EmployeesState
 * @property {Array<Object>} employees - Liste des employés enregistrés.
 */

/**
 * État initial du slice employees.
 *
 * La liste est récupérée depuis le localStorage si elle existe,
 * sinon un tableau vide est utilisé jusqu’au dispatch de `loadEmployees`.
 *
 * @type {EmployeesState}
 */
const initialState = {
  employees: JSON.parse(localStorage.getItem("employees")) || [],
};

/**
 * Slice Redux chargé de la gestion des employés.
 *
 * Ce slice gère :
 * - le chargement des employés depuis le localStorage
 * - le chargement d’un jeu de données par défaut si aucun stockage n’existe
 * - l’ajout d’un employé
 * - la suppression d’un employé
 *
 * Chaque modification synchronise également les données
 * avec le localStorage.
 */
const employeesSlice = createSlice({
  name: "employees",
  initialState,

  reducers: {
    /**
     * Charge les employés depuis le localStorage.
     *
     * Comportement :
     * - si une liste non vide existe, elle est injectée dans le store
     * - sinon, un jeu de données fictif est chargé
     * - ce jeu de données est également sauvegardé dans le localStorage
     *
     * @param {EmployeesState} state - État courant du slice.
     * @returns {void}
     */
    loadEmployees: (state) => {
      const stored = localStorage.getItem("employees");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (parsed.length > 0) {
          state.employees = parsed;
          return;
        }
      }

      // Données de tests
      state.employees = defaultEmployees;
      localStorage.setItem("employees", JSON.stringify(defaultEmployees));
    },

    /**
     * Ajoute un nouvel employé dans le store
     * puis met à jour le localStorage.
     *
     * @param {EmployeesState} state - État courant du slice.
     * @param {{ payload: Object }} action - Action Redux contenant le nouvel employé.
     * @returns {void}
     */
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
      localStorage.setItem("employees", JSON.stringify(state.employees));
    },

    /**
     * Supprime un employé à partir de son identifiant
     * puis met à jour le localStorage.
     *
     * @param {EmployeesState} state - État courant du slice.
     * @param {{ payload: string }} action - Action Redux contenant l’id à supprimer.
     * @returns {void}
     */
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (employee) => employee.id !== action.payload,
      );

      localStorage.setItem("employees", JSON.stringify(state.employees));
    },
  },
});

/**
 * Actions Redux exportées du slice employees.
 *
 * - `loadEmployees` : charge les données
 * - `addEmployee` : ajoute un employé
 * - `deleteEmployee` : supprime un employé
 */
export const { loadEmployees, addEmployee, deleteEmployee } =
  employeesSlice.actions;

/**
 * Reducer principal du slice employees.
 *
 * @type {import("redux").Reducer<EmployeesState>}
 */
export default employeesSlice.reducer;
