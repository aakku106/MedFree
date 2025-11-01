import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Get user's saved services
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("medfree");

    // Get user's saved service IDs
    const user = await db.collection("users").findOne({ clerkId: userId });
    const savedServiceIds = user?.savedServices || [];

    // Get the actual services
    const services = await db
      .collection("services")
      .find({
        _id: { $in: savedServiceIds.map((id) => new ObjectId(id)) },
        isActive: { $ne: false },
      })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching saved services:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved services" },
      { status: 500 }
    );
  }
}

// POST - Save or unsave a service
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, action } = await request.json();

    if (!serviceId || !action || !["save", "unsave"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("medfree");

    // Verify service exists
    const service = await db
      .collection("services")
      .findOne({ _id: new ObjectId(serviceId) });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Update user's saved services
    if (action === "save") {
      await db.collection("users").updateOne(
        { clerkId: userId },
        {
          $addToSet: { savedServices: serviceId },
          $setOnInsert: { clerkId: userId, createdAt: new Date() },
        },
        { upsert: true }
      );
    } else {
      await db
        .collection("users")
        .updateOne(
          { clerkId: userId },
          { $pull: { savedServices: serviceId } }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      message: action === "save" ? "Service saved" : "Service removed",
    });
  } catch (error) {
    console.error("Error saving/unsaving service:", error);
    return NextResponse.json(
      { error: "Failed to update saved services" },
      { status: 500 }
    );
  }
}
