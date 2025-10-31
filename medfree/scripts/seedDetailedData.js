/**
 * Comprehensive Fake Data Seeding Script for MedFree
 * Focuses on Rupandehi locations (Manigram, Shankarnagar, Butwal) + Nepal-wide services
 * Run with: npm run seed-detailed
 */

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

const { MongoClient } = require("mongodb");

// Comprehensive service data with focus on Rupandehi locations
const services = [
  // ==================== MANIGRAM, RUPANDEHI (3-4 services) ====================
  {
    title: "Free General Health Checkup Camp - Manigram",
    description:
      "Comprehensive general health screening including blood tests, blood pressure, and consultation with experienced doctors.",
    shortDescription:
      "Free general health checkup with blood tests and doctor consultation.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Complete Blood Count (CBC)",
      "Blood Pressure Measurement",
      "Blood Sugar Level (Fasting)",
      "BMI and Weight Check",
      "General Physical Examination",
    ],
    requirements: [
      "Bring valid citizenship card or voter ID",
      "Fast for 8-10 hours before the test",
      "Arrive 30 minutes before start time",
      "Registration mandatory (first come, first served)",
    ],
    location: {
      type: "Point",
      coordinates: [83.44, 27.64], // Manigram coordinates
    },
    address:
      "Manigram Community Health Center, Ward No. 5, Manigram, Rupandehi",
    city: "Manigram",
    district: "Rupandehi",
    date: new Date("2025-11-12"),
    dateNepali: "२०८२ कार्तिक २७",
    timeStart: "07:00 AM",
    timeEnd: "01:00 PM",
    capacity: 120,
    contactPerson: "Mr. Ramesh Kumar Thapa",
    contactPhone: "+977-9857123456",
    contactEmail: "health@manigram.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "COVID-19 and Flu Vaccination Drive - Manigram",
    description:
      "Comprehensive vaccination drive offering free COVID-19 booster shots (Pfizer, Moderna, or Covishield) and seasonal influenza vaccines for all age groups. This initiative is part of the government's ongoing effort to maintain public health and prevent seasonal disease outbreaks. The camp will be staffed by trained medical professionals, including doctors and nurses from Manigram Health Post and Lumbini Provincial Hospital. All vaccines are WHO-approved and have been stored under proper cold chain conditions. Post-vaccination monitoring will be conducted for 30 minutes to ensure safety. Priority will be given to elderly citizens (60+), pregnant women, healthcare workers, and individuals with chronic illnesses. Walk-ins are welcome, but pre-registration is encouraged through our helpline or website to minimize wait times.",
    shortDescription: "Free COVID-19 booster and flu vaccines for all ages with professional medical supervision.",
    category: "General Health",
    diagnosisType: "Vaccination",
    whatItChecks: [
      "Body Temperature Screening (contactless thermometer)",
      "Comprehensive Vaccination History Review",
      "COVID-19 Booster Dose (3rd/4th dose as applicable)",
      "Seasonal Influenza Vaccine (Quadrivalent)",
      "Blood Pressure Monitoring",
      "Oxygen Saturation Check",
      "30-minute Post-vaccination Observation",
      "Adverse Event Monitoring",
      "Digital Vaccination Certificate Issuance"
    ],
    requirements: [
      "Bring previous vaccination card (yellow card or digital certificate)",
      "Valid citizenship card, voter ID, or any government-issued photo ID",
      "Inform staff of any known allergies (especially to vaccine components)",
      "Declare current medications and chronic health conditions",
      "Children under 12 must be accompanied by parent or legal guardian",
      "Pregnant women should bring prenatal checkup records",
      "Wear loose, short-sleeved clothing for easy vaccine administration",
      "Do not come if you have active fever or illness (can reschedule)"
    ],
    location: {
      type: "Point",
      coordinates: [83.441, 27.642],
    },
    address: "Manigram Primary Health Post, Near Manigram Chowk, Manigram-5, Tilottama Municipality, Rupandehi",
    city: "Manigram",
    district: "Rupandehi",
    date: new Date("2025-11-16"),
    dateNepali: "२०८२ मंसिर ०१",
    timeStart: "08:00 AM",
    timeEnd: "04:00 PM",
    capacity: 200,
    contactPerson: "Dr. Sunita Sharma (Medical Officer, Manigram Health Post)",
    contactPhone: "+977-9847234567",
    contactEmail: "vaccination@manigram.health.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Blood Pressure and Diabetes Screening - Manigram",
    description:
      "Special screening camp for hypertension and diabetes. Free medications will be provided to eligible patients diagnosed during the camp.",
    shortDescription:
      "Free BP and diabetes screening with free medications for eligible patients.",
    category: "General Health",
    diagnosisType: "Blood Pressure Check",
    whatItChecks: [
      "Blood Pressure Measurement",
      "Fasting Blood Sugar Test",
      "Random Blood Sugar Test",
      "HbA1c Test (for select cases)",
      "Cardiovascular Risk Assessment",
    ],
    requirements: [
      "Must be above 30 years of age",
      "Fast for 10-12 hours",
      "Bring citizenship card",
      "Previous medical records if available",
    ],
    location: {
      type: "Point",
      coordinates: [83.439, 27.641],
    },
    address: "Manigram Ayurvedic Clinic, Bhairahawa Road, Manigram, Rupandehi",
    city: "Manigram",
    district: "Rupandehi",
    date: new Date("2025-11-20"),
    dateNepali: "२०८२ मंसिर ०५",
    timeStart: "06:30 AM",
    timeEnd: "12:00 PM",
    capacity: 100,
    contactPerson: "Dr. Prakash Adhikari",
    contactPhone: "+977-9856345678",
    contactEmail: "diabetes@manigram.org",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Women and Child Health Camp - Manigram",
    description:
      "Comprehensive maternal and child health services including prenatal checkups, child immunization, nutritional counseling, and free vitamin supplements.",
    shortDescription:
      "Free health services for pregnant women and children under 5 years.",
    category: "Women's Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Prenatal Health Screening",
      "Child Growth Monitoring",
      "Immunization Administration",
      "Hemoglobin Test",
      "Nutritional Assessment and Counseling",
    ],
    requirements: [
      "Bring child's vaccination card",
      "Mother's citizenship or marriage certificate",
      "Previous prenatal reports if available",
      "Children must be accompanied by guardian",
    ],
    location: {
      type: "Point",
      coordinates: [83.442, 27.639],
    },
    address: "Manigram Women's Health Center, Tilottama-5, Manigram, Rupandehi",
    city: "Manigram",
    district: "Rupandehi",
    date: new Date("2025-11-24"),
    dateNepali: "२०८२ मंसिर ०९",
    timeStart: "09:00 AM",
    timeEnd: "02:00 PM",
    capacity: 80,
    contactPerson: "Dr. Anita Gautam",
    contactPhone: "+977-9865456789",
    contactEmail: "women@manigram.health.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ==================== SHANKARNAGAR, RUPANDEHI (3-4 services) ====================
  {
    title: "Free Eye Checkup and Vision Screening Camp - Shankarnagar",
    description:
      "Complete eye examination by certified ophthalmologists. Free reading glasses will be distributed to those in need. Cataract screening also available.",
    shortDescription:
      "Free comprehensive eye checkup with free glasses for eligible candidates.",
    category: "Eye Care",
    diagnosisType: "Eye Test",
    whatItChecks: [
      "Visual Acuity Test",
      "Refractive Error Assessment",
      "Color Vision Test",
      "Intraocular Pressure Check",
      "Cataract Screening",
      "Retinal Examination",
    ],
    requirements: [
      "Bring previous eyeglass prescription if available",
      "Valid citizenship or ID card",
      "Children must be accompanied by guardian",
      "No eye makeup on day of examination",
    ],
    location: {
      type: "Point",
      coordinates: [83.46, 27.66], // Shankarnagar coordinates
    },
    address:
      "Shankarnagar Eye Hospital, Near Traffic Police Office, Shankarnagar, Rupandehi",
    city: "Shankarnagar",
    district: "Rupandehi",
    date: new Date("2025-11-14"),
    dateNepali: "२०८२ कार्तिक २९",
    timeStart: "08:00 AM",
    timeEnd: "05:00 PM",
    capacity: 150,
    contactPerson: "Dr. Bijay Kumar Yadav",
    contactPhone: "+977-9847567890",
    contactEmail: "eye@shankarnagar.health.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Dental Health Checkup and Treatment Camp - Shankarnagar",
    description:
      "Professional dental examination, teeth cleaning, fluoride treatment, and minor cavity fillings. Oral health education for children and adults.",
    shortDescription: "Free dental checkup, cleaning, and basic treatments.",
    category: "Dental Care",
    diagnosisType: "Dental Checkup",
    whatItChecks: [
      "Oral Health Examination",
      "Teeth Cleaning and Scaling",
      "Cavity Detection",
      "Gum Health Assessment",
      "Fluoride Treatment",
      "Minor Cavity Filling (if needed)",
    ],
    requirements: [
      "Must bring ID or citizenship card",
      "Brush teeth before coming",
      "Inform staff of any allergies or medications",
      "Children under 10 must have guardian present",
    ],
    location: {
      type: "Point",
      coordinates: [83.461, 27.661],
    },
    address:
      "Shankarnagar Dental Clinic, Siddhartha Highway, Shankarnagar, Rupandehi",
    city: "Shankarnagar",
    district: "Rupandehi",
    date: new Date("2025-11-18"),
    dateNepali: "२०८२ मंसिर ०३",
    timeStart: "09:00 AM",
    timeEnd: "04:00 PM",
    capacity: 90,
    contactPerson: "Dr. Sita Devi Joshi",
    contactPhone: "+977-9856678901",
    contactEmail: "dental@shankarnagar.org",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Mental Health Awareness and Counseling Camp - Shankarnagar",
    description:
      "Free mental health screening, stress management counseling, and awareness sessions. Professional psychologists available for private consultation.",
    shortDescription:
      "Free mental health screening and professional counseling services.",
    category: "Mental Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Mental Health Screening Questionnaire",
      "Stress and Anxiety Assessment",
      "Depression Screening",
      "One-on-One Counseling Session",
      "Stress Management Techniques Training",
    ],
    requirements: [
      "All ages welcome (parental consent for minors)",
      "Confidentiality guaranteed",
      "Bring any previous mental health records",
      "Comfortable, private consultation rooms available",
    ],
    location: {
      type: "Point",
      coordinates: [83.459, 27.662],
    },
    address:
      "Shankarnagar Community Center, Ward No. 3, Shankarnagar, Rupandehi",
    city: "Shankarnagar",
    district: "Rupandehi",
    date: new Date("2025-11-22"),
    dateNepali: "२०८२ मंसिर ०७",
    timeStart: "10:00 AM",
    timeEnd: "05:00 PM",
    capacity: 60,
    contactPerson: "Dr. Ramesh Pandey (Clinical Psychologist)",
    contactPhone: "+977-9865789012",
    contactEmail: "mental@shankarnagar.health.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Skin Disease Screening and Treatment - Shankarnagar",
    description:
      "Dermatology camp for diagnosis and treatment of common skin conditions. Free medications and ointments provided for eligible patients.",
    shortDescription:
      "Free skin disease screening with medications for common conditions.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Skin Condition Examination",
      "Fungal Infection Screening",
      "Eczema and Psoriasis Assessment",
      "Acne and Pigmentation Treatment",
      "Skin Allergy Testing",
    ],
    requirements: [
      "Bring citizenship card",
      "List of current medications if any",
      "Clean skin (no makeup or creams)",
      "Previous dermatology reports if available",
    ],
    location: {
      type: "Point",
      coordinates: [83.462, 27.659],
    },
    address: "Shankarnagar Skin Clinic, Butwal Road, Shankarnagar, Rupandehi",
    city: "Shankarnagar",
    district: "Rupandehi",
    date: new Date("2025-11-26"),
    dateNepali: "२०८२ मंसिर ११",
    timeStart: "08:30 AM",
    timeEnd: "03:00 PM",
    capacity: 70,
    contactPerson: "Dr. Krishna Bahadur Thapa",
    contactPhone: "+977-9847890123",
    contactEmail: "skin@shankarnagar.clinic.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ==================== LUMBINI PROVINCIAL HOSPITAL, BUTWAL (3-4 services) ====================
  {
    title: "Free Cardiac Health Screening - Lumbini Provincial Hospital",
    description:
      "Comprehensive cardiovascular health assessment including ECG, echocardiogram, and consultation with cardiologists. Special focus on early detection of heart conditions.",
    shortDescription:
      "Free heart health screening with ECG, echo, and cardiologist consultation.",
    category: "General Health",
    diagnosisType: "Blood Pressure Check",
    whatItChecks: [
      "Electrocardiogram (ECG)",
      "Echocardiogram (2D Echo)",
      "Blood Pressure Monitoring",
      "Cholesterol Level Test",
      "Cardiac Risk Assessment",
      "Stress Test (if required)",
    ],
    requirements: [
      "Valid citizenship card required",
      "Fast for 6 hours before test",
      "Avoid caffeine 4 hours before",
      "Bring previous cardiac reports if any",
      "Wear comfortable clothing",
    ],
    location: {
      type: "Point",
      coordinates: [83.45, 27.7], // Lumbini Provincial Hospital, Butwal
    },
    address:
      "Lumbini Provincial Hospital, Cardiology Department, Milanchowk, Butwal",
    city: "Butwal",
    district: "Rupandehi",
    date: new Date("2025-11-15"),
    dateNepali: "२०८२ कार्तिक ३०",
    timeStart: "06:00 AM",
    timeEnd: "02:00 PM",
    capacity: 180,
    contactPerson: "Dr. Dipak Sharma (Cardiologist)",
    contactPhone: "+977-9857901234",
    contactEmail: "cardio@lumbinihospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Cancer Screening Camp - Lumbini Provincial Hospital",
    description:
      "Early detection screening for common cancers including breast, cervical, oral, and prostate cancer. Trained oncologists available for consultation.",
    shortDescription:
      "Free cancer screening for early detection and prevention.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Breast Cancer Screening (Mammography for women 40+)",
      "Cervical Cancer Screening (Pap Smear)",
      "Oral Cancer Examination",
      "Prostate Cancer Screening (PSA test for men 50+)",
      "General Cancer Risk Assessment",
    ],
    requirements: [
      "Age: Women 30+, Men 40+ preferred",
      "Bring citizenship card and ID",
      "Previous cancer screening reports if available",
      "Family history of cancer (if any)",
      "Comfortable clothing for examination",
    ],
    location: {
      type: "Point",
      coordinates: [83.451, 27.701],
    },
    address:
      "Lumbini Provincial Hospital, Oncology Wing, Traffic Chowk, Butwal",
    city: "Butwal",
    district: "Rupandehi",
    date: new Date("2025-11-19"),
    dateNepali: "२०८२ मंसिर ०४",
    timeStart: "07:00 AM",
    timeEnd: "01:00 PM",
    capacity: 100,
    contactPerson: "Dr. Maya Gurung (Oncologist)",
    contactPhone: "+977-9866012345",
    contactEmail: "oncology@lumbinihospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Kidney Function and Dialysis Awareness Camp - Butwal",
    description:
      "Kidney function tests, urine analysis, and awareness about kidney disease prevention. Free consultation with nephrologists and dialysis information.",
    shortDescription:
      "Free kidney function tests with nephrologist consultation.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Serum Creatinine Test",
      "Blood Urea Nitrogen (BUN)",
      "Urine Analysis",
      "Kidney Function Test (KFT)",
      "Blood Pressure Measurement",
      "eGFR Calculation",
    ],
    requirements: [
      "Bring citizenship card",
      "Fast for 8 hours before test",
      "List of current medications",
      "Previous kidney function reports if any",
      "Diabetic and hypertensive patients prioritized",
    ],
    location: {
      type: "Point",
      coordinates: [83.449, 27.702],
    },
    address:
      "Lumbini Provincial Hospital, Nephrology Department, Golpark, Butwal",
    city: "Butwal",
    district: "Rupandehi",
    date: new Date("2025-11-23"),
    dateNepali: "२०८२ मंसिर ०८",
    timeStart: "06:30 AM",
    timeEnd: "12:30 PM",
    capacity: 120,
    contactPerson: "Dr. Rajesh Kumar Singh (Nephrologist)",
    contactPhone: "+977-9856123456",
    contactEmail: "nephro@lumbinihospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title:
      "Free Orthopedic and Joint Health Camp - Lumbini Provincial Hospital",
    description:
      "Orthopedic consultation for bone and joint problems. X-ray facility available. Physiotherapy demonstrations and arthritis screening included.",
    shortDescription:
      "Free orthopedic consultation with X-ray and joint health screening.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Bone and Joint Examination",
      "X-ray (if required)",
      "Arthritis Screening",
      "Bone Density Assessment",
      "Posture and Gait Analysis",
      "Physiotherapy Consultation",
    ],
    requirements: [
      "Bring citizenship card",
      "Previous X-rays or reports if available",
      "Wear comfortable, loose clothing",
      "List of current medications and supplements",
      "Elderly patients given priority",
    ],
    location: {
      type: "Point",
      coordinates: [83.452, 27.699],
    },
    address:
      "Lumbini Provincial Hospital, Orthopedic Department, Kalikanagar, Butwal",
    city: "Butwal",
    district: "Rupandehi",
    date: new Date("2025-11-27"),
    dateNepali: "२०८२ मंसिर १२",
    timeStart: "08:00 AM",
    timeEnd: "03:00 PM",
    capacity: 110,
    contactPerson: "Dr. Nirajan Shrestha (Orthopedic Surgeon)",
    contactPhone: "+977-9865234567",
    contactEmail: "ortho@lumbinihospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // ==================== ADDITIONAL NEPAL-WIDE SERVICES (5-8 services) ====================
  {
    title: "Free Diabetes and Thyroid Screening - Kathmandu",
    description:
      "Comprehensive screening for diabetes and thyroid disorders at Nepal's premier hospital. Free medications for newly diagnosed patients.",
    shortDescription:
      "Free diabetes and thyroid tests with specialist consultation in Kathmandu.",
    category: "General Health",
    diagnosisType: "Diabetes Screening",
    whatItChecks: [
      "Fasting Blood Sugar",
      "HbA1c Test",
      "Thyroid Function Test (TSH, T3, T4)",
      "Blood Pressure Check",
      "BMI Assessment",
    ],
    requirements: [
      "Fast for 10-12 hours",
      "Bring valid ID card",
      "Previous medical reports if any",
    ],
    location: {
      type: "Point",
      coordinates: [85.324, 27.7172],
    },
    address: "Tribhuvan University Teaching Hospital, Maharajgunj, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    date: new Date("2025-11-17"),
    dateNepali: "२०८२ मंसिर ०२",
    timeStart: "07:00 AM",
    timeEnd: "01:00 PM",
    capacity: 200,
    contactPerson: "Dr. Anil Sharma",
    contactPhone: "+977-01-4412303",
    contactEmail: "endocrine@tuth.edu.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Child Vaccination and Growth Monitoring - Pokhara",
    description:
      "Complete vaccination schedule for children 0-5 years. Growth monitoring, nutritional counseling, and vitamin supplements provided free of cost.",
    shortDescription:
      "Free vaccinations and growth monitoring for children under 5.",
    category: "Child Health",
    diagnosisType: "Vaccination",
    whatItChecks: [
      "Vaccination Status Review",
      "Growth Monitoring (Height/Weight)",
      "Development Milestone Assessment",
      "Nutritional Status Check",
      "Vitamin A and Deworming",
    ],
    requirements: [
      "Bring child's vaccination card",
      "Birth certificate or citizenship",
      "Child must be accompanied by parent/guardian",
    ],
    location: {
      type: "Point",
      coordinates: [83.9856, 28.2096],
    },
    address:
      "Western Regional Hospital, Pediatric Department, Ramghat, Pokhara",
    city: "Pokhara",
    district: "Kaski",
    date: new Date("2025-11-21"),
    dateNepali: "२०८२ मंसिर ०६",
    timeStart: "09:00 AM",
    timeEnd: "02:00 PM",
    capacity: 150,
    contactPerson: "Dr. Binita Gurung",
    contactPhone: "+977-061-520222",
    contactEmail: "pediatrics@wrh.pokhara.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free ENT (Ear, Nose, Throat) Checkup Camp - Chitwan",
    description:
      "Comprehensive ENT examination including hearing tests, throat examination, and treatment for common ENT problems. Audiometry tests available.",
    shortDescription: "Free ENT checkup with hearing tests and treatment.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Ear Examination",
      "Hearing Test (Audiometry)",
      "Nose and Sinus Examination",
      "Throat and Tonsil Check",
      "Voice and Speech Assessment",
    ],
    requirements: [
      "Bring citizenship card",
      "Previous ENT reports if available",
      "Children must be with guardian",
    ],
    location: {
      type: "Point",
      coordinates: [84.4295, 27.5291],
    },
    address: "Bharatpur Hospital, ENT Department, Bharatpur-10, Chitwan",
    city: "Bharatpur",
    district: "Chitwan",
    date: new Date("2025-11-25"),
    dateNepali: "२०८२ मंसिर १०",
    timeStart: "08:00 AM",
    timeEnd: "03:00 PM",
    capacity: 100,
    contactPerson: "Dr. Suresh Pandey",
    contactPhone: "+977-056-527789",
    contactEmail: "ent@bharatpurhospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Liver Function and Hepatitis Screening - Biratnagar",
    description:
      "Comprehensive liver function tests and hepatitis B & C screening. Free consultation with gastroenterologists and hepatitis vaccination.",
    shortDescription:
      "Free liver function tests and hepatitis screening in Biratnagar.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Liver Function Test (LFT)",
      "Hepatitis B Antigen Test",
      "Hepatitis C Antibody Test",
      "Bilirubin Level Check",
      "Liver Enzyme Tests (SGOT, SGPT)",
    ],
    requirements: [
      "Fast for 8 hours before test",
      "Bring valid ID card",
      "Previous liver reports if any",
      "List of medications being taken",
    ],
    location: {
      type: "Point",
      coordinates: [87.2718, 26.4525],
    },
    address:
      "Nobel Medical College, Gastroenterology Department, Biratnagar-5, Morang",
    city: "Biratnagar",
    district: "Morang",
    date: new Date("2025-11-28"),
    dateNepali: "२०८२ मंसिर १३",
    timeStart: "07:00 AM",
    timeEnd: "01:00 PM",
    capacity: 130,
    contactPerson: "Dr. Prakash Yadav",
    contactPhone: "+977-021-525252",
    contactEmail: "gastro@nobel.edu.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Respiratory Health and Asthma Camp - Lalitpur",
    description:
      "Pulmonary function tests, asthma screening, and respiratory health assessment. Free inhalers for diagnosed asthma patients.",
    shortDescription:
      "Free respiratory health checkup with asthma screening and treatment.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Pulmonary Function Test (PFT)",
      "Spirometry Test",
      "Asthma Screening",
      "Chest X-ray (if required)",
      "Oxygen Saturation Measurement",
    ],
    requirements: [
      "Bring citizenship card",
      "Previous respiratory reports if any",
      "Do not use inhaler 6 hours before test",
      "Avoid smoking 24 hours before",
    ],
    location: {
      type: "Point",
      coordinates: [85.3206, 27.6915],
    },
    address: "Patan Hospital, Pulmonology Department, Lagankhel, Lalitpur",
    city: "Lalitpur",
    district: "Lalitpur",
    date: new Date("2025-11-29"),
    dateNepali: "२०८२ मंसिर १४",
    timeStart: "08:00 AM",
    timeEnd: "02:00 PM",
    capacity: 90,
    contactPerson: "Dr. Ramesh Koirala",
    contactPhone: "+977-01-5522295",
    contactEmail: "pulmo@patanhospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Free Geriatric Health and Elderly Care Camp - Bhaktapur",
    description:
      "Specialized health services for senior citizens including comprehensive health screening, bone density tests, and elderly care counseling.",
    shortDescription:
      "Free comprehensive health screening specially designed for elderly citizens.",
    category: "General Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Complete Health Screening",
      "Bone Density Test",
      "Memory and Cognitive Assessment",
      "Vision and Hearing Check",
      "Blood Pressure and Sugar Monitoring",
      "Nutritional Counseling",
    ],
    requirements: [
      "Age 60 years and above",
      "Bring citizenship card",
      "Previous medical records",
      "May be accompanied by family member",
    ],
    location: {
      type: "Point",
      coordinates: [85.4298, 27.671],
    },
    address: "Bhaktapur Hospital, Geriatric Ward, Kamal Binayak, Bhaktapur",
    city: "Bhaktapur",
    district: "Bhaktapur",
    date: new Date("2025-11-30"),
    dateNepali: "२०८२ मंसिर १५",
    timeStart: "09:00 AM",
    timeEnd: "03:00 PM",
    capacity: 80,
    contactPerson: "Dr. Shiva Prasad Bhattarai",
    contactPhone: "+977-01-6610798",
    contactEmail: "geriatric@bhaktapurhospital.gov.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample users data (mirroring Clerk auth structure)
