FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start:prod"]
