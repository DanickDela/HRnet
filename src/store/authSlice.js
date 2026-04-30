/**
 * Slice Redux dédié à l’authentification utilisateur.
 *
 * Ce module gère l’état lié à la session courante,
 * principalement le jeton d’authentification (`token`).
 *
 * Il utilise `createSlice()` de Redux Toolkit afin de :
 *
 * - définir l’état initial ;
 * - créer automatiquement les actions Redux ;
 * - simplifier l’écriture des reducers immuables ;
 * - centraliser la logique d’authentification.
 *
 * Fonctionnalités couvertes :
 *
 * - récupération automatique du token stocké ;
 * - connexion utilisateur via enregistrement du token ;
 * - déconnexion via suppression du token ;
 * - synchronisation entre Redux et le stockage navigateur.
 *
 * Sources de persistance consultées au chargement :
 *
 * 1. `localStorage`
 * 2. `sessionStorage`
 *
 * Si aucun token n’est trouvé, l’état démarre à `null`.
 *
 * @module authSlice
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice Redux de gestion de l’authentification.
 *
 * Nom du slice : `auth`
 *
 * Structure du state :
 *
 * ```js
 * {
 *   token: string | null
 * }
 * ```
 *
 * @constant
 */
const authSlice = createSlice({
  name: "auth",

  initialState: {
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  },

  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },

    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
