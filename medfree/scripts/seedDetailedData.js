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
    shortDescription:
      "Free COVID-19 booster and flu vaccines for all ages with professional medical supervision.",
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
      "Digital Vaccination Certificate Issuance",
    ],
    requirements: [
      "Bring previous vaccination card (yellow card or digital certificate)",
      "Valid citizenship card, voter ID, or any government-issued photo ID",
      "Inform staff of any known allergies (especially to vaccine components)",
      "Declare current medications and chronic health conditions",
      "Children under 12 must be accompanied by parent or legal guardian",
      "Pregnant women should bring prenatal checkup records",
      "Wear loose, short-sleeved clothing for easy vaccine administration",
      "Do not come if you have active fever or illness (can reschedule)",
    ],
    location: {
      type: "Point",
      coordinates: [83.441, 27.642],
    },
    address:
      "Manigram Primary Health Post, Near Manigram Chowk, Manigram-5, Tilottama Municipality, Rupandehi",
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
      "Comprehensive maternal and child healthcare camp providing essential medical services for pregnant women, new mothers, and children under 5 years of age. This government-sponsored initiative aims to reduce maternal and infant mortality by ensuring access to quality prenatal and postnatal care. Our team of gynecologists, pediatricians, nurses, and nutritionists will provide complete health assessments, immunizations, and counseling services. Pregnant women will receive free prenatal checkups including ultrasound scans, blood tests, and nutritional supplements (iron, folic acid, calcium tablets). Children will receive growth monitoring, developmental assessments, and catch-up immunization if needed. Free vitamin A supplements, deworming tablets, and nutritional food packets will be distributed. Breastfeeding counseling, family planning advice, and postnatal care guidance will be provided by experienced female health workers. Special sessions on newborn care, identifying danger signs in pregnancy, and child nutrition will be conducted throughout the day. All services are provided in a comfortable, woman-friendly environment with privacy and dignity. Follow-up appointments and home visits can be arranged for high-risk cases.",
    shortDescription:
      "Free comprehensive health services for pregnant women and children under 5 years.",
    category: "Women's Health",
    diagnosisType: "General Checkup",
    whatItChecks: [
      "Prenatal Health Screening (Blood Pressure, Weight, Fundal Height)",
      "Ultrasound Scan for Pregnant Women (Fetal Growth Assessment)",
      "Hemoglobin Test (Anemia Screening)",
      "Blood Group and Rh Factor Determination",
      "Urine Analysis (Protein and Sugar)",
      "Child Growth Monitoring (Height, Weight, Head Circumference)",
      "Developmental Milestone Assessment",
      "Complete Immunization Review and Catch-up Vaccination",
      "Nutritional Status Assessment (Mid-Upper Arm Circumference)",
      "Vitamin A Supplementation",
      "Deworming Treatment",
      "Breastfeeding Assessment and Counseling",
      "Family Planning Counseling",
      "Postnatal Care Check (for new mothers)"
    ],
    requirements: [
      "Bring child's immunization/vaccination card (blue card)",
      "Mother's citizenship card or marriage certificate",
      "ANC (Antenatal Care) card for pregnant women",
      "Previous medical reports, ultrasound scans, or blood test results if available",
      "Children must be accompanied by mother, father, or legal guardian",
      "Bring previous prescription and medications if child is under treatment",
      "For postnatal mothers: mention delivery date and any complications",
      "Comfortable clothing for examination (loose-fitting clothes recommended)",
      "If child has any allergies, inform the medical staff immediately"
    ],
    location: {
      type: "Point",
      coordinates: [83.442, 27.639],
    },
    address: "Manigram Women's Health Center, Tilottama-5, Manigram Bazaar Road, Rupandehi",
    city: "Manigram",
    district: "Rupandehi",
    date: new Date("2025-11-24"),
    dateNepali: "२०८२ मंसिर ०९",
    timeStart: "09:00 AM",
    timeEnd: "02:00 PM",
    capacity: 80,
    contactPerson: "Dr. Anita Gautam (MBBS, MD Pediatrics)",
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
      "Comprehensive ophthalmology camp providing complete eye care services including vision testing, eye disease screening, and free eyeglasses distribution. This camp is organized in collaboration with Nepal Eye Hospital and Shankarnagar Eye Care Foundation to serve the community. Our team of experienced ophthalmologists, optometrists, and eye care specialists will conduct thorough eye examinations using advanced diagnostic equipment. Services include refraction testing for glasses, computer vision testing, color blindness assessment, glaucoma screening, cataract evaluation, and diabetic retinopathy screening for diabetic patients. Free reading glasses will be distributed on the spot to those diagnosed with refractive errors (myopia, hypermetropia, presbyopia). For complex cases requiring surgery (cataract, glaucoma, retinal problems), we will provide referrals to partner hospitals with up to 70% subsidized treatment costs. Special pediatric eye screening will be available for school-going children to detect common problems like lazy eye, squint, and refractive errors. Digital eye strain consultation will be provided for individuals working long hours on computers and mobile devices. Free eye hygiene kits and educational materials about eye care will be distributed to all participants.",
    shortDescription:
      "Free comprehensive eye checkup with free glasses for eligible candidates and disease screening.",
    category: "Eye Care",
    diagnosisType: "Eye Test",
    whatItChecks: [
      "Visual Acuity Test (Distance and Near Vision)",
      "Computerized Refraction Test",
      "Manual Refraction and Lens Power Determination",
      "Color Vision Test (Ishihara Color Plates)",
      "Intraocular Pressure Check (Glaucoma Screening)",
      "Cataract Screening using Slit Lamp Examination",
      "Retinal Examination (Fundoscopy)",
      "Diabetic Retinopathy Screening (for diabetic patients)",
      "Dry Eye Assessment",
      "Squint and Eye Alignment Check",
      "Lazy Eye (Amblyopia) Screening for Children",
      "Digital Eye Strain Evaluation",
      "Age-Related Macular Degeneration Screening (for elderly)",
      "Corneal Examination"
    ],
    requirements: [
      "Bring previous eyeglass prescription or old glasses if available",
      "Valid citizenship card or any government-issued photo ID",
      "Children under 12 must be accompanied by parent or guardian",
      "Do not wear eye makeup, kajal, or eyeliner on the day of examination",
      "If using contact lenses, remove them at least 2 hours before checkup",
      "Diabetic patients: bring recent blood sugar reports and medication list",
      "If you have had previous eye surgery, inform the doctor with operative notes",
      "Bring any prescription of current eye drops or medications",
      "For glaucoma suspects: family history of glaucoma should be mentioned",
      "Wear sunglasses after pupil dilation (sun sensitivity)"
    ],
    location: {
      type: "Point",
      coordinates: [83.46, 27.66], // Shankarnagar coordinates
    },
    address:
      "Shankarnagar Eye Hospital, Near Traffic Police Office, Siddhartha Highway, Shankarnagar-2, Rupandehi",
    city: "Shankarnagar",
    district: "Rupandehi",
    date: new Date("2025-11-14"),
    dateNepali: "२०८२ कार्तिक २९",
    timeStart: "08:00 AM",
    timeEnd: "05:00 PM",
    capacity: 150,
    contactPerson: "Dr. Bijay Kumar Yadav (MS Ophthalmology - Consultant Eye Surgeon)",
    contactPhone: "+977-9847567890",
    contactEmail: "eye@shankarnagar.health.np",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Dental Health Checkup and Treatment Camp - Shankarnagar",
    description:
      "Comprehensive dental care camp providing professional oral health services completely free of cost. Our team of experienced dentists and dental hygienists from Shankarnagar Dental College will conduct thorough oral examinations, professional teeth cleaning (scaling and polishing), fluoride treatments, and minor restorative procedures including cavity fillings. This camp aims to promote oral health awareness and provide essential dental care to underserved populations. Special attention will be given to children's dental health with educational sessions on proper brushing techniques, flossing, and dietary habits for healthy teeth. We will also conduct screenings for oral cancer, gum disease, and other dental conditions. Free dental hygiene kits (toothbrush, toothpaste, dental floss) will be distributed to all participants. For cases requiring advanced treatment (root canal, extractions, dentures), we will provide referrals to partner dental clinics with subsidized rates. The camp welcomes people of all ages, from toddlers getting their first dental checkup to elderly citizens needing denture care.",
    shortDescription: "Free comprehensive dental checkup, cleaning, and treatments with educational sessions.",
    category: "Dental Care",
    diagnosisType: "Dental Checkup",
    whatItChecks: [
      "Complete Oral Health Examination",
      "Professional Teeth Cleaning (Scaling and Polishing)",
      "Cavity Detection using Dental Mirror and Explorer",
      "Gum Health Assessment (Periodontal Screening)",
      "Oral Cancer Screening",
      "Fluoride Treatment Application",
      "Minor Cavity Filling (Dental Composite)",
      "Bite and Alignment Check",
      "Wisdom Teeth Assessment",
      "TMJ (Jaw Joint) Examination",
      "Pediatric Dental Assessment (for children)",
      "Dental X-ray (if medically necessary)"
    ],
    requirements: [
      "Valid citizenship card, voter ID, or any government-issued photo ID",
      "Brush teeth thoroughly before arriving at the camp",
      "Inform dental staff of any known allergies (especially to anesthetics or latex)",
      "List all current medications, especially blood thinners or heart medications",
      "Children under 10 years must be accompanied by parent or guardian",
      "If you have diabetes or heart conditions, please inform staff beforehand",
      "Remove lipstick, lip balm, or any oral cosmetics before examination",
      "Bring previous dental records or X-rays if available",
      "Denture wearers: bring your dentures for adjustment or cleaning"
    ],
    location: {
      type: "Point",
      coordinates: [83.461, 27.661],
    },
    address:
      "Shankarnagar Dental Clinic, Siddhartha Highway, Near Traffic Police Office, Shankarnagar-3, Rupandehi",
    city: "Shankarnagar",
    district: "Rupandehi",
    date: new Date("2025-11-18"),
    dateNepali: "२०८२ मंसिर ०३",
    timeStart: "09:00 AM",
    timeEnd: "04:00 PM",
    capacity: 90,
    contactPerson: "Dr. Sita Devi Joshi (BDS, MDS - Senior Dentist)",
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
      "State-of-the-art cardiovascular health assessment camp organized by the Cardiology Department of Lumbini Provincial Hospital. This comprehensive screening program is designed to detect early signs of heart disease and prevent cardiovascular complications through timely intervention. Our team of board-certified cardiologists, cardiac technicians, and specialized nurses will conduct detailed examinations using modern diagnostic equipment including digital ECG machines, portable echocardiography systems, and automated blood pressure monitors. The camp specifically targets high-risk populations including individuals over 40 years of age, those with family history of heart disease, diabetics, hypertensive patients, smokers, and people with sedentary lifestyles. Free cholesterol and lipid profile tests will be conducted for all participants. Based on screening results, patients will receive personalized lifestyle counseling, dietary recommendations, and exercise prescriptions. High-risk patients will be immediately referred to specialist consultation with subsidized follow-up care. The camp also includes educational sessions on heart attack warning signs, CPR basics, and preventive cardiology. Free heart-healthy diet recipe booklets and exercise guides will be distributed. Participants will receive a detailed cardiac risk assessment report within 2 days via SMS or email.",
    shortDescription:
      "Free comprehensive heart health screening with ECG, echo, and expert cardiologist consultation.",
    category: "General Health",
    diagnosisType: "Blood Pressure Check",
    whatItChecks: [
      "12-Lead Digital Electrocardiogram (ECG)",
      "2D Echocardiogram (Heart Ultrasound)",
      "Blood Pressure Monitoring (Multiple Readings)",
      "Complete Lipid Profile (Total Cholesterol, LDL, HDL, Triglycerides)",
      "Fasting Blood Sugar Test",
      "Cardiac Risk Stratification",
      "Heart Rate and Rhythm Analysis",
      "Heart Valve Function Assessment",
      "Cardiac Chamber Size Measurement",
      "Ejection Fraction Calculation",
      "Stress Test (Treadmill Test - for select high-risk patients)",
      "Ankle-Brachial Index (Peripheral Artery Disease Screening)",
      "Body Mass Index (BMI) and Waist-Hip Ratio",
      "Thyroid Function Test (if clinically indicated)"
    ],
    requirements: [
      "Valid citizenship card or government-issued photo ID (mandatory)",
      "Fast for 10-12 hours before the test (only water allowed)",
      "Avoid caffeine, tea, and smoking for at least 4 hours before examination",
      "Bring all previous cardiac reports, ECGs, echo reports if available",
      "Complete list of current medications (especially heart medicines, blood thinners)",
      "Medical history form (available at registration counter)",
      "Wear comfortable, loose-fitting clothing suitable for ECG electrode placement",
      "For stress test candidates: wear athletic shoes and comfortable exercise clothes",
      "Diabetic patients: bring your glucose monitoring device and regular medications",
      "If you have a pacemaker or implantable cardiac device, inform staff immediately",
      "Arrive at least 30 minutes early for registration and preparation",
      "For echo test: may need to change into hospital gown (provided free)"
    ],
    location: {
      type: "Point",
      coordinates: [83.45, 27.7], // Lumbini Provincial Hospital, Butwal
    },
    address:
      "Lumbini Provincial Hospital, Cardiology Department, Milanchowk, Butwal Sub-Metropolitan City-11, Rupandehi",
    city: "Butwal",
    district: "Rupandehi",
    date: new Date("2025-11-15"),
    dateNepali: "२०८२ कार्तिक ३०",
    timeStart: "06:00 AM",
    timeEnd: "02:00 PM",
    capacity: 180,
    contactPerson: "Dr. Dipak Sharma (MD, DM Cardiology - Senior Consultant Cardiologist)",
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
      "Premier endocrinology screening camp at Nepal's leading teaching hospital providing comprehensive diabetes and thyroid disorder assessment. This specialized camp is designed to detect and manage metabolic disorders that affect millions of Nepalis. Our team of endocrinologists, diabetologists, and laboratory technicians will conduct detailed screening using state-of-the-art diagnostic equipment. The camp focuses on early detection of Type 2 Diabetes, Pre-diabetes, Hypothyroidism, and Hyperthyroidism. All participants will receive free blood tests including fasting blood sugar, HbA1c (3-month blood sugar average), and complete thyroid function panel (TSH, T3, T4). Based on test results, patients will receive personalized dietary plans, exercise recommendations, and lifestyle modification guidance. Newly diagnosed diabetic patients will receive free glucometers, diabetes education materials, and 3 months supply of essential medications. Thyroid patients will receive appropriate referrals and subsidized treatment options. The camp includes educational sessions on diabetes prevention, insulin therapy basics, thyroid disorder management, and dietary counseling specifically designed for South Asian populations. Free diabetes cookbooks and meal planning guides will be distributed. Follow-up consultations can be scheduled at subsidized rates.",
    shortDescription:
      "Free diabetes and thyroid tests with specialist consultation and free medications.",
    category: "General Health",
    diagnosisType: "Diabetes Screening",
    whatItChecks: [
      "Fasting Blood Sugar (FBS) Test",
      "Random Blood Sugar (RBS) Test",
      "HbA1c Test (Glycated Hemoglobin - 3 month average)",
      "Thyroid Stimulating Hormone (TSH)",
      "Free T3 (Triiodothyronine)",
      "Free T4 (Thyroxine)",
      "Blood Pressure Measurement",
      "Body Mass Index (BMI) Calculation",
      "Waist Circumference Measurement",
      "Lipid Profile (if diabetic)",
      "Kidney Function Test (for diabetics)",
      "Foot Examination (diabetic foot screening)",
      "Retinopathy Risk Assessment",
      "Neuropathy Screening (nerve function test)"
    ],
    requirements: [
      "Strict fasting for 10-12 hours (no food, only plain water allowed)",
      "Valid citizenship card or government-issued photo ID (mandatory)",
      "Previous diabetes or thyroid reports if available",
      "List of all current medications (bring medicine packets/strips)",
      "For diabetic patients: bring your glucometer and blood sugar diary",
      "Family history of diabetes or thyroid disorders should be mentioned",
      "If on thyroid medication, take it after the test",
      "Pregnant women should inform staff (different reference ranges apply)",
      "Arrive at least 45 minutes early for registration",
      "Bring a light snack to eat after blood test"
    ],
    location: {
      type: "Point",
      coordinates: [85.324, 27.7172],
    },
    address: "Tribhuvan University Teaching Hospital, Endocrinology Department, Maharajgunj Medical Campus, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    date: new Date("2025-11-17"),
    dateNepali: "२०८२ मंसिर ०२",
    timeStart: "07:00 AM",
    timeEnd: "01:00 PM",
    capacity: 200,
    contactPerson: "Dr. Anil Sharma (MD, DM Endocrinology - Associate Professor)",
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
