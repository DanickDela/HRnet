/**
 * Redux store configuration.
 *
 * This file initializes the global Redux store using Redux Toolkit.
 * It combines multiple slice reducers to manage the application's state.
 *
 * Slices:
 * - auth: manages authentication state (token)
 * - user: manages user profile data and related status
 *
 * @module store
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";

/**
 * The application's Redux store.
 *
 * Provides a centralized state container for the entire app,
 * enabling predictable state management.
 *
 * @type {import("@reduxjs/toolkit").EnhancedStore}
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
