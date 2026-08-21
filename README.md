# Task Manager

A full-stack task management application built for the AbleSpace technical assessment. The application provides authenticated task and project CRUD, task members, subtasks, comments, profile settings, and theme preferences.

## Assessment Links

- [Figma reference screenshots](Screenshots.png)
- [Part 2 AbleSpace workflow notes](docs/part-2-able-space.md)

## Tech Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, Prisma
- Database: PostgreSQL
- Package manager: pnpm
- Authentication: JWT stored in an HTTP-only cookie

## Current Features

- Guest login and username/email login
- Protected dashboard, task, project, and profile routes
- Task board and list views
- Task, project, subtask, and comment CRUD
- Task status, priority, due date, reporter, project, and members
- Profile editing and persisted light/dark theme and color preferences
- DTO validation and backend resource authorization
- Prisma migrations and seed script

## Project Structure

```text
frontend/  Next.js application
backend/   NestJS API and Prisma database layer
docs/      Submission and product-understanding notes
```

## Local Setup

### Prerequisites

- Node.js 20 or newer
- pnpm 11 or newer
- PostgreSQL 14 or newer

### Backend

```bash
cd backend
pnpm install
```

Create `backend/.env` from `backend/.env.example`:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager
JWT_SECRET=replace-with-a-long-random-value
```

Create the database, apply migrations, seed demo users, and start the API:

```bash
pnpm prisma migrate deploy
pnpm db:seed
pnpm start:dev
```

The API runs at `http://localhost:4000/api`. Health check: `http://localhost:4000/api/health`.

### Frontend

In a second terminal:

```bash
cd frontend
pnpm install
```

Create `frontend/.env.local` from `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the frontend:

```bash
pnpm dev
```

Open `http://localhost:3000` and choose **Continue as guest** to try the application.

## Demo Accounts

The seed script creates these accounts:

| Account | Identifier | Password |
| --- | --- | --- |
| Guest | `guest@example.com` or `guest` | `guest-password` |
| Demo | `demo@example.com` or `demo` | `demo-password` |

Change these values before deploying a public environment.

## Validation Commands

Run these before submitting:

```bash
cd frontend
pnpm lint
pnpm build

cd ../backend
pnpm lint
pnpm build
pnpm test
pnpm test:e2e
```

## Deployment

The deployment URLs are intentionally left for the owner to fill in after deployment:

- Frontend: `TODO: add deployed frontend URL`
- Backend: `https://task-management-o6yk.onrender.com`
- Health check: `https://task-management-o6yk.onrender.com/api/health`

For production, set `NEXT_PUBLIC_API_URL` to the deployed API URL ending in `/api`, set `FRONTEND_URL` to the deployed frontend origin, set a strong `JWT_SECRET`, and provide a hosted PostgreSQL `DATABASE_URL`. Run `pnpm prisma migrate deploy` during the backend release process.

## Known Deviations and Remaining Work

- The implementation is a functional prototype and is not a pixel-perfect reproduction of every Figma screen.
- Some secondary controls shown in the reference, such as advanced filtering, notifications, and workspace actions, remain limited or visual.
- The Part 2 workflow evidence still needs screenshots captured from AbleSpace or a recorded walkthrough; see [docs/part-2-able-space.md](docs/part-2-able-space.md).

## Submission Checklist

- [ ] Replace the three deployment placeholders above.
- [ ] Capture desktop, tablet, and mobile screenshots of the running app.
- [ ] Complete the Part 2 screenshots or video walkthrough.
- [ ] Run the validation commands against the final deployed configuration.
- [ ] Confirm the public repository and both deployments remain accessible for at least 45 days.
