/**
 * Admin Configuration
 *
 * Simple email-based admin system.
 * Add admin and agent email addresses to the arrays below.
 */

// Admin users (full access)
export const ADMIN_EMAILS = [
  // Add your admin email addresses here
  "adarasha.gaihre106@gmail.com", // Replace with your actual Clerk account email
];

// Agent users (limited admin access)
export const AGENT_EMAILS = [
  // Add agent email addresses here
  // "agent1@example.com",
];

/**
 * Check if a user is an admin
 * @param {string} email - User's email address
 * @returns {boolean}
 */
export function isAdmin(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if a user is an agent
 * @param {string} email - User's email address
 * @returns {boolean}
 */
export function isAgent(email) {
  if (!email) return false;
  return AGENT_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if a user has admin or agent access
 * @param {string} email - User's email address
 * @returns {boolean}
 */
export function hasAdminAccess(email) {
  return isAdmin(email) || isAgent(email);
}

/**
 * Get user role based on email
 * @param {string} email - User's email address
 * @returns {string} - "admin", "agent", or "user"
 */
export function getUserRole(email) {
  if (isAdmin(email)) return "admin";
  if (isAgent(email)) return "agent";
  return "user";
}
