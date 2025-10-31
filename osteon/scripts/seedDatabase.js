// Database seeding script for Osteon
// Run with: node scripts/seedDatabase.js

const { MongoClient } = require("mongodb");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://aakku106:1234@cluster0.2r1aj8e.mongodb.net/?appName=Cluster0";

const sampleServices = [
  {
    name: "Free Eye Checkup Camp",
    category: "Health Camp",
    description:
      "Comprehensive eye examination including visual acuity test, eye pressure measurement, and cataract screening. Free eyeglasses for those in need.",
    location: {
      address: "Bir Hospital, Mahabauddha",
      district: "Kathmandu",
      coordinates: {
        latitude: 27.704,
        longitude: 85.313,
      },
    },
    date: {
      start: new Date("2025-11-15T09:00:00"),
      end: new Date("2025-11-17T17:00:00"),
    },
    status: "Upcoming",
    contact: {
      phone: "+977-1-4221119",
      email: "info@birhospital.gov.np",
    },
    servicesProvided: [
      "Visual acuity test",
      "Eye pressure measurement",
      "Cataract screening",
      "Free eyeglasses distribution",
      "Consultation with ophthalmologist",
    ],
    requirements: [
      "Nepalese citizenship card",
      "No prior registration needed",
      "Come on empty stomach for specific tests",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Free Diabetes Screening",
    category: "Checkup",
    description:
      "Free blood sugar testing, HbA1c testing, and consultation with endocrinologist. Diet and lifestyle counseling included.",
    location: {
      address: "Patan Hospital, Lagankhel",
      district: "Lalitpur",
      coordinates: {
        latitude: 27.6663,
        longitude: 85.3265,
      },
    },
    date: {
      start: new Date("2025-11-10T08:00:00"),
      end: new Date("2025-11-10T16:00:00"),
    },
    status: "Active",
    contact: {
      phone: "+977-1-5522266",
      email: "info@patanhospital.gov.np",
    },
    servicesProvided: [
      "Blood sugar testing",
      "HbA1c testing",
      "Blood pressure measurement",
      "BMI calculation",
      "Dietary counseling",
    ],
    requirements: ["Valid ID proof", "Fasting for 8-10 hours recommended"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Free Hypertension Medication",
    category: "Free Medication",
    description:
      "One month supply of essential hypertension medications available for registered patients. Blood pressure monitoring included.",
    location: {
      address: "Bhaktapur Hospital",
      district: "Bhaktapur",
      coordinates: {
        latitude: 27.672,
        longitude: 85.4298,
      },
    },
    date: {
      start: new Date("2025-11-01T08:00:00"),
      end: new Date("2025-11-30T17:00:00"),
    },
    status: "Active",
    contact: {
      phone: "+977-1-6610798",
      email: "bhaktapurhospital@gmail.com",
    },
    servicesProvided: [
      "Amlodipine 5mg",
      "Enalapril 10mg",
      "Atenolol 50mg",
      "Blood pressure monitoring",
      "Medication counseling",
    ],
    requirements: [
      "Previous prescription required",
      "Registration at hospital pharmacy",
      "Valid citizenship document",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "COVID-19 Vaccination Drive",
    category: "Vaccination",
    description:
      "Free COVID-19 booster shots available for all eligible citizens. Both Moderna and Pfizer vaccines available.",
    location: {
      address: "Tribhuvan University Teaching Hospital",
      district: "Kathmandu",
      coordinates: {
        latitude: 27.7359,
        longitude: 85.3343,
      },
    },
    date: {
      start: new Date("2025-11-05T09:00:00"),
      end: new Date("2025-11-20T16:00:00"),
    },
    status: "Active",
    contact: {
      phone: "+977-1-4412303",
      email: "info@tuth.edu.np",
    },
    servicesProvided: [
      "COVID-19 booster vaccination",
      "Vaccination certificate",
      "Post-vaccination monitoring",
      "Health consultation",
    ],
    requirements: [
      "Valid ID proof",
      "Previous vaccination card",
      "Age 18 and above",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mental Health Awareness Camp",
    category: "Mental Health",
    description:
      "Free mental health screening, counseling sessions, and stress management workshops. Confidential consultations with psychiatrists available.",
    location: {
      address: "Mental Hospital, Lagankhel",
      district: "Lalitpur",
      coordinates: {
        latitude: 27.6654,
        longitude: 85.3289,
      },
    },
    date: {
      start: new Date("2025-11-25T10:00:00"),
      end: new Date("2025-11-25T18:00:00"),
    },
    status: "Upcoming",
    contact: {
      phone: "+977-1-5521369",
      email: "mentalhospital@gmail.com",
    },
    servicesProvided: [
      "Depression screening",
      "Anxiety assessment",
      "One-on-one counseling",
      "Stress management workshop",
      "Free informational materials",
    ],
    requirements: [
      "No prior appointment needed",
      "All ages welcome",
      "Complete confidentiality assured",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dental Health Camp",
    category: "Health Camp",
    description:
      "Free dental checkup, teeth cleaning, and fluoride treatment. Minor cavity fillings available at subsidized rates.",
    location: {
      address: "Dental Hospital, Maharajgunj",
      district: "Kathmandu",
      coordinates: {
        latitude: 27.736,
        longitude: 85.3303,
      },
    },
    date: {
      start: new Date("2025-12-01T09:00:00"),
      end: new Date("2025-12-03T17:00:00"),
    },
    status: "Upcoming",
    contact: {
      phone: "+977-1-4412232",
      email: "info@dentalhospital.edu.np",
    },
    servicesProvided: [
      "Dental examination",
      "Teeth cleaning",
      "Fluoride treatment",
      "Oral health education",
      "X-rays (if needed)",
    ],
    requirements: [
      "Valid ID proof",
      "Children must be accompanied by guardian",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Free TB Medication Program",
    category: "Free Medication",
    description:
      "Complete 6-month tuberculosis treatment regimen provided free of cost. Regular monitoring and follow-up included.",
    location: {
      address: "National Tuberculosis Center, Bhaktapur",
      district: "Bhaktapur",
      coordinates: {
        latitude: 27.671,
        longitude: 85.4278,
      },
    },
    date: {
      start: new Date("2025-11-01T08:00:00"),
      end: new Date("2026-04-30T17:00:00"),
    },
    status: "Active",
    contact: {
      phone: "+977-1-6631048",
      email: "ntc@ntc.gov.np",
    },
    servicesProvided: [
      "Complete TB medication",
      "Regular sputum tests",
      "X-ray examinations",
      "Monthly follow-up consultations",
      "Nutritional supplements",
    ],
    requirements: [
      "Confirmed TB diagnosis",
      "Registration at NTC",
      "Commitment to complete treatment",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Women's Health Screening",
    category: "Checkup",
    description:
      "Comprehensive women's health checkup including cervical cancer screening, breast examination, and reproductive health consultation.",
    location: {
      address: "Paropakar Maternity Hospital",
      district: "Kathmandu",
      coordinates: {
        latitude: 27.705,
        longitude: 85.315,
      },
    },
    date: {
      start: new Date("2025-11-18T09:00:00"),
      end: new Date("2025-11-20T16:00:00"),
    },
    status: "Upcoming",
    contact: {
      phone: "+977-1-4260736",
      email: "info@paropakarmaternity.gov.np",
    },
    servicesProvided: [
      "Pap smear test",
      "Breast examination",
      "Blood pressure check",
      "Anemia screening",
      "Reproductive health counseling",
    ],
    requirements: [
      "Women aged 18 and above",
      "Valid citizenship card",
      "No appointment needed",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Child Vaccination Camp",
    category: "Vaccination",
    description:
      "Free routine vaccinations for children including measles, polio, DPT, and hepatitis B. Growth monitoring included.",
    location: {
      address: "Kanti Children's Hospital",
      district: "Kathmandu",
      coordinates: {
        latitude: 27.736,
        longitude: 85.333,
      },
    },
    date: {
      start: new Date("2025-11-08T08:00:00"),
      end: new Date("2025-11-08T15:00:00"),
    },
    status: "Active",
    contact: {
      phone: "+977-1-4411550",
      email: "info@kch.gov.np",
    },
    servicesProvided: [
      "BCG vaccine",
      "DPT vaccine",
      "Polio vaccine",
      "Measles vaccine",
      "Growth monitoring",
    ],
    requirements: [
      "Child's birth certificate",
      "Previous vaccination card",
      "Parent/guardian must accompany",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Free Heart Health Screening",
    category: "Health Camp",
    description:
      "Cardiovascular health assessment including ECG, blood pressure, cholesterol testing, and consultation with cardiologist.",
    location: {
      address: "Shahid Gangalal National Heart Centre",
      district: "Kathmandu",
      coordinates: {
        latitude: 27.734,
        longitude: 85.338,
      },
    },
    date: {
      start: new Date("2025-11-22T09:00:00"),
      end: new Date("2025-11-24T17:00:00"),
    },
    status: "Upcoming",
    contact: {
      phone: "+977-1-4371322",
      email: "info@sgnhc.org.np",
    },
    servicesProvided: [
      "ECG test",
      "Blood pressure monitoring",
      "Cholesterol screening",
      "Heart health consultation",
      "Lifestyle counseling",
    ],
    requirements: [
      "Valid ID proof",
      "Fasting for 12 hours for cholesterol test",
      "Ages 40 and above priority",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Connected successfully!");

    const db = client.db("osteon");
    const collection = db.collection("services");

    // Clear existing data (optional)
    console.log("🗑️  Clearing existing services...");
    await collection.deleteMany({});

    // Insert sample data
    console.log("📥 Inserting sample services...");
    const result = await collection.insertMany(sampleServices);
    console.log(`✅ Successfully inserted ${result.insertedCount} services!`);

    // Create indexes for better query performance
    console.log("📊 Creating indexes...");
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ "location.district": 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ createdAt: -1 });
    console.log("✅ Indexes created!");

    // Display summary
    console.log("\n📋 Database Summary:");
    console.log(`   Total Services: ${result.insertedCount}`);
    console.log(`   Database: osteon`);
    console.log(`   Collection: services`);
    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔒 Database connection closed");
  }
}

// Run the seeding function
seedDatabase();
