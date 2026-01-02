# ParentHub Development Plan
> Local directory for parents to discover baby/child service providers

## Project Overview

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- PostgreSQL + Prisma
- Tailwind CSS
- Google Maps SDK
- NextAuth.js

**Project Location:** `parenthub/`

---

## ✅ STAGE 1: PROJECT FOUNDATION (COMPLETED)

### Step 1.1 - Initialize Project ✅
- [x] Created Next.js 14 project with TypeScript
- [x] Configured Tailwind CSS
- [x] Installed all dependencies (prisma, next-auth, google-maps, etc.)
- [x] Setup ESLint

### Step 1.2 - Folder Structure ✅
```
parenthub/
├── app/
│   ├── (public)/           # Home, Search, Category, Provider, Map
│   ├── (auth)/             # Login, Signup, Verify
│   ├── (user)/             # Favorites, Profile
│   ├── (provider)/         # Dashboard, Edit, Insights, Settings
│   ├── (admin)/            # All admin pages
│   └── api/                # 24 API routes
├── components/
│   ├── ui/                 # Button, Input, Card, Modal, Sheet
│   ├── common/             # ProviderCard, CategoryTile, StarRating, etc.
│   ├── discovery/          # SearchBar, FilterSheet, GoogleMap, etc.
│   ├── provider/           # ContactCTAs, PhotoGallery, ScheduleDisplay
│   └── admin/              # DataTable, Sidebar
├── lib/
│   ├── db/                 # Prisma client & queries
│   ├── auth/               # NextAuth config & session helpers
│   ├── analytics/          # Event tracker
│   ├── maps/               # Google Maps utilities
│   ├── utils/              # cn, format functions
│   └── validations/        # Zod schemas
├── prisma/
│   ├── schema.prisma       # Complete database schema
│   └── seed.ts             # Seed script with categories
├── types/                  # TypeScript types
├── hooks/                  # useLocation, useAnalytics, useFavorites
├── contexts/               # LocationContext
└── constants/              # Categories, languages, etc.
```

### Step 1.3 - Configuration Files ✅
- [x] next.config.ts (security headers, image config)
- [x] .env.example (all environment variables)
- [x] package.json (with db scripts)
- [x] tsconfig.json

### Step 1.4 - All Placeholder Files Created ✅
**97 TypeScript files created**, each with detailed header comments explaining:
- Purpose of the file
- Features to implement
- Props/API specification
- Dependencies

---

## ✅ STAGE 2: DATABASE SCHEMA (COMPLETED)

### Step 2.1 - Prisma Schema Models ✅
- [x] User (parents, providers, admins with roles)
- [x] Account, Session, VerificationToken (NextAuth)
- [x] Provider (full listing with all fields)
- [x] Category (hierarchical with parent/children)
- [x] Review (with moderation workflow)
- [x] Favorite (user saved providers)
- [x] AnalyticsEvent (event tracking)
- [x] ClickLedger (monetization tracking)
- [x] OTP (phone verification)
- [x] ImportLog (bulk import tracking)

### Step 2.2 - Database Utilities ✅
- [x] Prisma client singleton
- [x] Query functions template

### Step 2.3 - Seed Data ✅
- [x] 15 default categories with Hebrew names
- [x] Seed script ready to run

---

## 📋 STAGE 3: CORE API LAYER (NEXT)

### Step 3.1 - Authentication API
- [ ] POST /api/auth/signup
- [ ] POST /api/auth/login
- [ ] POST /api/auth/verify-otp
- [ ] GET /api/auth/session

### Step 3.2 - Categories API
- [ ] GET /api/categories
- [ ] GET /api/categories/[slug]

### Step 3.3 - Providers API (Public)
- [ ] GET /api/providers
- [ ] GET /api/providers/[id]
- [ ] GET /api/providers/nearby

### Step 3.4 - Search API
- [ ] GET /api/search
- [ ] GET /api/search/suggestions

### Step 3.5 - Reviews API
- [ ] GET /api/reviews/[providerId]
- [ ] POST /api/reviews

### Step 3.6 - Analytics API
- [ ] POST /api/analytics/event

