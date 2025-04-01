import { PrismaClient } from '@prisma/client';

// PrismaClient är bifogad till den globala objektet i utvecklingsmiljön för att förhindra
// flera instanser av Prisma Client i utvecklingsmiljön
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Använd connection pooling i produktionsmiljön
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const globalPrisma = global as unknown as { prisma?: PrismaClient };
const prisma = globalPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalPrisma.prisma = prisma;

// Hantera anslutningar bättre i produktionsmiljön
export async function connectToDB() {
  try {
    await prisma.$connect();
    console.log('DB connected successfully');
  } catch (error) {
    console.error('DB connection failed:', error);
    // Försök igen efter 5 sekunder
    setTimeout(connectToDB, 5000);
  }
}

// Använd denna funktion för att stänga anslutningen när den inte längre behövs
export async function disconnectFromDB() {
  await prisma.$disconnect();
  console.log('DB disconnected');
}
