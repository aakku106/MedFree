import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const LARGE_DISTANCE_PLACEHOLDER = 1_000_000;

const coordinateExtractionExpression = {
  $let: {
    vars: {
      serviceCoords: "$serviceDetails.location.coordinates",
      serviceLocation: "$serviceDetails.location",
      locationCoords: "$location.coordinates",
    },
    in: {
      $cond: [
        {
          $and: [
            { $isArray: "$$serviceCoords" },
            { $eq: [{ $size: "$$serviceCoords" }, 2] },
            { $ne: [{ $arrayElemAt: ["$$serviceCoords", 0] }, null] },
            { $ne: [{ $arrayElemAt: ["$$serviceCoords", 1] }, null] },
          ],
        },
        {
          lat: { $arrayElemAt: ["$$serviceCoords", 1] },
          lng: { $arrayElemAt: ["$$serviceCoords", 0] },
        },
        {
          $cond: [
            {
              $and: [
                { $isArray: "$$locationCoords" },
                { $eq: [{ $size: "$$locationCoords" }, 2] },
                { $ne: [{ $arrayElemAt: ["$$locationCoords", 0] }, null] },
                { $ne: [{ $arrayElemAt: ["$$locationCoords", 1] }, null] },
              ],
            },
            {
              lat: { $arrayElemAt: ["$$locationCoords", 1] },
              lng: { $arrayElemAt: ["$$locationCoords", 0] },
            },
            {
              $cond: [
                {
                  $and: [
                    { $ne: ["$$locationCoords.latitude", null] },
                    { $ne: ["$$locationCoords.longitude", null] },
                  ],
                },
                {
                  lat: "$$locationCoords.latitude",
                  lng: "$$locationCoords.longitude",
                },
                {
                  $cond: [
                    {
                      $and: [
                        { $ne: ["$$serviceCoords.latitude", null] },
                        { $ne: ["$$serviceCoords.longitude", null] },
                      ],
                    },
                    {
                      lat: "$$serviceCoords.latitude",
                      lng: "$$serviceCoords.longitude",
                    },
                    {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$$serviceLocation", null] },
                            {
                              $ne: [
                                "$$serviceLocation.coordinates.latitude",
                                null,
                              ],
                            },
                            {
                              $ne: [
                                "$$serviceLocation.coordinates.longitude",
                                null,
                              ],
                            },
                          ],
                        },
                        {
                          lat: "$$serviceLocation.coordinates.latitude",
                          lng: "$$serviceLocation.coordinates.longitude",
                        },
                        null,
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const createDistanceExpression = (latitude, longitude) => ({
  $let: {
    vars: {
      lat1Rad: { $degreesToRadians: latitude },
      lat2Rad: { $degreesToRadians: "$computedCoordinates.lat" },
      dLat: {
        $degreesToRadians: {
          $subtract: ["$computedCoordinates.lat", latitude],
        },
      },
      dLng: {
        $degreesToRadians: {
          $subtract: ["$computedCoordinates.lng", longitude],
        },
      },
    },
    in: {
      $let: {
        vars: {
          sinHalfDLat: { $sin: { $divide: ["$$dLat", 2] } },
          sinHalfDLng: { $sin: { $divide: ["$$dLng", 2] } },
          cosLat1: { $cos: "$$lat1Rad" },
          cosLat2: { $cos: "$$lat2Rad" },
        },
        in: {
          $let: {
            vars: {
              aRaw: {
                $add: [
                  { $pow: ["$$sinHalfDLat", 2] },
                  {
                    $multiply: [
                      "$$cosLat1",
                      "$$cosLat2",
                      { $pow: ["$$sinHalfDLng", 2] },
                    ],
                  },
                ],
              },
            },
            in: {
              $let: {
                vars: {
                  aClamped: {
                    $max: [
                      0,
                      {
                        $min: [1, "$$aRaw"],
                      },
                    ],
                  },
                },
                in: {
                  $multiply: [
                    6371,
                    {
                      $multiply: [
                        2,
                        {
                          $atan2: [
                            { $sqrt: "$$aClamped" },
                            { $sqrt: { $subtract: [1, "$$aClamped"] } },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
});

const buildLocationAwarePipeline = (
  query,
  latitude,
  longitude,
  skip,
  limit
) => [
  { $match: query },
  { $addFields: { computedCoordinates: coordinateExtractionExpression } },
  {
    $addFields: {
      distanceKm: {
        $cond: [
          {
            $and: [
              { $ne: ["$computedCoordinates", null] },
              { $ne: ["$computedCoordinates.lat", null] },
              { $ne: ["$computedCoordinates.lng", null] },
            ],
          },
          {
            $round: [createDistanceExpression(latitude, longitude), 2],
          },
          null,
        ],
      },
    },
  },
  {
    $addFields: {
      sortDistance: {
        $cond: [
          { $eq: ["$distanceKm", null] },
          LARGE_DISTANCE_PLACEHOLDER,
          "$distanceKm",
        ],
      },
    },
  },
  {
    $facet: {
      data: [
        { $sort: { sortDistance: 1, title: 1, name: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            computedCoordinates: 0,
            sortDistance: 0,
          },
        },
      ],
      totalCount: [{ $count: "count" }],
      totalWithCoordinates: [
        { $match: { distanceKm: { $ne: null } } },
        { $count: "count" },
      ],
    },
  },
  {
    $project: {
      data: 1,
      totalCount: {
        $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
      },
      totalWithCoordinates: {
        $ifNull: [{ $arrayElemAt: ["$totalWithCoordinates.count", 0] }, 0],
      },
    },
  },
];

const buildAlphabeticalPipeline = (query, skip, limit) => [
  { $match: query },
  {
    $addFields: {
      sortName: {
        $toUpper: {
          $ifNull: [{ $ifNull: ["$title", "$name"] }, "$category"],
        },
      },
    },
  },
  {
    $facet: {
      data: [
        { $sort: { sortName: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            sortName: 0,
            distanceKm: 0,
          },
        },
      ],
      totalCount: [{ $count: "count" }],
    },
  },
  {
    $project: {
      data: 1,
      totalCount: {
        $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
      },
    },
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const status = searchParams.get("status");

    const rawLimit = parseInt(searchParams.get("limit") || "12", 10);
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 12;

    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    const latitude = parseFloat(searchParams.get("lat"));
    const longitude = parseFloat(searchParams.get("lng"));
    const useLocationSort =
      Number.isFinite(latitude) && Number.isFinite(longitude);

    const client = await clientPromise;
    const db = client.db("osteon");
    const collection = db.collection("services");

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (district) {
      query.$or = [
        { "location.district": district },
        { "serviceDetails.location.district": district },
        {
          "serviceDetails.location.address": {
            $regex: district,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    let services = [];
    let total = 0;
    let totalWithCoordinates = 0;
    let locationSortActive = false;

    if (useLocationSort) {
      const [result = { data: [], totalCount: 0, totalWithCoordinates: 0 }] =
        await collection
          .aggregate(
            buildLocationAwarePipeline(query, latitude, longitude, skip, limit)
          )
          .toArray();

      services = result.data ?? [];
      total = result.totalCount ?? 0;
      totalWithCoordinates = result.totalWithCoordinates ?? 0;
      locationSortActive = true;
    } else {
      const [result = { data: [], totalCount: 0 }] = await collection
        .aggregate(buildAlphabeticalPipeline(query, skip, limit))
        .toArray();

      services = result.data ?? [];
      total = result.totalCount ?? 0;
    }

    const servicesWithId = services.map((service) => ({
      ...service,
      _id: service._id.toString(),
      distanceKm:
        typeof service.distanceKm === "number"
          ? Number(service.distanceKm)
          : null,
    }));

    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    return NextResponse.json({
      success: true,
      data: servicesWithId,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      meta: {
        locationSort: locationSortActive,
        requestCoordinates: useLocationSort ? { latitude, longitude } : null,
        totalWithCoordinates,
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
