import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * POST /api/notifications/subscribe
 * Save push subscription to database
 */
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscription } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("medfree");

    // Check if subscription already exists
    const existingSubscription = await db
      .collection("subscriptions")
      .findOne({ endpoint: subscription.endpoint });

    if (existingSubscription) {
      // Update existing subscription
      await db.collection("subscriptions").updateOne(
        { endpoint: subscription.endpoint },
        {
          $set: {
            userId,
            subscription,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create new subscription
      await db.collection("subscriptions").insertOne({
        userId,
        endpoint: subscription.endpoint,
        subscription,
        preferences: {
          serviceReminders: true,
          newServices: true,
          updates: true,
          marketing: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription saved successfully",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}
