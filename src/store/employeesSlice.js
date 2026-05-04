import { createSlice } from "@reduxjs/toolkit";
import { generateEmployees } from "../data/generateEmployees";

/**
 * Jeu de données initial (seed)
 */
const defaultEmployees = generateEmployees(100);

/**
 * État initial du slice employees.
 *
 * Les données sont directement chargées en mémoire
 * (aucune dépendance au localStorage).
 */
const initialState = {
  employees: defaultEmployees,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,

  reducers: {
    /**
     * Réinitialise la liste avec 100 employés fictifs.
     * (utile pour debug / reset / tests)
     */
    resetEmployees: (state) => {
      state.employees = generateEmployees(100);
    },

    /**
     * Ajoute un employé
     */
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },

    /**
     * Supprime un employé
     */
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (employee) => employee.id !== action.payload,
      );
    },
  },
});

export const { resetEmployees, addEmployee, deleteEmployee } =
  employeesSlice.actions;

export default employeesSlice.reducer;
