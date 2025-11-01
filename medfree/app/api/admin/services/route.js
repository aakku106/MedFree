import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getServicesCollection } from "@/lib/mongodb";
import { hasAdminAccess } from "@/lib/admin-config";

export async function POST(request) {
  try {
    // Check authentication and admin access
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email and check admin access
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email || !hasAdminAccess(email)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "category",
      "description",
      "address",
      "city",
      "district",
      "date",
      "timeStart",
      "timeEnd",
      "capacity",
      "contactPerson",
      "contactPhone",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare service document
    const serviceDoc = {
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
      registeredCount: 0,
      contact: {
        person: body.contactPerson,
        phone: body.contactPhone,
        email: body.contactEmail || "",
      },
      images: [],
      isActive: true,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const servicesCollection = await getServicesCollection();
    const result = await servicesCollection.insertOne(serviceDoc);

    return NextResponse.json({
      success: true,
      serviceId: result.insertedId.toString(),
      message: "Service created successfully",
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
