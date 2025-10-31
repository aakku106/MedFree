# MedFree - Free Government Medical Services Platform

A Next.js application connecting citizens with free government medical services in Nepal. Find nearby health camps, checkups, and medical services easily.

## 🎯 Features

- **Location-aware service discovery** - Find services near you automatically
- **Smart filtering** - Filter by category, diagnosis type, and search keywords
- **Real-time updates** - Information updated by government health center agents
- **Responsive design** - Works seamlessly on mobile, tablet, and desktop
- **Smooth user experience** - Lenis smooth scrolling and optimized performance
- **Clerk authentication** - Secure user login and personalized features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or Atlas)
- Clerk account for authentication

### Installation

1. **Navigate to the medfree directory**

   ```bash
   cd medfree
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env` file:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   Create `.env.local` file:

   ```env
   MONGODB_URI=mongodb://localhost:27017
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Seed sample data (optional)**

   ```bash
   node scripts/seedSampleData.js
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
medfree/
├── app/
│   ├── api/
│   │   └── services/           # API routes for service data
│   ├── services/               # Services listing and detail pages
│   ├── about/                  # About page
│   ├── layout.js              # Root layout with Clerk provider
│   ├── page.js                # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── Navbar.jsx             # Navigation with Clerk auth
│   ├── ServiceCard.jsx        # Service card component
│   └── SmoothScroll.jsx       # Lenis smooth scroll
├── lib/
│   ├── mongodb.js             # MongoDB connection & utilities
│   └── utils.js               # Helper functions
├── scripts/
│   └── seedSampleData.js      # Sample data for testing
└── middleware.ts              # Clerk authentication middleware
```

## 🔑 Key Technologies

- **Next.js 16** - App Router, Server Components, API Routes
- **MongoDB** - NoSQL database with geospatial queries
- **Clerk** - Authentication and user management
- **Tailwind CSS 4** - Utility-first styling
- **Lenis** - Smooth scrolling
- **Geolocation API** - Location-based service discovery

## 🗄️ Database Schema

### Services Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  shortDescription: String,
  category: String,              // e.g., 'General Health', 'Dental Care'
  diagnosisType: String,         // e.g., 'Diabetes Screening'
  whatItChecks: Array<String>,
  requirements: Array<String>,
  location: {
    type: 'Point',
    coordinates: [lon, lat]      // GeoJSON format
  },
  address: String,
  city: String,
  district: String,
  date: Date,
  dateNepali: String,            // B.S. format
  timeStart: String,
  timeEnd: String,
  capacity: Number,
  contactPerson: String,
  contactPhone: String,
  contactEmail: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### GET /api/services

Query parameters:

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 12)
- `q` - Search query
- `category` - Filter by category
- `diagnosis` - Filter by diagnosis type
- `lat` & `lon` - User coordinates for proximity sorting

Response:

```json
{
  "services": [...],
  "total": 25,
  "page": 1,
  "limit": 12,
  "hasMore": true
}
```

### GET /api/services/[id]

Returns detailed information for a single service.

## 🎨 Design Principles

- **Mobile-first** - Optimized for mobile devices
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Lazy loading, pagination, optimized assets
- **User-centric** - Clear CTAs, intuitive navigation
- **Healthcare-focused** - Trustworthy, calming color palette

## 🔒 Authentication

Uses Clerk for authentication with the following features:

- User login/logout
- Protected routes via middleware
- Session management
- User profile

## 📝 Requirements Implemented

See `.github/prompts/Instruction1.prompt.md` for the complete requirements table covering:

- ✅ FR001-FR020: All functional requirements
- ✅ NFR001-NFR006: All non-functional requirements

## 🚧 Future Enhancements

- [ ] Push notifications for new services
- [ ] Admin dashboard for agents
- [ ] Service booking/registration
- [ ] Multi-language support (Nepali/English)
- [ ] Analytics dashboard
- [ ] User reviews and ratings

## 🤝 Contributing

This is a government healthcare initiative. For contribution guidelines, contact the project maintainers.

## 📄 License

Government of Nepal - Public Health Initiative

## 📞 Support

For technical issues or questions, contact the development team or refer to the documentation.

---

**Built with ❤️ for better healthcare access in Nepal**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
