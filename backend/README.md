# Task Manager Backend

NestJS API and Prisma data layer for the task management assessment.

## Setup

```bash
pnpm install
```

Create `.env` from `.env.example`:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager
JWT_SECRET=replace-with-a-long-random-value
```

Apply migrations and seed the database:

```bash
pnpm prisma migrate deploy
pnpm db:seed
```

## Scripts

```bash
pnpm start:dev
pnpm build
pnpm start:prod
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:cov
```

The API is served under `/api`. The health endpoint is `GET /api/health`.

## API Areas

- `POST /api/auth/login`
- `POST /api/auth/guest`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `/api/users`
- `/api/projects`
- `/api/tasks`
- `/api/tasks/:id/subtasks`
- `/api/tasks/:id/comments`

Protected routes require the HTTP-only `access_token` cookie created by the auth endpoints.
