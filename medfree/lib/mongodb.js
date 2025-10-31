import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

/**
 * Get the services collection with proper indexes
 * Ensures 2dsphere index for geospatial queries
 */
export async function getServicesCollection() {
  const client = await clientPromise;
  const db = client.db("medfree");
  const collection = db.collection("services");

  // Ensure indexes exist
  await collection.createIndex({ location: "2dsphere" });
  await collection.createIndex({
    title: "text",
    description: "text",
    city: "text",
  });
  await collection.createIndex({ category: 1 });
  await collection.createIndex({ diagnosisType: 1 });
  await collection.createIndex({ date: 1 });

  return collection;
}

/**
 * Service Schema (for reference):
 * {
 *   _id: ObjectId,
 *   title: String (required),
 *   description: String (required),
 *   shortDescription: String (required, one-sentence),
 *   category: String (e.g., 'General Health', 'Dental', 'Eye Care'),
 *   diagnosisType: String (e.g., 'Diabetes Screening', 'Blood Pressure Check'),
 *   whatItChecks: Array<String>,
 *   requirements: Array<String>,
 *   location: {
 *     type: 'Point',
 *     coordinates: [longitude, latitude] // GeoJSON format
 *   },
 *   address: String (full address),
 *   city: String,
 *   district: String,
 *   date: Date (ISO format),
 *   dateNepali: String (B.S. format for display),
 *   timeStart: String (e.g., '09:00 AM'),
 *   timeEnd: String (e.g., '04:00 PM'),
 *   capacity: Number,
 *   contactPerson: String,
 *   contactPhone: String,
 *   contactEmail: String,
 *   isActive: Boolean (default true),
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */
