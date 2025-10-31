// Database seeding script for Osteon
// Run with: node scripts/seedDatabase.js

const { MongoClient } = require("mongodb");

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://aakku106:1234@cluster0.2r1aj8e.mongodb.net/?appName=Cluster0";

// Services near Rupandehi district (Manigram, Shankarnagar, Butwal)
const rupandehiServices = [
  // MANIGRAM, RUPANDEHI (3-4 services)
  {
    title: "Free General Health Camp - Manigram",
    description:
      "Comprehensive health screening including blood pressure, diabetes, and basic health checkup.",
    category: "General Health",
    diagnosisType: "Health Screening",
    about:
      "A comprehensive health camp organized by the local health post in Manigram, Rupandehi. This camp offers free health screenings for common conditions including hypertension, diabetes, and general wellness checks. Experienced medical staff will be available to provide consultations and basic medications. This initiative aims to improve healthcare accessibility in rural areas and promote preventive healthcare practices among the community.",
    checks: [
      "Blood Pressure Check",
      "Blood Sugar Test",
      "BMI Calculation",
      "General Physical Examination",
    ],
    requirements:
      "Must bring a valid government ID. Children under 12 must be accompanied by a guardian.",
    serviceDetails: {
      nepaliDate: "2082-08-10",
      time: "9:00 AM - 4:00 PM",
      location: {
        address: "Manigram Health Post, Ward No. 5, Manigram, Rupandehi",
        type: "Point",
        coordinates: [83.44, 27.64],
      },
      capacity: 200,
    },
    contact: {
      name: "Mr. Bikash Sharma",
      phone: "9847123456",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Child Vaccination Drive - Manigram",
    description:
      "Free routine vaccinations for children aged 0-5 years including measles, polio, and DPT.",
    category: "Vaccination",
    diagnosisType: "Immunization",
    about:
      "The Manigram Municipal Health Office is organizing a special vaccination drive for children in the community. All routine childhood vaccinations will be available free of charge, including BCG, DPT, Polio, Measles, and Hepatitis B vaccines. Parents are encouraged to bring their child's immunization card for record keeping. This program is part of the national immunization initiative to ensure every child receives proper protection against preventable diseases.",
    checks: [
      "Weight Measurement",
      "Height Measurement",
      "Temperature Check",
      "Vaccination Administration",
    ],
    requirements:
      "Child's birth certificate or citizenship, previous vaccination card (if available), parent/guardian must accompany.",
    serviceDetails: {
      nepaliDate: "2082-08-15",
      time: "8:00 AM - 3:00 PM",
      location: {
        address: "Manigram Community Center, Manigram-5, Rupandehi",
        type: "Point",
        coordinates: [83.441, 27.641],
      },
      capacity: 150,
    },
    contact: {
      name: "Ms. Sunita Thapa",
      phone: "9856234567",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Maternal Health Checkup - Manigram",
    description:
      "Antenatal care and postnatal checkups for expecting and new mothers.",
    category: "Maternal Health",
    diagnosisType: "Pregnancy Care",
    about:
      "This special camp focuses on maternal and child health, providing comprehensive antenatal and postnatal care services. Pregnant women will receive thorough checkups, nutritional counseling, and iron/folic acid supplements. New mothers can get their babies examined and receive guidance on breastfeeding and infant care. Experienced midwives and doctors will be available for consultations throughout the day.",
    checks: [
      "Blood Pressure Check",
      "Hemoglobin Test",
      "Fetal Heart Monitoring",
      "Weight Check",
      "Ultrasound (if needed)",
    ],
    requirements:
      "Pregnant women or mothers with infants under 6 months. Bring any previous medical records.",
    serviceDetails: {
      nepaliDate: "2082-08-20",
      time: "10:00 AM - 5:00 PM",
      location: {
        address: "Manigram Primary Health Care Center, Manigram, Rupandehi",
        type: "Point",
        coordinates: [83.439, 27.639],
      },
      capacity: 100,
    },
    contact: {
      name: "Dr. Anjana Poudel",
      phone: "9823456789",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Diabetes Awareness and Screening - Manigram",
    description: "Free diabetes testing and lifestyle counseling for adults.",
    category: "General Health",
    diagnosisType: "Diabetes Test",
    about:
      "Join us for a comprehensive diabetes awareness and screening program in Manigram. This camp aims to identify early signs of diabetes and pre-diabetes conditions in the community. Participants will receive free blood sugar testing (both fasting and random), HbA1c testing for diagnosed patients, and detailed consultations with healthcare professionals. Dietary counseling and lifestyle modification advice will be provided to all attendees.",
    checks: [
      "Fasting Blood Sugar",
      "Random Blood Sugar",
      "HbA1c Test",
      "Blood Pressure",
      "BMI Assessment",
    ],
    requirements:
      "Adults aged 30 and above. Fasting for 8 hours recommended for accurate results.",
    serviceDetails: {
      nepaliDate: "2082-08-25",
      time: "7:00 AM - 2:00 PM",
      location: {
        address:
          "Manigram Community Hall, Near Main Chowk, Manigram, Rupandehi",
        type: "Point",
        coordinates: [83.442, 27.642],
      },
      capacity: 180,
    },
    contact: {
      name: "Mr. Ramesh Adhikari",
      phone: "9867345678",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // SHANKARNAGAR, RUPANDEHI (3-4 services)
  {
    title: "Free Eye Checkup Camp - Shankarnagar",
    description:
      "Comprehensive eye examination and free eyeglasses for those in need.",
    category: "Eye Care",
    diagnosisType: "Eye Screening",
    about:
      "The Shankarnagar Eye Care Foundation is organizing a free eye checkup camp for residents of Rupandehi district. Services include complete eye examinations, vision testing, cataract screening, and glaucoma detection. Free eyeglasses will be provided to those who need them, and patients requiring surgery will be referred to partner hospitals with subsidized rates. This camp especially encourages elderly citizens and students to get their eyes checked.",
    checks: [
      "Vision Test",
      "Eye Pressure Check",
      "Cataract Screening",
      "Retina Examination",
      "Color Blindness Test",
    ],
    requirements:
      "Valid ID proof required. Bring previous prescriptions if available.",
    serviceDetails: {
      nepaliDate: "2082-08-12",
      time: "9:00 AM - 5:00 PM",
      location: {
        address:
          "Shankarnagar Health Center, Ward No. 3, Shankarnagar, Rupandehi",
        type: "Point",
        coordinates: [83.46, 27.66],
      },
      capacity: 250,
    },
    contact: {
      name: "Dr. Prakash Joshi",
      phone: "9841234567",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Dental Care Camp - Shankarnagar",
    description:
      "Free dental checkup, cleaning, and fluoride treatment for all ages.",
    category: "Dental",
    diagnosisType: "Dental Screening",
    about:
      "This dental care camp provides comprehensive oral health services to the Shankarnagar community. Services include dental examinations, teeth cleaning, cavity detection, fluoride treatment, and oral hygiene education. Minor treatments like cavity fillings and extractions are available at nominal charges. The camp aims to promote oral health awareness and provide accessible dental care to underserved populations.",
    checks: [
      "Dental Examination",
      "Cavity Check",
      "Gum Health Assessment",
      "Teeth Cleaning",
      "Oral Cancer Screening",
    ],
    requirements:
      "All ages welcome. Children under 10 must be accompanied by parents.",
    serviceDetails: {
      nepaliDate: "2082-08-18",
      time: "10:00 AM - 4:00 PM",
      location: {
        address: "Shankarnagar Community School, Shankarnagar-3, Rupandehi",
        type: "Point",
        coordinates: [83.461, 27.661],
      },
      capacity: 150,
    },
    contact: {
      name: "Dr. Sita Sharma",
      phone: "9852345678",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Blood Donation Camp - Shankarnagar",
    description: "Voluntary blood donation drive to support local blood banks.",
    category: "General Health",
    diagnosisType: "Blood Donation",
    about:
      "Shankarnagar Red Cross is organizing a voluntary blood donation camp to address the critical shortage of blood in regional hospitals. All healthy individuals aged 18-60 can donate blood. Before donation, a complete health screening will be conducted including blood pressure check, hemoglobin test, and blood group determination. Donors will receive refreshments and a certificate of appreciation. Your donation can save lives!",
    checks: [
      "Blood Pressure Check",
      "Hemoglobin Test",
      "Blood Group Testing",
      "Health Screening",
      "Blood Collection",
    ],
    requirements:
      "Age 18-60, weighing at least 50kg, healthy and not on medication. Bring valid ID proof.",
    serviceDetails: {
      nepaliDate: "2082-08-22",
      time: "8:00 AM - 2:00 PM",
      location: {
        address:
          "Shankarnagar Red Cross Office, Near Main Road, Shankarnagar, Rupandehi",
        type: "Point",
        coordinates: [83.459, 27.659],
      },
      capacity: 100,
    },
    contact: {
      name: "Mr. Krishna Bahadur Thapa",
      phone: "9863456789",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Mental Health Awareness Program - Shankarnagar",
    description: "Free mental health screening and counseling services.",
    category: "Mental Health",
    diagnosisType: "Mental Health Screening",
    about:
      "This mental health awareness program aims to reduce stigma and provide accessible mental health services in Shankarnagar. Professional psychologists and counselors will offer free screening for depression, anxiety, and stress-related disorders. Individual counseling sessions will be available on a first-come-first-served basis. The camp also includes awareness sessions on coping strategies, stress management, and when to seek professional help.",
    checks: [
      "Depression Screening",
      "Anxiety Assessment",
      "Stress Level Evaluation",
      "Individual Counseling",
    ],
    requirements:
      "Open to all ages. Complete confidentiality assured. No appointment necessary.",
    serviceDetails: {
      nepaliDate: "2082-08-28",
      time: "11:00 AM - 6:00 PM",
      location: {
        address: "Shankarnagar Youth Center, Shankarnagar-3, Rupandehi",
        type: "Point",
        coordinates: [83.462, 27.662],
      },
      capacity: 80,
    },
    contact: {
      name: "Ms. Radha Pant",
      phone: "9874567890",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // LUMBINI PROVINCIAL HOSPITAL, BUTWAL (3-4 services)
  {
    title: "Heart Health Screening - Butwal Hospital",
    description:
      "Comprehensive cardiovascular health checkup including ECG and cholesterol testing.",
    category: "General Health",
    diagnosisType: "Cardiac Screening",
    about:
      "Lumbini Provincial Hospital is conducting a comprehensive heart health screening camp for residents of Rupandehi and surrounding districts. The camp offers ECG tests, blood pressure monitoring, cholesterol and lipid profile testing, and consultations with experienced cardiologists. Early detection of heart disease can save lives, and this camp provides an excellent opportunity for preventive cardiovascular care. Patients with abnormal findings will be provided with appropriate referrals and treatment plans.",
    checks: [
      "ECG Test",
      "Blood Pressure Monitoring",
      "Cholesterol Test",
      "Lipid Profile",
      "Heart Rate Check",
      "Cardiac Consultation",
    ],
    requirements:
      "Adults aged 35 and above. Fasting for 12 hours required for accurate cholesterol results.",
    serviceDetails: {
      nepaliDate: "2082-08-14",
      time: "7:00 AM - 3:00 PM",
      location: {
        address: "Lumbini Provincial Hospital, Butwal, Rupandehi",
        type: "Point",
        coordinates: [83.45, 27.7],
      },
      capacity: 300,
    },
    contact: {
      name: "Dr. Ramesh Khanal",
      phone: "9845678901",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Women's Health and Cervical Cancer Screening - Butwal",
    description: "Free cervical cancer screening and women's health checkup.",
    category: "Maternal Health",
    diagnosisType: "Cancer Screening",
    about:
      "This specialized camp focuses on women's health with emphasis on cervical cancer screening. Lumbini Provincial Hospital's gynecology department offers Pap smear tests, breast examinations, and consultations on reproductive health. The camp also provides education on cancer prevention, family planning, and overall women's wellness. All services are provided with complete privacy and by female healthcare professionals.",
    checks: [
      "Pap Smear Test",
      "Breast Examination",
      "Pelvic Examination",
      "Blood Pressure Check",
      "Hemoglobin Test",
    ],
    requirements:
      "Women aged 25-65. Valid citizenship required. Husband's consent not required.",
    serviceDetails: {
      nepaliDate: "2082-08-19",
      time: "10:00 AM - 5:00 PM",
      location: {
        address: "Lumbini Provincial Hospital, OPD Block, Butwal, Rupandehi",
        type: "Point",
        coordinates: [83.451, 27.701],
      },
      capacity: 150,
    },
    contact: {
      name: "Dr. Maya Gurung",
      phone: "9856789012",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Orthopedic Camp - Butwal Hospital",
    description:
      "Consultation for bone, joint, and muscle problems with X-ray facility.",
    category: "General Health",
    diagnosisType: "Orthopedic Screening",
    about:
      "This orthopedic camp at Lumbini Provincial Hospital provides specialized care for patients suffering from bone, joint, and muscle problems. Experienced orthopedic surgeons will conduct consultations for conditions like arthritis, back pain, sports injuries, and fractures. X-ray facilities are available on-site for accurate diagnosis. Patients requiring surgery or advanced treatment will receive appropriate referrals and guidance on further management.",
    checks: [
      "Physical Examination",
      "Joint Mobility Test",
      "X-ray (if needed)",
      "Bone Density Screening",
      "Posture Assessment",
    ],
    requirements:
      "All ages welcome. Bring previous medical records and X-rays if available.",
    serviceDetails: {
      nepaliDate: "2082-08-24",
      time: "9:00 AM - 4:00 PM",
      location: {
        address:
          "Lumbini Provincial Hospital, Orthopedic Department, Butwal, Rupandehi",
        type: "Point",
        coordinates: [83.449, 27.699],
      },
      capacity: 200,
    },
    contact: {
      name: "Dr. Sunil Shrestha",
      phone: "9867890123",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Kidney Function Test Camp - Butwal",
    description:
      "Kidney health screening and consultation for chronic kidney disease.",
    category: "General Health",
    diagnosisType: "Kidney Screening",
    about:
      "Recognizing the rising prevalence of kidney disease in Nepal, Lumbini Provincial Hospital is organizing a free kidney function screening camp. The camp offers complete kidney function tests including serum creatinine, blood urea nitrogen, and urinalysis. Consultations with nephrologists are available for patients with abnormal results. Early detection of kidney disease can prevent progression to kidney failure and the need for dialysis.",
    checks: [
      "Serum Creatinine Test",
      "Blood Urea Test",
      "Urinalysis",
      "Blood Pressure Check",
      "Ultrasound (if needed)",
    ],
    requirements:
      "Adults with risk factors: diabetes, hypertension, family history. Valid ID required.",
    serviceDetails: {
      nepaliDate: "2082-08-30",
      time: "8:00 AM - 2:00 PM",
      location: {
        address:
          "Lumbini Provincial Hospital, Medicine Department, Butwal, Rupandehi",
        type: "Point",
        coordinates: [83.452, 27.702],
      },
      capacity: 180,
    },
    contact: {
      name: "Dr. Binod Acharya",
      phone: "9878901234",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Keep existing services from other locations
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

    // DO NOT clear existing data - just add new services
    console.log("� Adding new services from Rupandehi district...");

    // Combine both datasets
    const allServices = [...rupandehiServices, ...sampleServices];

    const result = await collection.insertMany(allServices);
    console.log(`✅ Successfully inserted ${result.insertedCount} services!`);
    console.log(`   - Rupandehi services: ${rupandehiServices.length}`);
    console.log(`   - Other locations: ${sampleServices.length}`);

    // Create indexes for better query performance
    console.log("📊 Creating indexes...");
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ "location.district": 1 });
    await collection.createIndex({ "serviceDetails.location": "2dsphere" }); // Geospatial index
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ createdAt: -1 });
    console.log("✅ Indexes created!");

    // Get total count
    const totalCount = await collection.countDocuments();

    // Display summary
    console.log("\n📋 Database Summary:");
    console.log(`   Total Services in Database: ${totalCount}`);
    console.log(`   New Services Added: ${result.insertedCount}`);
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
