/**
 * Sample Data Seeding Script for MedFree
 * Run with: node medfree/scripts/seedSampleData.js
 */

const { MongoClient } = require("mongodb");

const sampleServices = [
  {
    title: "Free Diabetes Screening Camp",
    description:
      "Comprehensive diabetes screening including blood sugar testing, HbA1c tests, and consultation with endocrinologists. This camp aims to identify early signs of diabetes and provide guidance on lifestyle modifications and treatment options.",
    shortDescription:
      "Get free diabetes screening and consultation with specialists.",
    category: "General Health",
    diagnosisType: "Diabetes Screening",
    whatItChecks: [
      "Fasting Blood Sugar Test",
      "Random Blood Sugar Test",
      "HbA1c Test",
      "Blood Pressure Check",
      "BMI Measurement",
    ],
    requirements: [
      "Bring valid citizenship or ID card",
      "Fast for 8-12 hours before the test",
      "Arrive 30 minutes early",
    ],
    location: {
      type: "Point",
      coordinates: [85.324, 27.7172], // Kathmandu
    },
    address: "Tribhuvan University Teaching Hospital, Maharajgunj, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    date: new Date("2025-11-15"),
    dateNepali: "२०८२ कार्तिक ३०",
    timeStart: "08:00 AM",
    timeEnd: "02:00 PM",
    capacity: 150,
    contactPerson: "Dr. Rajesh Sharma",
    contactPhone: "+977-01-4412303",
    contactEmail: "health@tuth.edu.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Eye Checkup and Vision Screening",
    description:
      "Complete eye examination including visual acuity testing, intraocular pressure measurement, and consultation with experienced ophthalmologists. Free reading glasses will be provided to those in need.",
    shortDescription:
      "Free comprehensive eye checkup and free glasses for eligible candidates.",
    category: "Eye Care",
    diagnosisType: "Eye Test",
    whatItChecks: [
      "Visual Acuity Test",
      "Color Vision Test",
      "Intraocular Pressure Check",
      "Retinal Examination",
      "Cataract Screening",
    ],
    requirements: [
      "Bring previous prescription if available",
      "Citizenship or ID card required",
      "Children must be accompanied by guardian",
    ],
    location: {
      type: "Point",
      coordinates: [85.3206, 27.6915], // Patan
    },
    address: "Patan Hospital, Lagankhel, Lalitpur",
    city: "Lalitpur",
    district: "Lalitpur",
    date: new Date("2025-11-20"),
    dateNepali: "२०८२ मंसिर ०५",
    timeStart: "09:00 AM",
    timeEnd: "04:00 PM",
    capacity: 100,
    contactPerson: "Dr. Sunita Thapa",
    contactPhone: "+977-01-5522295",
    contactEmail: "info@patanhospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Dental Checkup and Cleaning Camp",
    description:
      "Professional dental examination, cleaning, and fluoride treatment. Basic dental care education and oral hygiene demonstrations will also be provided. Minor cavity fillings available for eligible patients.",
    shortDescription: "Free dental checkup, cleaning, and basic treatments.",
    category: "Dental Care",
    diagnosisType: "Dental Checkup",
    whatItChecks: [
      "Oral Health Examination",
      "Teeth Cleaning (Scaling)",
      "Cavity Detection",
      "Gum Health Assessment",
      "Fluoride Treatment",
    ],
    requirements: [
      "Must bring ID or citizenship card",
      "Brush teeth before coming",
      "Inform staff of any allergies",
    ],
    location: {
      type: "Point",
      coordinates: [85.3368, 27.6803], // Bhaktapur
    },
    address: "Bhaktapur Municipality Health Center, Durbar Square Area",
    city: "Bhaktapur",
    district: "Bhaktapur",
    date: new Date("2025-11-18"),
    dateNepali: "२०८२ मंसिर ०३",
    timeStart: "10:00 AM",
    timeEnd: "03:00 PM",
    capacity: 80,
    contactPerson: "Dr. Bijay Maharjan",
    contactPhone: "+977-01-6610798",
    contactEmail: "dental@bhaktapur.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Maternal and Child Health Camp",
    description:
      "Comprehensive health services for pregnant women and children under 5 years. Includes prenatal checkups, vaccinations, growth monitoring, and nutritional counseling. Free iron and vitamin supplements provided.",
    shortDescription:
      "Free health checkups and vaccinations for mothers and children.",
    category: "Women's Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Prenatal Health Check",
      "Child Growth Monitoring",
      "Vaccination Administration",
      "Hemoglobin Test",
      "Nutritional Assessment",
    ],
    requirements: [
      "Bring vaccination card if available",
      "Mother's citizenship card",
      "Child's birth certificate or citizenship",
    ],
    location: {
      type: "Point",
      coordinates: [84.4359, 27.6738], // Pokhara
    },
    address: "Pokhara Health Science Academy, Ramghat, Pokhara",
    city: "Pokhara",
    district: "Kaski",
    date: new Date("2025-11-22"),
    dateNepali: "२०८२ मंसिर ०७",
    timeStart: "08:30 AM",
    timeEnd: "01:00 PM",
    capacity: 120,
    contactPerson: "Dr. Anita Gurung",
    contactPhone: "+977-061-463122",
    contactEmail: "mchealth@pokhara.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Blood Pressure and Heart Health Screening",
    description:
      "Cardiovascular health screening including blood pressure monitoring, ECG, and cholesterol testing. Consultation with cardiologists available. Education on heart-healthy lifestyle and diet provided.",
    shortDescription:
      "Get your heart health checked with free BP, ECG, and cholesterol tests.",
    category: "General Health",
    diagnosisType: "Blood Pressure Check",
    whatItChecks: [
      "Blood Pressure Measurement",
      "ECG (Electrocardiogram)",
      "Cholesterol Level Test",
      "Heart Rate Monitoring",
      "BMI and Weight Check",
    ],
    requirements: [
      "Valid ID card required",
      "Avoid caffeine 2 hours before test",
      "Wear comfortable clothing",
    ],
    location: {
      type: "Point",
      coordinates: [87.2718, 26.4525], // Biratnagar
    },
    address: "Nobel Medical College, Biratnagar-5, Morang",
    city: "Biratnagar",
    district: "Morang",
    date: new Date("2025-11-25"),
    dateNepali: "२०८२ मंसिर १०",
    timeStart: "07:00 AM",
    timeEnd: "01:00 PM",
    capacity: 200,
    contactPerson: "Dr. Ramesh Yadav",
    contactPhone: "+977-021-525252",
    contactEmail: "cardio@nobel.edu.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("medfree");
    const collection = db.collection("services");

    // Clear existing data (optional - remove if you want to keep existing data)
    // await collection.deleteMany({});
    // console.log("Cleared existing services");

    // Insert sample data
    const result = await collection.insertMany(sampleServices);
    console.log(`✅ Inserted ${result.insertedCount} sample services`);

    // Create indexes
    await collection.createIndex({ location: "2dsphere" });
    await collection.createIndex({
      title: "text",
      description: "text",
      city: "text",
    });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ diagnosisType: 1 });
    await collection.createIndex({ date: 1 });
    console.log("✅ Created indexes");

    console.log("\n📊 Sample services added:");
    sampleServices.forEach((service, i) => {
      console.log(`${i + 1}. ${service.title} - ${service.city}`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
    console.log("\nDatabase connection closed");
  }
}

// Run the seeding function
seedDatabase();
