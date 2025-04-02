import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DEFAULT_CONTACTS } from '@/lib/defaultContacts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    console.log('Söker efter kontakt med telefonnummer:', phone);

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Först leta i DEFAULT_CONTACTS
    console.log('Kontrollerar DEFAULT_CONTACTS...');
    const defaultContact = DEFAULT_CONTACTS.find(
      contact => contact.phoneNumber === phone || contact.phone === phone
    );

    if (defaultContact) {
      console.log('Hittade i DEFAULT_CONTACTS:', defaultContact);
      return NextResponse.json({
        ...defaultContact,
        createdAt: defaultContact.createdAt.toISOString(),
        updatedAt: defaultContact.updatedAt.toISOString()
      });
    }

    const session = await getServerSession(authOptions);
    console.log('Användarsession:', session?.user?.email);
    
    // Normalisera telefonnumret för bättre sökning
    const normalizedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const phoneWithoutPlus = phone.startsWith('+') ? phone.substring(1) : phone;
    
    // Försök hitta kontakten direkt i databasen, oavsett användare
    console.log('Söker direkt efter telefonnummer:', normalizedPhone);
    const directContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { phoneNumber: phone },
          { phone: phone },
          { phoneNumber: normalizedPhone },
          { phone: normalizedPhone },
          { phoneNumber: phoneWithoutPlus },
          { phone: phoneWithoutPlus }
        ]
      }
    });

    if (directContact) {
      console.log('Hittade med direkt sökning:', directContact);
      return NextResponse.json(directContact);
    }
    
    if (!session?.user?.email) {
      console.log('Ingen användarsession, returnerar temporär kontakt');
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
    console.log('Söker i användarens kontakter...');
    const userContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { phoneNumber: phone },
          { phone: phone },
          { phoneNumber: normalizedPhone },
          { phone: normalizedPhone },
          { phoneNumber: phoneWithoutPlus },
          { phone: phoneWithoutPlus }
        ],
        user: { email: session.user.email }
      }
    });

    if (userContact) {
      console.log('Hittade i användarens kontakter:', userContact);
      return NextResponse.json(userContact);
    }

    // Om ingen kontakt hittades, skapa en temporär
    console.log('Ingen kontakt hittades, returnerar temporär kontakt');
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
    console.error('Fel i contacts/details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
