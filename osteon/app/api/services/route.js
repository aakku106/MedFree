import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    const client = await clientPromise;
    const db = client.db("osteon");
    const collection = db.collection("services");

    // Build query filters
    const query = {};
    if (category) query.category = category;
    if (district) query["location.district"] = district;
    if (status) query.status = status;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch services with filters and pagination
    const services = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await collection.countDocuments(query);

    // Convert MongoDB _id to string
    const servicesWithId = services.map((service) => ({
      ...service,
      _id: service._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: servicesWithId,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch services",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("osteon");
    const collection = db.collection("services");

    // Add timestamps
    const serviceData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(serviceData);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId.toString(),
          ...serviceData,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create service",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
