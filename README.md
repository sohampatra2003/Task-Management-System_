# Task Management System – Full-Stack (Track A)

A complete Task Management System built with **Node.js + TypeScript** (backend) and **Next.js 14 + TypeScript** (frontend).

---

## Project Structure

```
task-management/
├── backend/          # Node.js + Express + Prisma API
└── frontend/         # Next.js 14 App Router
```

---

## Backend Setup

### Prerequisites
- Node.js 18+

### Installation

```bash
cd backend
npm install

cp .env.example .env

npx prisma generate
npx prisma migrate dev --name init

# Start dev server (http://localhost:4000)
npm run dev
```

### API Endpoints

#### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns access + refresh tokens |
| POST | `/auth/refresh` | Rotate refresh token, get new access token |
| POST | `/auth/logout` | Revoke refresh token |

#### Tasks (all require `Authorization: Bearer <token>`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/tasks` | List tasks (pagination, filter, search) |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| PATCH | `/tasks/:id/toggle` | Toggle PENDING ↔ COMPLETED |

#### GET /tasks query params
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `status` – PENDING | IN_PROGRESS | COMPLETED
- `priority` – LOW | MEDIUM | HIGH
- `search` – search by title

### Architecture

```
src/
├── index.ts              # Entry point
├── app.ts                # Express setup, middleware, routes
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── jwt.ts            # Token generation & verification
│   └── validators.ts     # Zod schemas
├── middleware/
│   ├── auth.middleware.ts    # JWT authentication guard
│   ├── error.middleware.ts   # Global error handler
│   └── validate.middleware.ts
├── controllers/
│   ├── auth.controller.ts
│   └── task.controller.ts
└── routes/
    ├── auth.routes.ts
    └── task.routes.ts
```

### Key Technical Decisions
- **JWT access tokens** (15 min) + **refresh tokens** (7 days) with rotation on every refresh
- **bcryptjs** with salt rounds 12 for password hashing
- **Prisma ORM** with SQLite (easily swapped for Postgres via `DATABASE_URL`)
- **Zod** for runtime validation on all inputs
- Standard HTTP status codes: 400 (validation), 401 (auth), 404 (not found), 409 (conflict), 500 (server error)

---

## Frontend Setup

### Prerequisites
- Node.js 18+

### Installation

```bash
cd frontend
npm install

# API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# Dev server starting (http://localhost:3000)
npm run dev
```

### Features
- **Login & Register** pages with react-hook-form + Zod validation
- **Auth guard** — redirects to /login if no valid token
- **Auto token refresh** — Axios interceptor silently refreshes expired access tokens
- **Dashboard** with live search (debounced 400ms), status filter tabs, priority filter
- **Pagination** with server-side page controls
- **Task CRUD** — create, edit, delete via modal form
- **Toggle** task status with a single click
- **Toast notifications** for all operations
- **Responsive** — works on mobile and desktop
- **Overdue detection** — due date shown in red if past and not completed

### Architecture

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx      # Centered auth shell
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx      # Navbar + auth guard
│   │   └── dashboard/page.tsx
│   └── layout.tsx          # Root layout + Toaster
├── components/
│   ├── TaskCard.tsx        # Single task row with actions
│   └── TaskModal.tsx       # Create / edit form modal
├── context/
│   └── AuthContext.tsx     # Auth state + login/logout helpers
└── lib/
    └── api.ts              # Axios instance, token storage, API helpers
```

---

## Running Both Together

```bash
# First Terminal Started
cd backend && npm run dev

# Second Terminal Started
cd frontend && npm run dev
```

Then open **http://localhost:4000**.

---

## Switching to PostgreSQL (Production)

1. Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in `.env` to your Postgres connection string
3. Run `npx prisma migrate dev`
