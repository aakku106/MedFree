import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getServicesCollection,
  getRegistrationsCollection,
} from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to register" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.userName || !body.userPhone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    const registrationsCollection = await getRegistrationsCollection();

    // Start a transaction to handle race conditions
    const service = await servicesCollection.findOne({ _id: new ObjectId(id) });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check if service is active
    if (service.isActive === false) {
      return NextResponse.json(
        { error: "This service is no longer available" },
        { status: 400 }
      );
    }

    // Check capacity
    const registeredCount = service.registeredCount || 0;
    if (registeredCount >= service.capacity) {
      return NextResponse.json(
        { error: "Sorry, this service is now full" },
        { status: 400 }
      );
    }

    // Check if user already registered
    const existingRegistration = await registrationsCollection.findOne({
      serviceId: new ObjectId(id),
      userId: userId,
      status: { $ne: "cancelled" },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this service" },
        { status: 400 }
      );
    }

    // Generate unique registration code
    const registrationCode = `REG-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Create registration document
    const registrationDoc = {
      serviceId: new ObjectId(id),
      userId: userId,
      userName: body.userName,
      userPhone: body.userPhone,
      familyMembers: body.familyMembers || [],
      registrationCode: registrationCode,
      status: "confirmed",
      registeredAt: new Date(),
      notificationsSent: {
        confirmation: false,
        reminder: false,
      },
    };

    // Insert registration and update service count atomically
    await registrationsCollection.insertOne(registrationDoc);

    await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { registeredCount: 1 },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      registrationCode: registrationCode,
      message: "Successfully registered!",
    });
  } catch (error) {
    console.error("Error registering for service:", error);
    return NextResponse.json(
      { error: "Failed to register. Please try again." },
      { status: 500 }
    );
  }
}

// GET - Check registration status
export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ registered: false });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const registrationsCollection = await getRegistrationsCollection();
    const registration = await registrationsCollection.findOne({
      serviceId: new ObjectId(id),
      userId: userId,
      status: { $ne: "cancelled" },
    });

    return NextResponse.json({
      registered: !!registration,
      registration: registration || null,
    });
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json({ registered: false });
  }
}

// DELETE - Cancel registration
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    const registrationsCollection = await getRegistrationsCollection();

    // Find and cancel registration
    const registration = await registrationsCollection.findOne({
      serviceId: new ObjectId(id),
      userId: userId,
      status: "confirmed",
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Update registration status and decrement service count
    await registrationsCollection.updateOne(
      { _id: registration._id },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      }
    );

    await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { registeredCount: -1 },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return NextResponse.json(
      { error: "Failed to cancel registration" },
      { status: 500 }
    );
  }
}
