import { PrismaClient } from '@prisma/client';

// PrismaClient är bifogad till den globala objektet i utvecklingsmiljön för att förhindra
// flera instanser av Prisma Client i utvecklingsmiljön
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

interface PrismaClientOptions {
  log?: any[];
  datasources?: {
    db: {
      url: string | undefined;
    };
  };
}

// Kontrollera om vi kör i Vercel eller annan produktionsmiljö
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

const prismaClientSingleton = () => {
  const options: PrismaClientOptions = {
    // Logga endast fel i produktionsmiljön, mer detaljerad loggning i utvecklingsmiljön
    log: isProduction ? ['error'] : ['query', 'error', 'warn'],
    // Använd connection pooling i produktionsmiljön
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  };

  return new PrismaClient(options);
};

// Skapa en anslutningshanterare för att hantera Prisma-anslutningar bättre
class PrismaConnectionManager {
  private static instance: PrismaConnectionManager;
  private client: PrismaClient;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.client = prismaClientSingleton();
  }

  public static getInstance(): PrismaConnectionManager {
    if (!PrismaConnectionManager.instance) {
      PrismaConnectionManager.instance = new PrismaConnectionManager();
    }
    return PrismaConnectionManager.instance;
  }

  public getClient(): PrismaClient {
    return this.client;
  }

  public async connect(): Promise<void> {
    if (!this.connectionPromise) {
      this.connectionPromise = this.client.$connect()
        .then(() => {
          console.log('DB connected successfully');
        })
        .catch((error) => {
          console.error('DB connection failed:', error);
          this.connectionPromise = null;
          // Försök igen efter 2 sekunder
          return new Promise((resolve) => {
            setTimeout(() => resolve(this.connect()), 2000);
          });
        });
    }
    return this.connectionPromise;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
      console.log('DB disconnected');
      this.connectionPromise = null;
    }
  }
}

// Använd singleton-mönstret för att säkerställa att vi bara har en instans av Prisma Client
const globalForPrisma = global as unknown as { prismaGlobal: PrismaClient | undefined };

// I utvecklingsmiljön, använd global singleton
// I produktionsmiljön, använd connection manager
let prismaInstance: PrismaClient;

if (isProduction) {
  // I produktionsmiljön, använd connection manager
  prismaInstance = PrismaConnectionManager.getInstance().getClient();
  console.log('Using production Prisma configuration');
} else {
  // I utvecklingsmiljön, använd global singleton
  prismaInstance = globalForPrisma.prismaGlobal ?? prismaClientSingleton();
  globalForPrisma.prismaGlobal = prismaInstance;
  console.log('Using development Prisma configuration');
}

// Exportera Prisma-klienten
const prisma = prismaInstance;
export default prisma;

// Exportera anslutningshanteraren för att användas i API-rutter
export const prismaManager = PrismaConnectionManager.getInstance();

// Hantera anslutningar bättre i produktionsmiljön
export async function connectToDB(): Promise<void> {
  if (isProduction) {
    return prismaManager.connect();
  } else {
    try {
      await prisma.$connect();
      console.log('DB connected successfully');
    } catch (error) {
      console.error('DB connection failed:', error);
      // Försök igen efter 5 sekunder
      setTimeout(connectToDB, 5000);
    }
  }
}

// Använd denna funktion för att stänga anslutningen när den inte längre behövs
export async function disconnectFromDB(): Promise<void> {
  if (isProduction) {
    return prismaManager.disconnect();
  } else {
    await prisma.$disconnect();
    console.log('DB disconnected');
  }
}
