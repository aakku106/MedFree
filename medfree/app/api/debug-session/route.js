import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({
        error: "Not authenticated",
        authenticated: false,
      });
    }

    // Extract role from publicMetadata
    const publicMetadata = sessionClaims?.publicMetadata || {};
    const role = publicMetadata.role || "user";

    // Log everything to console for debugging
    console.log("=== CLERK DEBUG SESSION ===");
    console.log("User ID:", userId);
    console.log("Public Metadata:", JSON.stringify(publicMetadata, null, 2));
    console.log("Extracted Role:", role);
    console.log("Has Admin Access:", role === "admin" || role === "agent");
    console.log("=========================");

    return NextResponse.json({
      authenticated: true,
      userId,
      publicMetadata,
      role,
      hasAdminAccess: role === "admin" || role === "agent",
      fullSessionClaims: sessionClaims,
    });
  } catch (error) {
    console.error("Debug session error:", error);
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
