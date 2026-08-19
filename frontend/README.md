# Task Manager Frontend

Next.js App Router frontend for the task management assessment.

## Setup

```bash
pnpm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`. The backend must be running and reachable at `NEXT_PUBLIC_API_URL`.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Routes

- `/login` - login and guest login
- `/dashboard` - task board
- `/tasks` - task list
- `/projects` - project list
- `/projects/:id` - project details
- `/tasks/:id` - task details
- `/profile` - profile and theme settings
