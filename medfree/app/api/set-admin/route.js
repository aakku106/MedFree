import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Update the user's public metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "admin",
      },
    });

    console.log(`✅ Set role=admin for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Role set to admin! Now sign out and sign back in.",
      userId,
      newMetadata: {
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
