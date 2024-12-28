import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:LaVzarpyWoOBiRykBmgnpmHXpwxxyfDl@junction.proxy.rlwy.net:10109/railway'
      }
    },
    log: ['query', 'error', 'warn']
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;