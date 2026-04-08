/**
 * Redux slice for managing user profile state.
 *
 * This slice handles:
 * - Fetching user profile from the API
 * - Storing user information (firstName, lastName)
 * - Managing request status (idle, loading, succeeded, failed)
 * - Handling errors during API calls
 *
 * It uses Redux Toolkit's createAsyncThunk for asynchronous logic
 * and createSlice for state management.
 */

import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile } from "../service/api";

/**
 * Async thunk to fetch the authenticated user's profile.
 *
 * Behavior:
 * - Sends a request to the API using the provided token
 * - Returns user data on success
 * - Returns a custom error message on failure
 * - Prevents duplicate requests using the condition function
 *
 * @function fetchUserProfile
 * @param {string} token - Authentication token (JWT)
 * @returns {Promise<Object>} The user profile data
 */
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (token, thunkAPI) => {
    try {
      return await getUserProfile(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Server error",
      );
    }
  },
  {
    /**
     * Prevents unnecessary or duplicate API calls.
     *
     * Conditions:
     * - Blocks request if already loading
     * - Blocks request if data is already successfully fetched
     *
     * @param {string} token
     * @param {Object} options
     * @param {Function} options.getState - Function to access current Redux state
     * @returns {boolean} Whether the request should proceed
     */
    condition: (token, { getState }) => {
      const { user } = getState();

      if (user.status === "loading") return false;
      if (user.status === "succeeded") return false;

      return true;
    },
  },
);

/**
 * User slice definition.
 *
 * State:
 * - firstName: user's first name
 * - lastName: user's last name
 * - status: request status (idle | loading | succeeded | failed)
 * - error: error message if request fails
 */
const userSlice = createSlice({
  name: "user",
  initialState: {
    firstName: "",
    lastName: "",
    status: "idle",
    error: null,
  },

  reducers: {
    /**
     * Sets the user profile in the Redux store.
     *
     * @param {Object} state
     * @param {Object} action
     * @param {string} action.payload.firstName
     * @param {string} action.payload.lastName
     */
    setUserProfile: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },

    /**
     * Clears the user profile and resets state.
     *
     * @param {Object} state
     */
    clearUserProfile: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /**
       * Handles pending state of fetchUserProfile.
       */
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      /**
       * Handles successful fetch of user profile.
       */
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.status = "succeeded";
        state.error = null;
      })

      /**
       * Handles failed fetch of user profile.
       */
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.firstName = "";
        state.lastName = "";
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { clearUserProfile, setUserProfile } = userSlice.actions;
export default userSlice.reducer;
