# AI Prompt: Website Development Flow for "Osteon" Medical Service Platform

## **Objective**

Build a responsive web application that connects users with free government medical services. The flow should be intuitive, starting from a simple landing page and leading to a detailed, location-aware service directory.

---

## **Backend and Database**

- **Database:** All service information, user data, and related content will be stored in a MongoDB database. API endpoints should be created to query this database.

---

## **1. Landing Page**

- **Component:** `LandingPage`
- **UI/UX:**
  - This page should be clean and minimalist. It serves as a simple entry point.
  - **No Navigation Bar.**
  - Display a compelling headline and a short introductory paragraph explaining the website's purpose: "Easily find and access free medical services, checkups, and camps provided by the government near you."
  - Include one prominent button with the text "Find Free Services".
- **Functionality:**
  - Clicking the "Find Free Services" button navigates the user to the `/services` route (the Service Page).

---

## **2. Location-Aware Service Loading**

- **Trigger:** Immediately after the user navigates to the `/services` page.
- **Functionality:**
  1. **Request Location Permission:** A modal or browser prompt should ask the user for permission to access their location.
  2. **Handle User Choice:**
     - **If User Allows:**
       - Get the user's current geographical coordinates.
       - Fetch and display services, prioritizing those that are geographically closest to the user.
     - **If User Denies:**
       - Fetch and display all services from across the country.
       - The default sorting order should be alphabetical by service title or category.
  3. **Data Loading Strategy:**
     - **Do not load all data at once.** Implement pagination or an infinite scroll mechanism to load services in batches (e.g., 10-15 at a time) to ensure fast initial page load and good performance.

---

## **3. Service Page (`/services`)**

- **Component:** `ServicesPage`
- **UI/UX:**
  - **Navigation Bar:** This page **must** have a navigation bar at the top.
    - **Nav Links:** "Services", "About Us".
    - **Login Button:** A "User Login" button should be present, typically on the right side of the navbar.
  - **Filtering/Categorization:**
    - Display filter options prominently above the service listings.
    - Allow users to filter services by:
      - **Category** (e.g., General Health, Dental, Eye Care).
      - **Type of Diagnosis** (e.g., Diabetes Screening, Blood Pressure Check).
      - Include an "All" or "All Categories" option to reset filters.
  - **Service Listings:**
    - Display the filtered services as a grid or list of cards.
    - Each card (`ServiceCard` component) should be clickable and display concise information:
      - Service Title (e.g., "Free Dental Checkup Camp").
      - A brief, one-sentence description.
      - Location (City/District).
      - Date of the event.

---

## **4. Service Detail Page (`/services/:id`)**

- **Component:** `ServiceDetailPage`
- **Functionality:**
  - This page is displayed when a user clicks on a `ServiceCard`. It should fetch and show detailed information for that specific service.
- **UI/UX:**
  - **Main Content Area:**
    - **What it is about:** A detailed paragraph describing the service/camp.
    - **What it checks:** A list or paragraph detailing the specific tests or checkups included.
    - **Requirements:** Any prerequisites for the user (e.g., "Must be a citizen," "Bring ID card").
  - **Service Details Div:**
    - Create a visually distinct `div` or box to highlight key logistical information.
    - **Nepali Date:** The event date in the B.S. calendar format.
    - **Time:** The start and end times of the service.
    - **Location:** The full, specific address of the venue.
    - **Capacity:** The maximum number of people the camp can serve (e.g., "Limited to 100 people").
  - **Contact Information:**
    - Below the details `div`, provide contact information (e.g., phone number, contact person) for inquiries.

---

## **5. About Page (`/about`)**

- **Component:** `AboutPage`
- **UI/UX:**
  - This page should be accessible from the main navigation bar.
  - Structure the content into clear sections:
    - **Our Mission:** A concise statement about the organization's goal.
    - **The Problem We Are Solving:** Briefly explain the information gap regarding free healthcare.
    - **How It Works:** A simple explanation of the data collection process (agents updating the system from health posts).
