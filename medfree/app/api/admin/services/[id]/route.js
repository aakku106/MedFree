import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getServicesCollection } from "@/lib/mongodb";
import { hasAdminAccess } from "@/lib/admin-config";
import { ObjectId } from "mongodb";

// GET single service
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    const service = await servicesCollection.findOne({ _id: new ObjectId(id) });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT (update) service
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email || !hasAdminAccess(email)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
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

    // Prepare update document
    const updateDoc = {
      $set: {
        title: body.title,
        category: body.category,
        diagnosisType: body.diagnosisType || "",
        description: body.description,
        location: {
          address: body.address,
          city: body.city,
          district: body.district,
          coordinates:
            body.latitude && body.longitude
              ? {
                  type: "Point",
                  coordinates: [
                    parseFloat(body.longitude),
                    parseFloat(body.latitude),
                  ],
                }
              : null,
        },
        date: new Date(body.date),
        timeStart: body.timeStart,
        timeEnd: body.timeEnd,
        capacity: parseInt(body.capacity),
        contact: {
          person: body.contactPerson,
          phone: body.contactPhone,
          email: body.contactEmail || "",
        },
        updatedBy: userId,
        updatedAt: new Date(),
      },
    };

    const servicesCollection = await getServicesCollection();
    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE service (soft delete - set isActive to false)
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email || !hasAdminAccess(email)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
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

    const servicesCollection = await getServicesCollection();

    // Soft delete - set isActive to false
    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedBy: userId,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
