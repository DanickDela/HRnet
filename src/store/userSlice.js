import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile } from "../service/api";

/**
 * Thunk asynchrone chargé de récupérer le profil utilisateur
 * depuis l’API à partir d’un token d’authentification.
 *
 * Comportement :
 * - en cas de succès, les données du profil sont renvoyées
 * - en cas d’échec, un message d’erreur est transmis via `rejectWithValue`
 *
 * @function fetchUserProfile
 * @param {string} token - Token JWT utilisé pour authentifier la requête.
 * @returns {Promise<Object|string>} Les données du profil utilisateur ou un message d’erreur.
 */
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      return await getUserProfile(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * État Redux du slice user.
 *
 * @typedef {Object} UserState
 * @property {string} firstName - Prénom de l’utilisateur.
 * @property {string} lastName - Nom de l’utilisateur.
 * @property {string} email - Adresse email de l’utilisateur.
 * @property {"idle"|"loading"|"succeeded"|"failed"} status - Statut de la requête de récupération du profil.
 * @property {string|null} error - Message d’erreur éventuel.
 */

/**
 * Slice Redux chargé de la gestion du profil utilisateur.
 *
 * Ce slice gère :
 * - le stockage local des informations du profil
 * - la mise à jour manuelle des données utilisateur
 * - la réinitialisation du profil
 * - la récupération asynchrone du profil depuis l’API
 *
 * Le cycle asynchrone est piloté via `createAsyncThunk`
 * et traité dans `extraReducers`.
 */
const userSlice = createSlice({
  name: "user",

  /**
   * État initial du slice user.
   *
   * @type {UserState}
   */
  initialState: {
    firstName: "",
    lastName: "",
    email: "",
    status: "idle",
    error: null,
  },

  reducers: {
    /**
     * Met à jour manuellement les informations du profil utilisateur.
     *
     * Cette action est utile lorsque les données sont déjà connues
     * ou lorsqu’une mise à jour locale du profil est nécessaire.
     *
     * @param {UserState} state - État courant du slice.
     * @param {{ payload: { firstName: string, lastName: string, email?: string } }} action - Action Redux contenant les nouvelles données du profil.
     * @returns {void}
     */
    setUserProfile: (state, { payload }) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.email = payload.email || "";
      state.error = null;
    },

    /**
     * Réinitialise complètement le profil utilisateur dans le store.
     *
     * Cette action efface les données personnelles
     * et remet le statut du slice à son état initial.
     *
     * @param {UserState} state - État courant du slice.
     * @returns {void}
     */
    clearUserProfile: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /**
       * Déclenché lorsque la récupération du profil commence.
       *
       * Met le slice en état de chargement
       * et réinitialise l’erreur éventuelle.
       */
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      /**
       * Déclenché lorsque la récupération du profil réussit.
       *
       * Met à jour les informations utilisateur
       * et passe le statut à `succeeded`.
       */
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.error = null;
      })

      /**
       * Déclenché lorsque la récupération du profil échoue.
       *
       * Passe le statut à `failed`
       * et enregistre le message d’erreur retourné.
       */
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to fetch user profile";
      });
  },
});

/**
 * Actions Redux exportées du slice user.
 *
 * - `setUserProfile` : met à jour manuellement le profil
 * - `clearUserProfile` : réinitialise complètement le profil
 */
export const { setUserProfile, clearUserProfile } = userSlice.actions;

/**
 * Reducer principal du slice user.
 *
 * @type {import("redux").Reducer<UserState>}
 */
export default userSlice.reducer;
