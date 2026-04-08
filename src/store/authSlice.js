import { createSlice } from "@reduxjs/toolkit";

/**
 * État d'authentification.
 *
 * @typedef {Object} AuthState
 * @property {string|null} token - Token JWT de l'utilisateur connecté.
 */

/**
 * État initial du slice d'authentification.
 *
 * Le token est recherché en priorité dans :
 * - localStorage pour une session persistante
 * - sessionStorage pour une session temporaire
 * - sinon la valeur est null
 *
 * @type {AuthState}
 */
const initialState = {
  token:
    localStorage.getItem("token") || sessionStorage.getItem("token") || null,
};

/**
 * Slice Redux chargé de la gestion de l'authentification utilisateur.
 *
 * Ce slice gère :
 * - le token de l'utilisateur
 * - sa suppression lors de la déconnexion
 *
 * @module authSlice
 */
const authSlice = createSlice({
  /**
   * Nom du slice, utilisé notamment pour préfixer les types d'actions
   * dans Redux DevTools.
   */
  name: "auth",

  initialState,

  reducers: {
    /**
     * Stocke le token d'authentification dans le state Redux.
     *
     * Type d'action généré : `auth/setToken`
     *
     * @param {AuthState} state - État courant du slice
     * @param {{ payload: string }} action - Action Redux contenant le token JWT
     */
    setToken: (state, { payload }) => {
      state.token = payload;
      if (payload.remember) {
        localStorage.setItem("token", payload.token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", payload.token);
        localStorage.removeItem("token");
      }
    },

    /**
     * Supprime le token d'authentification du state Redux
     * ainsi que du localStorage et du sessionStorage.
     *
     * Type d'action généré : `auth/clearToken`
     *
     * @param {AuthState} state - État courant du slice
     */
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
});

/**
 * Actions Redux générées automatiquement par createSlice.
 *
 * @type {{
 *   setToken: (payload: string) => { type: string, payload: string },
 *   clearToken: () => { type: string }
 * }}
 */
export const { setToken, clearToken } = authSlice.actions;

/**
 * Reducer du slice d'authentification.
 */
export default authSlice.reducer;
