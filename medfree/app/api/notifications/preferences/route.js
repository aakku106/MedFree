import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * GET /api/notifications/preferences
 * Get user's notification preferences
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("medfree");

    const subscription = await db
      .collection("subscriptions")
      .findOne({ userId });

    if (!subscription) {
      return NextResponse.json({
        preferences: {
          serviceReminders: true,
          newServices: true,
          updates: true,
          marketing: false,
        },
        subscribed: false,
      });
    }

    return NextResponse.json({
      preferences: subscription.preferences || {
        serviceReminders: true,
        newServices: true,
        updates: true,
        marketing: false,
      },
      subscribed: true,
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/preferences
 * Update user's notification preferences
 */
export async function PUT(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await request.json();

    const client = await clientPromise;
    const db = client.db("medfree");

    const result = await db.collection("subscriptions").updateOne(
      { userId },
      {
        $set: {
          preferences,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
