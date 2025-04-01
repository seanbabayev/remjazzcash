import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_CONTACTS } from '@/lib/defaultContacts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Först leta i DEFAULT_CONTACTS
    const defaultContact = DEFAULT_CONTACTS.find(
      contact => contact.phoneNumber === phone || contact.phone === phone
    );

    if (defaultContact) {
      return NextResponse.json({
        ...defaultContact,
        createdAt: defaultContact.createdAt.toISOString(),
        updatedAt: defaultContact.updatedAt.toISOString()
      });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      // Om användaren inte är inloggad, skapa en temporär kontakt
      return NextResponse.json({
        id: 'temp',
        name: 'New Contact',
        phoneNumber: phone,
        phone: phone,
        email: null,
        image: null,
        isDefault: false,
        userId: 'temp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Sedan leta i användarens kontakter
    const userContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { phoneNumber: phone },
          { phone: phone }
        ],
        user: { email: session.user.email }
      }
    });

    if (userContact) {
      return NextResponse.json(userContact);
    }

    // Om ingen kontakt hittades, skapa en temporär
    return NextResponse.json({
      id: 'temp',
      name: 'New Contact',
      phoneNumber: phone,
      phone: phone,
      email: null,
      image: null,
      isDefault: false,
      userId: 'temp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in contacts/details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
