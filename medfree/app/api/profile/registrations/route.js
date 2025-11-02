import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("medfree");

    // Fetch user's registrations
    const registrations = await db
      .collection("registrations")
      .find({ userId })
      .sort({ registeredAt: -1 })
      .toArray();

    // Fetch service details for each registration
    const serviceIds = registrations.map((r) => new ObjectId(r.serviceId));
    const services = await db
      .collection("services")
      .find({ _id: { $in: serviceIds } })
      .toArray();

    // Map services to registrations
    const registrationsWithServices = registrations.map((reg) => {
      const service = services.find(
        (s) => s._id.toString() === reg.serviceId.toString()
      );
      return {
        ...reg,
        _id: reg._id.toString(),
        serviceId: reg.serviceId.toString(),
        service: service
          ? {
              ...service,
              _id: service._id.toString(),
            }
          : null,
      };
    });

    return NextResponse.json(registrationsWithServices);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