const users = [
  {
    clerkUserId: "user_2abcdefghijklmnop",
    firstName: "Ram",
    lastName: "Sharma",
    email: "ram.sharma@example.com",
    profileImageUrl: "https://img.clerk.com/user_default",
    createdAt: new Date(),
  },
  {
    clerkUserId: "user_2qrstuvwxyz123456",
    firstName: "Sita",
    lastName: "Thapa",
    email: "sita.thapa@example.com",
    profileImageUrl: "https://img.clerk.com/user_default",
    createdAt: new Date(),
  },
  {
    clerkUserId: "user_2hijklmnopqrstuv",
    firstName: "Krishna",
    lastName: "Adhikari",
    email: "krishna.adhikari@example.com",
    profileImageUrl: "https://img.clerk.com/user_default",
    createdAt: new Date(),
  },
  {
    clerkUserId: "user_2abcxyz789012345",
    firstName: "Maya",
    lastName: "Gurung",
    email: "maya.gurung@example.com",
    profileImageUrl: "https://img.clerk.com/user_default",
    createdAt: new Date(),
  },
  {
    clerkUserId: "user_2mnopqrs678901234",
    firstName: "Rajesh",
    lastName: "Yadav",
    email: "rajesh.yadav@example.com",
    profileImageUrl: "https://img.clerk.com/user_default",
    createdAt: new Date(),
  },
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("medfree");

    // Clear existing data
    console.log("\n🗑️  Clearing existing data...");
    await db.collection("services").deleteMany({});
    await db.collection("users").deleteMany({});
    console.log("✅ Existing data cleared");

    // Insert services
    console.log("\n📥 Inserting services...");
    const servicesResult = await db.collection("services").insertMany(services);
    console.log(`✅ Inserted ${servicesResult.insertedCount} services`);

    // Insert users
    console.log("\n👥 Inserting users...");
    const usersResult = await db.collection("users").insertMany(users);
    console.log(`✅ Inserted ${usersResult.insertedCount} users`);

    // Create indexes
    console.log("\n🔧 Creating indexes...");
    const servicesCollection = db.collection("services");

    await servicesCollection.createIndex({ location: "2dsphere" });
    await servicesCollection.createIndex({
      title: "text",
      description: "text",
      city: "text",
    });
    await servicesCollection.createIndex({ category: 1 });
    await servicesCollection.createIndex({ diagnosisType: 1 });
    await servicesCollection.createIndex({ date: 1 });
    await servicesCollection.createIndex({ isActive: 1 });

    const usersCollection = db.collection("users");
    await usersCollection.createIndex({ clerkUserId: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    console.log("✅ All indexes created");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));

    console.log("\n📊 Summary:");
    console.log(`   • ${servicesResult.insertedCount} services inserted`);
    console.log(`   • ${usersResult.insertedCount} users inserted`);

    console.log("\n📍 Location Breakdown:");
    console.log("   • Manigram, Rupandehi: 4 services");
    console.log("   • Shankarnagar, Rupandehi: 4 services");
    console.log("   • Butwal (Lumbini Provincial Hospital): 4 services");
    console.log("   • Other Nepal locations: 6 services");

    console.log("\n🏥 Service Categories:");
    const categoryCounts = services.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {});
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} service(s)`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ Ready to test! Run: npm run dev");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Database connection closed\n");
  }
}

// Run the seeding function
seedDatabase();
