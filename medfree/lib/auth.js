import { auth, clerkClient } from "@clerk/nextjs/server";
import { hasAdminAccess, getUserRole } from "./admin-config";

/**
 * Check if the current user has admin or agent access
 * @returns {Promise<boolean>}
 */
export async function checkAdminRole() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;
    return email ? hasAdminAccess(email) : false;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Get the current user's role based on email
 * @returns {Promise<string>} - "admin", "agent", or "user"
 */
export async function getCurrentUserRole() {
  const { userId } = await auth();

  if (!userId) {
    return "user";
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;
    return email ? getUserRole(email) : "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "user";
  }
}
/**
 * Get current user ID from Clerk session
 * @returns {Promise<string | null>}
 */
export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Get user metadata from Clerk
 * @returns {Promise<Object | null>}
 */
export async function getUserMetadata() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;
    const role = email ? getUserRole(email) : "user";

    return {
      userId,
      role,
      email,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : email?.split("@")[0] || "User",
    };
  } catch (error) {
    console.error("Error getting user metadata:", error);
    return {
      userId,
      role: "user",
      email: null,
      name: "User",
    };
  }
}
