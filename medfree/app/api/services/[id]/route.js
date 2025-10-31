import { NextResponse } from "next/server";
import { getServicesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const collection = await getServicesCollection();
    const service = await collection.findOne({ _id: new ObjectId(id) });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...service,
      _id: service._id.toString(),
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
