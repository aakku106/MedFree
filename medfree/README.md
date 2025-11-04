# MedFree - Free Government Medical Services Platform

A progressive web app connecting citizens with free government medical services in Nepal. Find nearby health camps, checkups, and medical services with full offline support.

## 🎯 Features

### Core Functionality

- **🗺️ Location-aware Discovery** - Automatic geolocation to find services near you
- **🔍 Smart Filtering** - Filter by category, diagnosis type, city, and search keywords
- **📱 Progressive Web App** - Install on any device, works offline
- **🔐 Secure Authentication** - Clerk-powered login with offline fallback
- **💾 Offline-First** - Access profile, saved services, and cached content without internet
- **📊 Admin Dashboard** - Full CRUD operations for health agents (FR021-FR027)
- **📝 Service Registration** - Users can register for services with QR code confirmation (FR028-FR031)
- **❤️ Saved Services** - Bookmark services for later review (FR036)
- **🔔 Push Notifications** - Get notified about new services and reminders (FR032-FR035)
- **📱 Responsive Design** - Seamless experience on mobile, tablet, and desktop

### Phase 1 Complete (FR001-FR020) ✅

All functional requirements from Instruction1.prompt.md have been implemented.

### Phase 2 Complete (FR021-FR041) ✅

- **Admin Dashboard** (FR021-FR027)
- **Service Registration System** (FR028-FR031)
- **Push Notifications** (FR032-FR035)
- **User Profile & Saved Services** (FR036-FR037)
- **PWA & Offline Support** (FR038-FR041)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or Atlas)
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aakku106/MedFree.git
   cd MedFree/medfree
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
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
   ```

   Create `.env.local` file:

   ```env
   MONGODB_URI=mongodb://localhost:27017/medfree
   CLERK_SECRET_KEY=sk_test_...
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```

4. **Seed sample data (optional)**

   ```bash
   cd medfree
   node scripts/seedDatabase.js
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
│   │   ├── services/           # Service CRUD endpoints
│   │   ├── profile/            # User profile endpoints
│   │   └── admin/              # Admin dashboard endpoints
│   ├── services/               # Services listing and detail pages
│   ├── profile/                # User profile, saved, registrations
│   ├── admin/                  # Admin dashboard
│   ├── about/                  # About page
│   ├── layout.js              # Root layout with providers
│   ├── page.js                # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── Navbar.jsx             # Navigation with offline auth
│   ├── OfflineAuthProvider.jsx  # Offline authentication context
│   ├── OfflineIndicator.jsx   # Offline status banner
│   ├── ServiceCard.jsx        # Service card component
│   ├── SavedServicesList.jsx  # Saved services display
│   ├── RegistrationCard.jsx   # Registration card
│   ├── NotificationManager.jsx # Push notification controls
│   ├── PWAProvider.jsx        # PWA install prompt
│   └── SmoothScroll.jsx       # Lenis smooth scroll
├── lib/
│   ├── mongodb.js             # MongoDB connection & utilities
│   ├── offline-auth.js        # Offline auth cache utilities
│   ├── admin-config.js        # Admin role configuration
│   └── utils.js               # Helper functions
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Service worker for offline
│   └── offline.html           # Offline fallback page
├── scripts/
│   └── seedDatabase.js        # Sample data generator
└── middleware.ts              # Auth & admin role middleware
```

## 🔑 Key Technologies

- **Next.js 16** - App Router, Server Components, Client Components, API Routes
- **React 19** - Latest features with concurrent rendering
- **MongoDB** - NoSQL database with geospatial queries
- **Clerk** - Authentication and user management
- **Offline-First Architecture** - localStorage + IndexedDB caching
- **Service Worker** - Workbox for offline functionality
- **PWA** - Installable web app with offline support
- **Push Notifications** - Web Push API for alerts
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
  category: String,              // 'General Health', 'Dental Care', etc.
  diagnosisType: String,         // 'Diabetes Screening', etc.
  whatItChecks: Array<String>,
  requirements: Array<String>,
  location: {
    type: 'Point',
    coordinates: [lon, lat]      // GeoJSON for geospatial queries
  },
  address: String,
  city: String,
  district: String,
  date: Date,
  dateNepali: String,            // Bikram Sambat format
  timeStart: String,
  timeEnd: String,
  capacity: Number,
  registeredCount: Number,       // Real-time capacity tracking
  contactPerson: String,
  contactPhone: String,
  contactEmail: String,
  images: Array<String>,         // Image URLs
  isActive: Boolean,             // Soft delete flag
  createdBy: String,             // Clerk user ID
  updatedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Registrations Collection

```javascript
{
  _id: ObjectId,
  serviceId: ObjectId,
  userId: String,                // Clerk user ID
  userName: String,
  userPhone: String,
  userEmail: String,
  registrationCode: String,      // QR code unique ID
  familyMembers: Array<String>,
  status: String,                // 'confirmed', 'cancelled', 'attended'
  registeredAt: Date,
  cancelledAt: Date,
  notificationsSent: {
    confirmation: Boolean,
    reminder: Boolean
  }
}
```

### Users Collection (Cached from Clerk)

```javascript
{
  _id: ObjectId,
  clerkId: String,
  savedServices: Array<ObjectId>,  // Bookmarked services
  preferences: {
    categories: Array<String>,
    notifications: {
      enabled: Boolean,
      types: Array<String>
    },
    location: {
      city: String,
      district: String
    }
  },
  pushSubscription: {
    endpoint: String,
    keys: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

````

## 🌐 API Endpoints

### Public Endpoints

#### GET /api/services
Query parameters:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 12)
- `q` - Search query (title/description)
- `category` - Filter by category
- `diagnosis` - Filter by diagnosis type
- `city` - Filter by city
- `district` - Filter by district
- `lat` & `lon` - User coordinates for proximity sorting

Response:
```json
{
  "services": [...],
  "total": 50,
  "page": 1,
  "limit": 12,
  "hasMore": true
}
````

#### GET /api/services/[id]

Returns detailed information for a single service.

### Protected Endpoints (Require Authentication)

#### POST /api/services/[id]/register

Register for a service. Decrements capacity and creates registration record.

#### DELETE /api/services/[id]/register

Cancel a registration. Increments capacity back.

#### GET /api/profile/registrations

Get all user registrations (upcoming and past).

#### GET /api/profile/saved

Get all user saved/bookmarked services.

#### POST /api/profile/saved

Add or remove a service from saved list.

#### POST /api/notifications/subscribe

Subscribe to push notifications with preferences.

#### PUT /api/notifications/preferences

Update notification preferences.

### Admin Endpoints (Require Admin Role)

#### GET /api/admin/services

Get all services (including inactive) with admin details.

#### POST /api/admin/services

Create a new service listing.

#### PUT /api/admin/services/[id]

Update an existing service.

#### DELETE /api/admin/services/[id]

Soft delete (deactivate) or permanently delete a service.

#### GET /api/admin/analytics

Get dashboard statistics (registrations, popular services, etc.).

## � Authentication & Authorization

### Clerk Integration

MedFree uses Clerk for authentication with custom offline fallback:

**Online Mode:**

- Standard Clerk authentication flow
- User data synced to localStorage cache
- Full access to all features

**Offline Mode:**

- Cached user data loaded from localStorage
- Profile pages accessible with 7-day cache
- Offline indicator shown throughout UI
- Auth state managed by `OfflineAuthProvider`

### Admin Roles

Admin access is controlled via Clerk user metadata:

```javascript
// In Clerk Dashboard, add custom metadata:
{
  role: "admin" | "agent" | "user";
}
```

Middleware checks role for `/admin/*` routes. Admin API endpoints verify role server-side.

### Offline Auth Architecture

```
User Signs In (Online)
    ↓
Clerk Authentication
    ↓
OfflineAuthProvider syncs user to localStorage
    ↓
User Data Cached (7-day expiration)
    ↓
[User Goes Offline]
    ↓
OfflineAuthProvider detects offline
    ↓
Loads cached user from localStorage
    ↓
Profile/Saved Services accessible offline
```

## 🎨 Design Principles

- **Mobile-first** - Optimized for mobile devices, works great on desktop
- **Accessibility** - WCAG 2.1 AA compliant, keyboard navigation, screen reader friendly
- **Performance** - Lazy loading, pagination, image optimization, <3s load time
- **Offline-First** - Core features work without internet connection
- **User-centric** - Clear CTAs, intuitive navigation, helpful error messages
- **Healthcare-focused** - Trustworthy emerald color palette, calming design
- **Progressive Enhancement** - Works on all browsers, enhanced on modern ones

## 📝 Requirements Status

### Phase 1 (Instruction1.prompt.md) - ✅ COMPLETE

- ✅ FR001-FR020: All functional requirements implemented
- ✅ NFR001-NFR006: All non-functional requirements met

### Phase 2 (Instruction2.prompt.md) - ✅ COMPLETE

- ✅ FR021-FR027: Admin Dashboard with full CRUD
- ✅ FR028-FR031: Service Registration System with QR codes
- ✅ FR032-FR035: Push Notifications (setup complete, VAPID required)
- ✅ FR036-FR037: User Profile, Saved Services, Settings
- ✅ FR038-FR041: PWA with offline support, Service Worker
- ⏳ FR042-FR045: Testing suite (planned for Phase 3)

## 🚧 Planned Enhancements (Phase 3)

- [ ] Automated testing suite (Unit, E2E, Accessibility)
- [ ] Performance monitoring with Sentry
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Nepali/English)
- [ ] User reviews and ratings system
- [ ] SMS notifications alongside push
- [ ] Payment integration for paid services (future)
- [ ] Integration with government health databases

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please ensure:

- Code follows existing style conventions
- All tests pass (when test suite is implemented)
- Documentation is updated
- Commit messages are descriptive

## 📄 License

This project is open-source for public health initiatives. Feel free to use and adapt for similar healthcare access projects.

## 📞 Support & Contact

- **Developer:** [@aakku106](https://github.com/aakku106)
- **Repository:** [github.com/aakku106/MedFree](https://github.com/aakku106/MedFree)
- **Issues:** [Report bugs or request features](https://github.com/aakku106/MedFree/issues)

For technical questions, refer to:

- `/Research/OFFLINE_AUTH_IMPLEMENTATION.md` - Detailed offline auth guide
- `/Research/OFFLINE_AUTH_COMPLETE.md` - Implementation summary
- `.github/prompts/` - Full requirements documentation

---

### Built with ❤️ for better healthcare access in Nepal 🇳🇵

**Hackathon Project:** Originally built for a healthcare hackathon challenge to improve medical service discovery and accessibility in Nepal.

**Current Status:** Production-ready with full offline support and PWA capabilities.