### Step 3.7 - Provider Management API
- [ ] GET /api/provider/me
- [ ] PUT /api/provider/me
- [ ] POST /api/provider/me/photos
- [ ] GET /api/provider/me/insights

### Step 3.8 - Admin API
- [ ] CRUD /api/admin/providers
- [ ] CRUD /api/admin/categories
- [ ] GET /api/admin/reviews/pending
- [ ] POST /api/admin/import
- [ ] GET /api/admin/analytics

---

## 📋 STAGE 4: USER (PARENT) EXPERIENCE

### Step 4.1 - Core UI Components
- [ ] Complete Button, Input, Card, Modal, Sheet
- [ ] CategoryTile, ProviderCard
- [ ] SearchBar, FilterSheet
- [ ] StarRating, PriceBand, DistanceBadge

### Step 4.2 - Home Page
- [ ] Hero, Search, Category grid
- [ ] Location permission

### Step 4.3 - Search & Results
- [ ] Search page, filters, results list
- [ ] Sort, pagination

### Step 4.4 - Map View
- [ ] Google Maps, clusters, info windows
- [ ] Search this area

### Step 4.5 - Provider Profile
- [ ] Photos, bio, services, schedule
- [ ] Reviews, contact CTAs

### Step 4.6 - Contact Actions
- [ ] Call, WhatsApp, Navigate buttons
- [ ] Analytics tracking

### Step 4.7 - User Auth
- [ ] Login, Signup, OTP

### Step 4.8 - User Features
- [ ] Favorites, profile

---

## 📋 STAGE 5: PROVIDER PORTAL

### Step 5.1 - Provider Onboarding
- [ ] Multi-step signup form
- [ ] Verification flow

### Step 5.2 - Provider Dashboard
- [ ] Stats, availability toggle

### Step 5.3 - Profile Editor
- [ ] Photos, description, categories
- [ ] Schedule, service area

### Step 5.4 - Insights
- [ ] Views, clicks, leads charts

### Step 5.5 - Settings
- [ ] Account, notifications

---

## 📋 STAGE 6: ADMIN BACK-OFFICE

### Step 6.1 - Admin Layout
- [ ] Sidebar, header, auth

### Step 6.2 - Dashboard
- [ ] Metrics, activity, alerts

### Step 6.3 - Provider Management
- [ ] Table, approve/reject, edit

### Step 6.4 - Category Management
- [ ] CRUD, reorder

### Step 6.5 - Review Moderation
- [ ] Queue, approve/reject

### Step 6.6 - User Management
- [ ] Table, roles

### Step 6.7 - Bulk Import
- [ ] CSV upload, mapping

### Step 6.8 - Analytics Dashboards
- [ ] Search, provider, geo analytics

---

## 📋 STAGE 7: POLISH & LAUNCH

### Step 7.1 - Analytics Implementation
- [ ] Event tracking hook
- [ ] Auto page views

### Step 7.2 - RTL & i18n
- [ ] Hebrew translations
- [ ] RTL layout

### Step 7.3 - PWA
- [ ] Manifest, service worker

### Step 7.4 - Performance
- [ ] Caching, optimization

### Step 7.5 - Testing
- [ ] E2E flows

---

## Quick Start Commands

```bash
# Navigate to project
cd parenthub

# Install dependencies (already done)
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL and API keys

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

---

## File Summary

| Category | Count | Description |
|----------|-------|-------------|
| Pages | 20 | All route pages with layouts |
| API Routes | 24 | All endpoint handlers |
| Components | 18 | UI, common, discovery, provider, admin |
| Lib | 10 | Database, auth, analytics, maps, utils |
| Other | 7 | Types, hooks, contexts, constants |
| Config | 5 | next.config, package.json, .env, tsconfig, prisma |
| **Total** | **97** | **TypeScript files** |

---

## Current Status

**✅ COMPLETED:** Stage 1 (Foundation) + Stage 2 (Database)
**🔄 NEXT:** Stage 3 (API Layer)
**📅 Last Updated:** Foundation complete, ready for API implementation
