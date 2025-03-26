import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  console.log('Initializing Prisma client with DATABASE_URL:', process.env.DATABASE_URL);
  return new PrismaClient({
    log: ['query', 'error', 'warn', 'info'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 