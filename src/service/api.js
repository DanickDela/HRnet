/**
 * API service layer for user authentication and profile management.
 *
 * This module centralizes all HTTP requests related to:
 * - User login
 * - Fetching user profile
 * - User signup
 * - Updating user profile
 *
 * It uses Axios for HTTP requests and provides consistent error handling.
 */

import axios from "axios";

const API_URL = "http://localhost:3001/api/v1";

/**
 * Logs in a user and retrieves a JWT token.
 *
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<string>} JWT authentication token
 *
 * @throws {Error} Throws an error if credentials are invalid or server is unavailable
 */
export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/user/login`, {
      email,
      password,
    });

    return response.data.body.token;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message || "Invalid email or password",
      );
    }

    if (error.response?.status === 500) {
      throw new Error("Server error");
    }

    throw new Error("Unable to connect to the server. Please try again later.");
  }
}

/**
 * Fetches the authenticated user's profile.
 *
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} User profile data
 *
 * @throws {Error} Throws an error if the request fails
 */
export async function getUserProfile(token) {
  try {
    const response = await axios.post(
      `${API_URL}/user/profile`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.body;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message);
    }

    if (error.response?.status === 500) {
      throw new Error("Server error");
    }

    throw new Error("Unable to connect to the server. Please try again later.");
  }
}

/**
 * Registers a new user.
 *
 * @param {string} email - User email address
 * @param {string} password - User password
 * @param {string} firstName - User first name
 * @param {string} lastName - User last name
 * @returns {Promise<Object>} Created user data
 *
 * @throws {Error} Throws an error if the request fails
 */
export async function UserSignup(email, password, firstName, lastName) {
  try {
    const response = await axios.post(`${API_URL}/user/signup`, {
      email,
      password,
      firstName,
      lastName,
    });

    return response.data.body;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}

/**
 * Updates the authenticated user's profile.
 *
 * @param {string} token - JWT authentication token
 * @param {string} firstName - Updated first name
 * @param {string} lastName - Updated last name
 * @returns {Promise<Object>} Updated user profile data
 *
 * @throws {Error} Throws an error if the update fails
 */
export async function patchUserProfile(token, firstName, lastName) {
  try {
    const response = await axios.put(
      `${API_URL}/user/profile`,
      {
        firstName,
        lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.body;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response?.data?.message || "Invalid data for profile update",
      );
    }

    if (error.response?.status === 500) {
      throw new Error("Server error");
    }

    throw new Error("Unable to connect to the server. Please try again later.");
  }
}
