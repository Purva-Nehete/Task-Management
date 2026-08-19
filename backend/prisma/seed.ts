import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const guestPasswordHash = await bcrypt.hash('guest-password', 12);
  const demoPasswordHash = await bcrypt.hash('demo-password', 12);

  await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {
      name: 'Guest User',
      username: 'guest',
      passwordHash: guestPasswordHash,
      isGuest: true,
    },
    create: {
      name: 'Guest User',
      email: 'guest@example.com',
      username: 'guest',
      passwordHash: guestPasswordHash,
      isGuest: true,
      title: 'Guest',
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {
      name: 'Demo User',
      username: 'demo',
      passwordHash: demoPasswordHash,
      isGuest: false,
    },
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      username: 'demo',
      passwordHash: demoPasswordHash,
      isGuest: false,
      title: 'Project Manager',
    },
  });

  console.log('Seeded guest@example.com and demo@example.com');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
