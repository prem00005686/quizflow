# MCQ Learning Platform - Development Instructions

## Project Overview
Premium web-based MCQ learning platform for competitive exam students inspired by Duolingo and LeetCode. Phase 1 MVP focuses on auth, subscriptions, MCQ engine, tests, dashboard, streaks, heatmap, and device restriction.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Hosting:** Vercel (frontend) + Render (backend)

## Development Progress

- [x] Project Requirements Clarified
- [ ] Frontend scaffold created (React + Vite + Tailwind)
- [ ] Backend scaffold created (Express server)
- [ ] Database schema initialized
- [ ] Authentication setup (Supabase Auth)
- [ ] MCQ engine implemented
- [ ] Dashboard & streaks
- [ ] Device restriction & session management
- [ ] Subscription integration
- [ ] Testing & deployment

## Security Requirements
- JWT authentication with rotating refresh tokens
- Browser fingerprinting & device binding
- One active session per user (forced logout on new login)
- HTTP-only cookies
- Rate limiting
- Disabled right-click/copy-paste on MCQ pages
- Backend validation for all test actions

## Key Files
- `/frontend` - React + Vite application
- `/backend` - Express API server
- `/docs` - Architecture & database schema documentation

## Getting Started

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Database
Configure Supabase connection in `.env` files for both frontend and backend.

## Phase 1 Priorities
1. Auth (email + Google + OTP)
2. Subscriptions (Stripe integration)
3. MCQ engine with randomization
4. Timed tests with scoring
5. Dashboard with streaks & heatmap
6. Device/session restriction
7. Browser fingerprinting

---

Note: This is a living document that will be updated as development progresses.
