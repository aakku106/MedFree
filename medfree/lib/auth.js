import { auth } from "@clerk/nextjs/server";

/**
 * Check if the current user has admin or agent role
 * @returns {Promise<{isAuthorized: boolean, userId: string | null, role: string | null}>}
 */
export async function checkAdminRole() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { isAuthorized: false, userId: null, role: null };
  }

  // Get role from Clerk metadata
  const role = sessionClaims?.metadata?.role || "user";
  const isAuthorized = role === "admin" || role === "agent";

  return { isAuthorized, userId, role };
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
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  return {
    userId,
    role: sessionClaims?.metadata?.role || "user",
    email: sessionClaims?.email,
    name:
      sessionClaims?.firstName && sessionClaims?.lastName
        ? `${sessionClaims.firstName} ${sessionClaims.lastName}`
        : sessionClaims?.email?.split("@")[0] || "User",
  };
}
