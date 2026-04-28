# SmartSeason Field Monitoring System

A full-stack web application for tracking crop progress across multiple fields during a growing season. Built as a technical assessment for Shamba Records.

## Live Demo

- **Frontend:** https://smartseason-web.vercel.app/
- **Backend API:** https://smartseason-api-zc36.onrender.com

## Demo Credentials

| Role  | Email                     | Password  |
|-------|---------------------------|-----------|
| Admin | admin@smartseason.com     | admin123  |
| Agent | agent@smartseason.com     | agent123  |

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Monorepo   | Turborepo + pnpm workspaces                             |
| Backend    | Node.js + Express + TypeScript                          |
| Frontend   | Next.js 15 + Tailwind CSS                               |
| Database   | PostgreSQL (Docker locally, Neon in production)         |
| ORM        | Prisma                                                  |
| Auth       | JWT (jsonwebtoken + bcryptjs)                           |

---

## Project Structure

```bash
smartseason/
├── apps/
│   ├── api/                    # Node.js + Express backend
│   │   ├── src/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── middleware/     # Auth, role checks
│   │   │   ├── routes/         # API route definitions
│   │   │   ├── services/       # Business logic
│   │   │   └── index.ts        # Entry point
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── seed.ts         # Demo data
│   └── web/                    # Next.js frontend
│       ├── app/
│       │   ├── admin/          # Admin pages
│       │   ├── agent/          # Agent pages
│       │   └── auth/           # Login page
│       ├── components/
│       │   └── ui/             # Reusable components
│       └── lib/                # API calls, auth helpers
├── packages/
│   └── shared/                 # Shared TypeScript types
├── docker-compose.yml          # Local PostgreSQL + pgAdmin
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- pnpm
- Docker

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd smartseason
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the database

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port `5432`
- pgAdmin on port `5050` → http://localhost:5050

### 4. Set up environment variables

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://smartseason:smartseason123@localhost:5432/smartseason"
JWT_SECRET="smartseason-secret-key-change-in-production"
PORT=4000
```

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 5. Run database migrations and seed

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

### 6. Start the development servers

**Terminal 1 — Backend:**

```bash
cd apps/api
pnpm dev
```

**Terminal 2 — Frontend:**

```bash
cd apps/web
pnpm dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## API Routes

### Auth

| Method | Route                | Access | Description   |
|--------|----------------------|--------|---------------|
| POST   | /api/auth/register   | Public | Register user |
| POST   | /api/auth/login      | Public | Login         |

### Fields

| Method | Route                              | Access | Description          |
|--------|------------------------------------|--------|----------------------|
| GET    | /api/fields/dashboard              | Both   | Dashboard summary    |
| POST   | /api/fields/createfield            | Admin  | Create field         |
| GET    | /api/fields/getallfields           | Admin  | Get all fields       |
| PUT    | /api/fields/updateallfields/:id    | Admin  | Update field details |
| POST   | /api/fields/:id/assign             | Admin  | Assign agent         |
| GET    | /api/fields/my-fields              | Agent  | Get assigned fields  |
| POST   | /api/fields/:id/update             | Agent  | Update stage + notes |
| GET    | /api/fields/getfield/:id           | Both   | Get single field     |

### Users

| Method | Route              | Access | Description     |
|--------|--------------------|--------|-----------------|
| GET    | /api/users/agents  | Admin  | Get all agents  |
| GET    | /api/users/:id     | Both   | Get user by ID  |

---

## Design Decisions

### 1. Monorepo with Turborepo

Used Turborepo to manage both apps in a single repository. This allows shared TypeScript types between frontend and backend, and running both apps with a single command.

### 2. PostgreSQL over MySQL

PostgreSQL was chosen for its stronger data integrity, better support for complex queries, and cleaner integration with Prisma ORM.

### 3. Next.js over plain React

Next.js provides server-side rendering for faster dashboard loads, built-in file-based routing, and a better developer experience for a data-heavy application.

### 4. Field Status Logic

Each field has a computed status based on these rules:

- **COMPLETED** → stage is `HARVESTED`
- **AT_RISK** → today's date is past the `expectedHarvestDate` and not yet harvested
- **ACTIVE** → everything else

This approach was chosen over fixed day thresholds because different crops have vastly different growing cycles. Maize takes 90 days, coffee takes 3+ years. A fixed threshold would incorrectly mark healthy fields as AT_RISK.

By letting the admin set an `expectedHarvestDate` when creating a field, the system respects the actual growing cycle of each crop. The status is always computed automatically — never set manually.

### 5. Role-Based Access Control

Two roles: `ADMIN` and `AGENT`.

- Admins can create fields, assign agents, and monitor all fields
- Agents can only see their assigned fields and update stage + notes
- JWT tokens carry the user's role, enforced at both middleware and service level

### 6. Audit Trail

Every stage update creates a `FieldUpdate` record with the agent, stage, notes and timestamp. This gives coordinators full visibility into what happened on every field over time.

---

## Assumptions Made

- An admin is created via the seed script — there is no public registration for admins
- A field can exist without an assigned agent (unassigned state)
- The `expectedHarvestDate` is set by the admin who knows the crop cycle
- Notes are optional when updating a field stage
- Agents can only update fields assigned to them
