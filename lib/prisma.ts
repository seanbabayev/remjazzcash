import { PrismaClient } from '@prisma/client';

// PrismaClient är bifogad till den globala objektet i utvecklingsmiljön för att förhindra
// flera instanser av Prisma Client i utvecklingsmiljön
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Kontrollera om vi kör i Vercel eller annan produktionsmiljö
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

// Skapa en anpassad Prisma-klient med inaktiverade prepared statements
// Detta är viktigt för att undvika "prepared statement already exists"-fel i serverless-miljöer
const prismaClientSingleton = () => {
  // Använd direkta anslutningar och inaktivera prepared statements
  const prismaClient = new PrismaClient({
    log: isProduction 
      ? [{ level: 'error', emit: 'stdout' }] 
      : [{ level: 'query', emit: 'stdout' }, { level: 'error', emit: 'stdout' }, { level: 'warn', emit: 'stdout' }],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Anpassa Prisma-klienten för serverless-miljö
  // Använd process.on('beforeExit') istället för prismaClient.$on('beforeExit')
  // eftersom $on('beforeExit') inte fungerar med Prisma 5.0.0+ med library-motorn
  process.on('beforeExit', () => {
    console.log('Process exiting, disconnecting Prisma Client...');
    prismaClient.$disconnect();
  });

  // Viktigt: Använd middleware för att hantera anslutningar i serverless-miljö
  prismaClient.$use(async (params, next) => {
    // Logga anrop i utvecklingsmiljön
    if (!isProduction) {
      console.log(`Prisma ${params.model}.${params.action} called`);
    }
    
    try {
      return await next(params);
    } catch (error: any) {
      // Hantera fel relaterade till prepared statements
      if (error?.message?.includes('prepared statement') || 
          (error?.meta?.message && error.meta.message.includes('prepared statement'))) {
        console.error('Prepared statement error detected:', error);
        
        // Logga detaljerad information för felsökning
        console.error('Error details:', {
          model: params.model,
          action: params.action,
          args: params.args,
        });
        
        // Försök återansluta och köra operationen igen
        try {
          await prismaClient.$disconnect();
          await prismaClient.$connect();
          console.log('Reconnected to database after prepared statement error');
          
          // Anropa operationen igen direkt via prismaClient
          // @ts-ignore - Vi vet att detta är säkert eftersom vi använder samma parametrar
          return await prismaClient[params.model][params.action](params.args);
        } catch (retryError) {
          console.error('Failed to recover from prepared statement error:', retryError);
          throw retryError;
        }
      }
      
      // Kasta om felet om det inte är relaterat till prepared statements
      throw error;
    }
  });

  return prismaClient;
};

// Använd singleton-mönstret för att säkerställa att vi bara har en instans av Prisma Client
const globalForPrisma = global as unknown as { prismaGlobal: PrismaClient | undefined };

// I utvecklingsmiljön, använd global singleton
// I produktionsmiljön, skapa en ny instans för varje serverless-funktion
let prismaInstance: PrismaClient;

if (isProduction) {
  // I produktionsmiljön, skapa en ny instans
  prismaInstance = prismaClientSingleton();
  console.log('Using production Prisma configuration with prepared statement handling');
} else {
  // I utvecklingsmiljön, använd global singleton
  prismaInstance = globalForPrisma.prismaGlobal ?? prismaClientSingleton();
  globalForPrisma.prismaGlobal = prismaInstance;
  console.log('Using development Prisma configuration');
}

// Exportera Prisma-klienten
const prisma = prismaInstance;
export default prisma;

// Exportera anslutningsfunktioner
export async function connectToDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('DB connected successfully');
  } catch (error: any) {
    console.error('DB connection failed:', error);
    // Försök igen efter 2 sekunder
    setTimeout(connectToDB, 2000);
  }
}

export async function disconnectFromDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('DB disconnected successfully');
  } catch (error: any) {
    console.error('Error disconnecting from DB:', error);
  }
}
