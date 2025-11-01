import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasAdminAccess, getUserRole } from "@/lib/admin-config";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        error: "Not signed in",
      });
    }

    // Fetch full user data from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const email = user.emailAddresses?.[0]?.emailAddress || null;

    const role = email ? getUserRole(email) : "user";
    const adminAccess = email ? hasAdminAccess(email) : false;

    console.log("=== USER DEBUG ===");
    console.log("User ID:", userId);
    console.log("Email:", email);
    console.log("Has Admin Access:", adminAccess);
    console.log("==================");

    return NextResponse.json({
      authenticated: true,
      userId,
      email,
      role,
      hasAdminAccess: adminAccess,
      message: adminAccess
        ? "✅ You have admin access!"
        : email
        ? `❌ Add "${email}" to ADMIN_EMAILS in lib/admin-config.js`
        : "❌ Email not found in user account.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
