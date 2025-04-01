import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";

// Default contacts som ska läggas till för varje ny användare
const DEFAULT_CONTACTS = [
  {
    name: 'Alaya',
    phone: '+46701234567',
    email: 'alaya@example.com'
  },
  {
    name: 'Badeeda',
    phone: '+46701234568',
    email: 'badeeda@example.com'
  },
  {
    name: 'Abdullah',
    phone: '+46701234569',
    email: 'abdullah@example.com'
  },
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
      
      // Hantera callback-fel
      if (url.includes('error=Callback')) {
        console.log('Detected callback error, redirecting to dashboard');
        return `${baseUrl}/dashboard`;
      }
      
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
      if (new URL(url).origin === baseUrl) {
        console.log('URL is from same origin, allowing redirect');
        return url;
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
                isDefault: true,
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
  debug: process.env.NODE_ENV === 'development',
};
