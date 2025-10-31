# MedFree Setup & Deployment Guide

## 📦 Dependencies to Install

Run this command in the medfree directory:

```bash
npm install lenis mongodb @clerk/nextjs nepali-date-converter
```

**What each does:**

- `lenis` - Smooth scrolling library (already implemented in SmoothScroll.jsx)
- `mongodb` - MongoDB Node.js driver for database operations
- `@clerk/nextjs` - Authentication (already configured in middleware)
- `nepali-date-converter` - Convert AD to BS dates (used in utils.js)

## 🔧 Environment Setup

### 1. Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Get your API keys from the dashboard

Add to `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add to `.env.local`:

```env
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxx
```

### 2. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or download from mongodb.com

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Recommended)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string

Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medfree?retryWrites=true&w=majority
```

## 🗃️ Database Setup

### Seed Sample Data

```bash
cd medfree
node scripts/seedSampleData.js
```

This will:

- Create the `medfree` database
- Insert 5 sample services (Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar)
- Create necessary indexes (2dsphere for location, text search, etc.)

### Manual Data Entry

You can also use MongoDB Compass or the shell to add services manually. Follow the schema in `lib/mongodb.js`.

## 🚀 Running the App

```bash
cd medfree
npm run dev
```

Visit: http://localhost:3000

## 📱 Testing Features

### 1. Landing Page

- Visit root `/`
- Should see hero with "Find Free Services" button
- No navbar (by design)

### 2. Services Page

- Click CTA or visit `/services`
- Browser will prompt for location permission
- **Allow location**: Services sorted by proximity
- **Deny location**: All services shown alphabetically
- Test filters: category, diagnosis, search

### 3. Service Detail

- Click any service card
- Should see full details, logistics box, contact info
- Back button returns to services

### 4. About Page

- Visit `/about` from navbar
- Should see mission, problem, how it works sections

### 5. Authentication

- Click "User Login" in navbar
- Clerk modal should appear
- Sign up or sign in
- User button should replace login button

## 🔍 Testing Location Features

**Test with allowed location:**

1. Visit `/services`
2. Click "Allow" on location prompt
3. Services should show distance (e.g., "2.3km away")
4. Nearest services appear first

**Test with denied location:**

1. Visit `/services` in incognito or clear site data
2. Click "Block" on location prompt
3. Blue banner appears: "Showing services from all over Nepal"
4. Services sorted alphabetically

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
brew services list  # macOS
# or
sudo systemctl status mongod  # Linux

# Test connection
mongo  # or mongosh for newer versions
```

### Clerk Issues

- Verify environment variables are set
- Check Clerk dashboard for API key status
- Ensure middleware.ts is properly configured

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Admin Features (Future)

Currently, services are added via:

1. Database scripts (seedSampleData.js)
2. Direct MongoDB access (Compass/Shell)
3. API calls (for agents with auth)

Admin dashboard coming soon!

## 🌐 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `MONGODB_URI`
   - `NEXT_PUBLIC_APP_URL`

5. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

## ✅ Checklist

Before going live:

- [ ] Install all dependencies
- [ ] Set up Clerk authentication
- [ ] Configure MongoDB (Atlas recommended)
- [ ] Seed sample or real data
- [ ] Test location permission flow
- [ ] Test all filters and search
- [ ] Verify mobile responsiveness
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Set up production environment variables
- [ ] Deploy to Vercel or similar platform

## 📞 Support

For issues or questions:

- Check Next.js docs: https://nextjs.org/docs
- Check Clerk docs: https://clerk.com/docs
- Check MongoDB docs: https://docs.mongodb.com

---

**Happy building! 🚀**
