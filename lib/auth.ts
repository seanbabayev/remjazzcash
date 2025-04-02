import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

// Default contacts som ska läggas till för varje ny användare
const DEFAULT_CONTACTS = [
  {
    name: 'Alaya',
    phone: '+46701234567',
    email: 'alaya@example.com',
    isDefault: true
  },
  {
    name: 'Badeeda',
    phone: '+46701234568',
    email: 'badeeda@example.com',
    isDefault: true
  },
  {
    name: 'Abdullah',
    phone: '+46701234569',
    email: 'abdullah@example.com',
    isDefault: true
  },
  {
    name: 'Hassan Ali',
    phone: '+92123456789',
    email: 'hassan@example.com',
    isDefault: true
  }
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Demo-provider är nu inaktiverad eftersom vi använder Google-inloggning
    // {
    //   id: "demo-provider",
    //   name: "Demo Provider",
    //   type: "credentials",
    //   credentials: {},
    //   authorize: async () => {
    //     return {
    //       id: "demo-user",
    //       name: "Demo User",
    //       email: "demo@example.com",
    //     };
    //   },
    // } as any,
    // Google-inloggning är nu aktiverad
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dagar
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    jwt: async ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    signIn: async ({ user }) => {
      if (!user.email) return false;

      // Kontrollera om användaren finns, men vi behöver inte använda resultatet
      // eftersom vi alltid returnerar true för att tillåta inloggning
      await prisma.user.findUnique({
        where: { email: user.email },
      });

      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      // Logga information för felsökning
      console.log('Redirect callback called with:', { url, baseUrl });
      console.log('Current environment:', process.env.NODE_ENV);
      console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
      
      // Förbättrad hantering av callback-fel
      if (url.includes('error=')) {
        console.log('Detected error in URL, redirecting to dashboard:', url);
        // Omdirigera direkt till dashboard vid alla typer av fel
        return `${baseUrl}/dashboard`;
      }
      
      // Specifik hantering för produktionsmiljö
      if (process.env.NODE_ENV === 'production') {
        // Om URL:en är en relativ sökväg, lägg till baseUrl
        if (url.startsWith('/')) {
          console.log('Production: URL is relative, adding baseUrl');
          return `${baseUrl}${url}`;
        }
        
        // Om URL:en är en absolut URL, använd den om den är från samma webbplats
        try {
          const urlOrigin = new URL(url).origin;
          const baseUrlOrigin = new URL(baseUrl).origin;
          
          console.log('Production: Comparing origins:', { urlOrigin, baseUrlOrigin });
          
          if (urlOrigin === baseUrlOrigin) {
            console.log('Production: URL is from same origin, allowing redirect');
            return url;
          }
        } catch (error) {
          console.error('Error parsing URL:', error);
        }
        
        // Fallback för produktion - alltid omdirigera till dashboard
        console.log('Production: Using fallback redirect to dashboard');
        return `${baseUrl}/dashboard`;
      }
      
      // Standardhantering för utvecklingsmiljö
      // Om URL:en är en absolut URL och börjar med baseUrl, tillåt den
      if (url.startsWith(baseUrl)) {
        console.log('URL starts with baseUrl, allowing redirect');
        return url;
      }
      
      // Om URL:en är relativ (börjar med /) lägg till baseUrl
      if (url.startsWith('/')) {
        console.log('URL is relative, adding baseUrl');
        return `${baseUrl}${url}`;
      }
      
      // Om URL:en är en extern URL, kontrollera om den är tillåten
      // I detta fall tillåter vi bara URL:er från samma webbplats
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) {
          console.log('URL is from same origin, allowing redirect');
          return url;
        }
      } catch (error) {
        console.error('Error parsing URL:', error);
      }
      
      // Fallback till dashboard
      console.log('Using fallback redirect to dashboard');
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    createUser: async ({ user }) => {
      // Lägg till standardkontakter för nya användare
      if (user.email) {
        try {
          for (const contact of DEFAULT_CONTACTS) {
            await prisma.contact.create({
              data: {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                phoneNumber: contact.phone,
                isDefault: contact.isDefault,
                user: { connect: { email: user.email } },
              },
            });
          }
        } catch (error) {
          console.error('Failed to create default contacts:', error);
        }
      }
    },
  },
  pages: {
    signIn: '/login', 
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production', // Aktivera debug-logg endast i utvecklingsmiljö
};
