import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hasAdminAccess } from "@/lib/admin-config";
import webpush from "web-push";

// Configure web-push with VAPID keys
// You need to generate these keys using: npx web-push generate-vapid-keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL || "admin@medfree.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    `mailto:${vapidEmail}`,
    vapidPublicKey,
    vapidPrivateKey
  );
}

/**
 * POST /api/notifications/send
 * Send push notification (Admin only)
 */
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!hasAdminAccess(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, body, url, targetUserIds, serviceId, notificationType } =
      await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        {
          error:
            "VAPID keys not configured. Run: npx web-push generate-vapid-keys",
        },
        { status: 500 }
      );
    }

    const dbClient = await clientPromise;
    const db = dbClient.db("medfree");

    // Get subscriptions to send to
    let query = {};
    if (targetUserIds && targetUserIds.length > 0) {
      query.userId = { $in: targetUserIds };
    }

    // Filter by notification preferences
    if (notificationType) {
      query[`preferences.${notificationType}`] = true;
    }

    const subscriptions = await db
      .collection("subscriptions")
      .find(query)
      .toArray();

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { message: "No subscriptions found" },
        { status: 200 }
      );
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      url: url || "/",
      serviceId,
      notificationId: new Date().getTime().toString(),
      tag: serviceId || "general",
      requireInteraction: false,
      actions: [
        {
          action: "view",
          title: "View Details",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
    });

    // Send notifications
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        return { success: true, userId: sub.userId };
      } catch (error) {
        console.error(`Failed to send notification to ${sub.userId}:`, error);

        // If subscription is no longer valid, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.collection("subscriptions").deleteOne({ _id: sub._id });
        }

        return { success: false, userId: sub.userId, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    // Log notification to database
    await db.collection("notificationLogs").insertOne({
      title,
      body,
      url,
      serviceId,
      notificationType,
      targetUserIds: targetUserIds || "all",
      sentBy: userId,
      sentAt: new Date(),
      successCount,
      failCount,
      totalRecipients: subscriptions.length,
    });

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${successCount} users`,
      stats: {
        total: subscriptions.length,
        success: successCount,
        failed: failCount,
      },
      results,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/send
 * Get notification logs (Admin only)
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!hasAdminAccess(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const dbClient = await clientPromise;
    const db = dbClient.db("medfree");

    const logs = await db
      .collection("notificationLogs")
      .find({})
      .sort({ sentAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Get notification logs error:", error);
    return NextResponse.json({ error: "Failed to get logs" }, { status: 500 });
  }
}
