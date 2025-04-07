import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      // Om användaren inte är inloggad, returnera bara standardkontakter
      const defaultContacts = await prisma.contact.findMany({
        where: {
          isDefault: true
        },
        select: {
          id: true,
          name: true,
          image: true,
          phoneNumber: true,
          isDefault: true
        }
      });
      return NextResponse.json(defaultContacts);
    }

    // Om användaren är inloggad, hämta deras kontakter OCH standardkontakter
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hämta användarens kontakter och standardkontakter i en enda query
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { 
            userId: user.id,
            isDefault: false  // Endast användarens egna kontakter
          },
          { 
            isDefault: true,
            image: { not: null }  // Endast standardkontakter med bilder
          }
        ]
      },
      select: {
        id: true,
        name: true,
        image: true,
        phoneNumber: true,
        isDefault: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Ta bort eventuella dubletter baserat på telefonnummer
    const uniqueContacts = contacts.filter((contact, index, self) =>
      index === self.findIndex((c) => c.phoneNumber === contact.phoneNumber)
    );

    return NextResponse.json(uniqueContacts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!data.phoneNumber || !data.name) {
      return NextResponse.json(
        { error: 'Phone number and name are required' },
        { status: 400 }
      );
    }

    // Hämta användaren
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Skapa ny kontakt
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        phone: data.phone || data.phoneNumber,
        userId: user.id,
        isDefault: false
      }
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
