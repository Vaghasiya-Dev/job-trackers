# Job Tracker (Job Journey)

Job Tracker is a Next.js application for managing your job search pipeline from one place.
It combines authentication, a board/table workflow, analytics, and persistent snapshots so users can track progress across sessions.

## Features

- User signup, login, logout, and session validation
- Dashboard view with key job-search insights
- Job board and table-based tracking workflow
- Analytics views for job search trends
- Snapshot persistence tied to authenticated users
- Responsive UI with reusable component architecture

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand for client state management
- Prisma ORM with MongoDB
- bcryptjs for password hashing

## Project Structure

```text
src/
	app/
		api/                 # Route handlers (auth, health, snapshots)
		dashboard/           # Protected dashboard route
		login/               # Login page
		signup/              # Signup page
		page.tsx             # App shell entry
	components/
		auth/                # Auth forms
		job-journey/         # Domain UI (dashboard, board, analytics, etc.)
		ui/                  # Shared UI primitives
	hooks/                 # Reusable hooks
	lib/
		db.ts                # Prisma singleton client
	store/                 # Zustand stores

prisma/
	schema.prisma          # Data model and datasource
```

## Prerequisites

- Node.js 20.x
- npm or Bun
- MongoDB database (Atlas or self-hosted)

## Environment Variables

Create a `.env` file in the repository root:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
```

## Getting Started

Install dependencies and run development server.

### npm

```bash
npm install
npm run dev
```

### Bun

```bash
bun install
bun run dev
```

Application runs on `http://localhost:3000`.

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Generate Prisma client and build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run development migrations
- `npm run db:reset` - Reset database through Prisma

## Application Routes

- `/` - Main app shell
- `/dashboard` - Auth-protected dashboard
- `/login` - Login page
- `/signup` - Signup page

## API Routes

- `GET /api`
	Returns a simple JSON message.

- `POST /api/auth/signup`
	Creates a user, hashes password, sets `userId` cookie.

- `POST /api/auth/login`
	Validates credentials, sets `userId` cookie.

- `POST /api/auth/logout`
	Clears `userId` cookie.

- `GET /api/auth/check`
	Validates authenticated user from cookie.

- `GET /api/jobs/snapshot`
	Returns saved snapshot state for current user.

- `PUT /api/jobs/snapshot`
	Upserts snapshot state for current user.

- `GET /api/health/db`
	Runs DB ping and returns health result.

## Data Model

Defined in `prisma/schema.prisma`.

- `User`
	Authentication identity with email, name, and hashed password.

- `Post`
	Stores serialized snapshot payloads. Snapshot entries are keyed by:
	- `authorId`: user id
	- `title`: `__job_snapshot__`

## Authentication Notes

- Session identity is stored in an HTTP-only `userId` cookie.
- Cookie uses secure mode in production.
- Session check endpoint is used to gate protected routes.

## Database Notes

- Prisma client is initialized via a singleton in `src/lib/db.ts`.
- Query logging is enabled in development.
- Health endpoint returns:
	- `200` when ping succeeds
	- `503` on connection issues
	- `500` when `DATABASE_URL` is missing

## Deployment Notes

- Build command: `npm run build`
- Start command: `npm run start`
- Ensure `DATABASE_URL` is configured in deployment environment.

## Development Workflow

1. Configure `.env` with MongoDB URL.
2. Install dependencies.
3. Run `npm run dev`.
4. Use `npm run lint` before pushing changes.
5. Update Prisma schema and run `npm run db:generate` when schema changes.

## Status

The previous scaffold-oriented README has been replaced with project-specific documentation for this repository.
