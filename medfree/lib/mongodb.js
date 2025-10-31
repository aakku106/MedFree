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
  await collection.createIndex({ isActive: 1 });
  await collection.createIndex({ createdBy: 1 });

  return collection;
}

/**
 * Get the registrations collection with indexes
 */
export async function getRegistrationsCollection() {
  const client = await clientPromise;
  const db = client.db("medfree");
  const collection = db.collection("registrations");

  // Ensure indexes exist
  await collection.createIndex({ serviceId: 1 });
  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ registeredAt: -1 });
  // Compound index for user's upcoming registrations
  await collection.createIndex({ userId: 1, status: 1 });

  return collection;
}

/**
 * Get the subscriptions collection with indexes
 */
export async function getSubscriptionsCollection() {
  const client = await clientPromise;
  const db = client.db("medfree");
  const collection = db.collection("subscriptions");

  // Ensure indexes exist
  await collection.createIndex({ userId: 1 }, { unique: true });
  await collection.createIndex({ enabled: 1 });
  await collection.createIndex({ categories: 1 });

  return collection;
}

/**
 * Get the users collection (for saved services and preferences)
 */
export async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db("medfree");
  const collection = db.collection("users");

  // Ensure indexes exist
  await collection.createIndex({ clerkId: 1 }, { unique: true });

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
 *   images: Array<String> (Cloudinary/Vercel Blob URLs),
 *   registeredCount: Number (cached count),
 *   isActive: Boolean (default true, soft delete),
 *   createdBy: String (Clerk user ID),
 *   updatedBy: String (Clerk user ID),
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

/**
 * Registration Schema (for reference):
 * {
 *   _id: ObjectId,
 *   serviceId: ObjectId,
 *   userId: String (Clerk user ID),
 *   userName: String,
 *   userPhone: String,
 *   userEmail: String,
 *   registrationCode: String (unique code for QR),
 *   familyMembers: Array<String> (names of family members),
 *   status: String ('confirmed', 'cancelled', 'attended', 'no-show'),
 *   registeredAt: Date,
 *   cancelledAt: Date,
 *   attendedAt: Date,
 *   notificationsSent: {
 *     confirmation: Boolean,
 *     reminder: Boolean
 *   }
 * }
 */

/**
 * Subscription Schema (for reference):
 * {
 *   _id: ObjectId,
 *   userId: String (Clerk user ID),
 *   pushEndpoint: String (Web Push subscription endpoint),
 *   pushKeys: {
 *     p256dh: String,
 *     auth: String
 *   },
 *   categories: Array<String> (interested categories),
 *   location: {
 *     city: String,
 *     district: String,
 *     radius: Number (km)
 *   },
 *   frequency: String ('instant', 'daily', 'weekly'),
 *   enabled: Boolean,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

/**
 * User Schema (for reference):
 * {
 *   _id: ObjectId,
 *   clerkId: String (unique Clerk user ID),
 *   savedServices: Array<ObjectId> (service IDs),
 *   preferences: {
 *     categories: Array<String>,
 *     location: {
 *       city: String,
 *       district: String
 *     },
 *     language: String ('en', 'ne')
 *   },
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */
