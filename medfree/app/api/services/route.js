import { NextResponse } from "next/server";
import { getServicesCollection } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const searchQuery = searchParams.get("q");
    const category = searchParams.get("category");
    const diagnosis = searchParams.get("diagnosis");
    const lat = parseFloat(searchParams.get("lat"));
    const lon = parseFloat(searchParams.get("lon"));

    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    // Text search
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    // Category filter
    if (category && category !== "all") {
      query.category = new RegExp(category.replace(/-/g, " "), "i");
    }

    // Diagnosis filter
    if (diagnosis && diagnosis !== "all") {
      query.diagnosisType = new RegExp(diagnosis.replace(/-/g, " "), "i");
    }

    const collection = await getServicesCollection();

    // If location provided, use geospatial query
    let services;
    let total;

    if (!isNaN(lat) && !isNaN(lon)) {
      // Geospatial query with pagination
      const aggregation = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lon, lat],
            },
            distanceField: "distance",
            maxDistance: 500000, // 500km
            spherical: true,
            query: query,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ];

      services = await collection.aggregate(aggregation).toArray();

      // Get total count for geospatial query
      const countAggregation = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lon, lat],
            },
            distanceField: "distance",
            maxDistance: 500000,
            spherical: true,
            query: query,
          },
        },
        { $count: "total" },
      ];

      const countResult = await collection
        .aggregate(countAggregation)
        .toArray();
      total = countResult[0]?.total || 0;
    } else {
      // Regular query sorted alphabetically
      services = await collection
        .find(query)
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      total = await collection.countDocuments(query);
    }

    // Transform MongoDB ObjectId to string
    const formattedServices = services.map((service) => ({
      ...service,
      _id: service._id.toString(),
    }));

    return NextResponse.json({
      services: formattedServices,
      total,
      page,
      limit,
      hasMore: skip + services.length < total,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
