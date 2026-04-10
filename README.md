# Done & Space Properties — Platform

A production-grade real estate operating system built for the Zambian market.

---

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS (Node.js) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Frontend | Next.js 14 (App Router) |
| Auth | JWT (access + refresh token rotation) |

---

## Setup

### 1. Create a new Supabase project

- Go to https://supabase.com and create a **new project**
- Copy your **Project URL** and **Service Role Key** (Settings > API)
- Run `database/schema.sql` in the Supabase SQL editor
- Create 3 storage buckets: `property-images`, `property-documents`, `agent-cvs` (set to public)

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
npm run start:dev
```

Backend runs on: http://localhost:3001
Swagger docs: http://localhost:3001/api/docs

### 3. Frontend

```bash
cd frontend
npm install
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local
npm run dev
```

Frontend runs on: http://localhost:3000

---

## Default login

```
Email:    admin@doneandspace.co.zm
Password: Admin@DSP2026
```

Change this immediately after first login.

---

## User roles

| Role | Access |
|---|---|
| `super_admin` | Full access, all branches |
| `admin` | Full access, own branch |
| `manager` | Approve listings, manage agents |
| `staff` | CRM, leads, listings (create/edit) |
| `agent` | Own leads + own listings only |
| `compliance` | Approvals + document verification |

---

## Key API routes

```
POST  /api/v1/auth/login
POST  /api/v1/auth/refresh
GET   /api/v1/auth/me

GET   /api/v1/properties              (public search)
POST  /api/v1/properties              (create listing)
PATCH /api/v1/properties/:id/submit   (submit for approval)
PATCH /api/v1/properties/:id/approve  (manager+)
PATCH /api/v1/properties/:id/publish  (manager+)

POST  /api/v1/leads/inquiry           (public inquiry capture)
GET   /api/v1/leads                   (CRM view)
POST  /api/v1/leads/:id/interact      (log call/note)

POST  /api/v1/deals
PATCH /api/v1/deals/:id/stage

GET   /api/v1/reports/dashboard
GET   /api/v1/reports/agents
```

---

## Phase 2 (next)

- Mandate management + expiry alerts
- Commission payout tracking
- Property maintenance work orders
- Branch management
- Tenant/landlord portal
- WhatsApp webhook integration
