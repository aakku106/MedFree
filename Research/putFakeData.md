# AI Prompt: Generate Fake Data for Osteon MongoDB Atlas Database

## **Objective**

Create a script (e.g., a Node.js script) to populate a MongoDB Atlas database with fake data for the "Osteon" medical service application. The script should be mindful of the MongoDB Atlas free tier limitations by generating a reasonable but useful amount of data.

---

## **1. Database and Collections Setup**

- **Database Name:** `osteon`
- **Collections to Create:**
  1. `users`
  2. `services`

---

## **2. `users` Collection**

- **Purpose:** To store user information. Since authentication is handled by **Clerk**, this collection will mirror user data from Clerk and store application-specific information.
- **Schema:**

  ```json
  {
    "clerkUserId": "string", // Primary identifier from Clerk
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "profileImageUrl": "string",
    "createdAt": "Date"
  }
  ```

---

## **3. `services` Collection**

- **Purpose:** To store information about the free medical services.
- **Schema:**

  ```json
  {
    "title": "string", // e.g., "Free Dental Checkup Camp"
    "description": "string", // A short, one-sentence summary
    "category": "string", // e.g., "Dental", "Eye Care", "General Health", "Maternal Health"
    "diagnosisType": "string", // e.g., "Dental Screening", "Blood Pressure Check", "Diabetes Test"
    "about": "string", // Detailed paragraph about the service
    "checks": ["string"], // List of specific tests, e.g., ["Cavity check", "Teeth cleaning"]
    "requirements": "string", // e.g., "Must bring a valid government ID."
    "serviceDetails": {
      "nepaliDate": "string", // e.g., "2082-07-15"
      "time": "string", // e.g., "10:00 AM - 4:00 PM"
      "location": {
        "address": "string", // Full, readable address
        "type": "Point",
        "coordinates": ["longitude", "latitude"] // GeoJSON for location queries
      },
      "capacity": "number" // e.g., 150
    },
    "contact": {
      "name": "string", // e.g., "Mr. Ram Thapa"
      "phone": "string" // e.g., "98xxxxxxxx"
    },
    "createdAt": "Date"
  }
  ```

- **Fake Data Generation (15-20 services):**
  - Create a variety of services across different categories.
  - **Crucially, generate data for the following specific locations in Nepal:**
    1. **Manigram, Rupandehi:** (Approx. coordinates: `[83.44, 27.64]`)
        - Create 3-4 services here (e.g., a general health camp, a vaccination drive).(this is our location)
    2. **Shankarnagar, Rupandehi:** (Approx. coordinates: `[83.46, 27.66]`)
        - Create 3-4 services here (e.g., an eye checkup camp).
    3. **Lumbini Provincial Hospital, Butwal:** (Approx. coordinates: `[83.45, 27.70]`)
        - Create 3-4 services related to a larger hospital setting.
  - **Generate 5-8 additional services** at random locations across Nepal (e.g., Kathmandu, Pokhara, Chitwan) to ensure a country-wide spread.
  - Use realistic but fake data for all fields. Dates should be set for the near future.

---

## **Instructions for the AI**

1. Write a self-contained script that connects to a MongoDB instance (the connection string can be a placeholder).
2. The script should first clear any existing data in the `users` and `services` collections to avoid duplication on re-runs.
3. It should then insert the newly generated fake data into the respective collections.
4. Log a confirmation message to the console after the data has been successfully inserted, e.g., "Database seeded with X users and Y services."
5. Ensure the location data uses the correct GeoJSON format (`type: "Point"`) to allow for geospatial queries (e.g., finding services "near" a user).
