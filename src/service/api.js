/**
 * Mock service layer for user authentication and profile management.
 *
 * This module simulates an API without any backend.
 * It centralizes mock requests for:
 * - User login
 * - Fetching user profile
 * - Updating user profile
 */

import mockUser from "../data/admin";

const FAKE_TOKEN = "mock-jwt-token";

/**
 * Simulates a login request.
 *
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<string>} Fake authentication token
 *
 * @throws {Error} Throws an error if credentials are invalid
 */
export async function loginUser(email, password) {
  await fakeDelay();

  if (email === mockUser.email && password === mockUser.password) {
    return FAKE_TOKEN;
  }

  throw new Error("Invalid email or password");
}

/**
 * Simulates fetching the authenticated user's profile.
 *
 * @param {string} token - Fake authentication token
 * @returns {Promise<Object>} User profile data
 *
 * @throws {Error} Throws an error if token is invalid
 */
export async function getUserProfile(token) {
  await fakeDelay();

  if (token !== FAKE_TOKEN) {
    throw new Error("Invalid token");
  }

  return {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
  };
}

/**
 * Simulates updating the authenticated user's profile.
 *
 * @param {string} token - Fake authentication token
 * @param {string} firstName - Updated first name
 * @param {string} lastName - Updated last name
 * @returns {Promise<Object>} Updated user profile data
 *
 * @throws {Error} Throws an error if token is invalid or data is missing
 */
export async function patchUserProfile(token, firstName, lastName) {
  await fakeDelay();

  if (token !== FAKE_TOKEN) {
    throw new Error("Invalid token");
  }

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  mockUser.firstName = firstName;
  mockUser.lastName = lastName;

  return {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
  };
}

/**
 * Small helper to simulate network latency.
 *
 * @returns {Promise<void>}
 */
function fakeDelay() {
  return new Promise((resolve) => setTimeout(resolve, 300));
}
