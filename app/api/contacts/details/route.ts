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

    // Förbered alla möjliga format av telefonnumret för sökning
    const normalizedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const phoneWithoutPlus = phone.startsWith('+') ? phone.substring(1) : phone;
    
    // Skapa en array med alla möjliga format för att söka
    const phoneFormats = [
      phone,
      normalizedPhone,
      phoneWithoutPlus
    ];
    
    console.log('Söker med följande format:', phoneFormats);

    // Först leta i DEFAULT_CONTACTS
    console.log('Kontrollerar DEFAULT_CONTACTS...');
    const defaultContact = DEFAULT_CONTACTS.find(
      contact => {
        const contactPhone = contact.phoneNumber || contact.phone || '';
        const contactPhoneNormalized = contactPhone.startsWith('+') ? contactPhone : `+${contactPhone}`;
        const contactPhoneWithoutPlus = contactPhone.startsWith('+') ? contactPhone.substring(1) : contactPhone;
        
        return phoneFormats.includes(contactPhone) || 
               phoneFormats.includes(contactPhoneNormalized) || 
               phoneFormats.includes(contactPhoneWithoutPlus);
      }
    );

    if (defaultContact) {
      console.log('Hittade i DEFAULT_CONTACTS:', defaultContact);
      // Sätt cache-headers för att undvika problem med upprepade anrop
      const response = NextResponse.json({
        ...defaultContact,
        createdAt: defaultContact.createdAt.toISOString(),
        updatedAt: defaultContact.updatedAt.toISOString()
      });
      
      // Inaktivera cache för att säkerställa färska resultat
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    const session = await getServerSession(authOptions);
    console.log('Användarsession:', session?.user?.email);
    
    // Försök hitta kontakten direkt i databasen, oavsett användare
    console.log('Söker direkt efter telefonnummer med alla format');
    const directContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { phoneNumber: { in: phoneFormats } },
          { phone: { in: phoneFormats } }
        ]
      }
    });

    if (directContact) {
      console.log('Hittade med direkt sökning:', directContact);
      const response = NextResponse.json(directContact);
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }
    
    if (!session?.user?.email) {
      console.log('Ingen användarsession, returnerar temporär kontakt');
      // Om användaren inte är inloggad, skapa en temporär kontakt
      const response = NextResponse.json({
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
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    // Sedan leta i användarens kontakter
    console.log('Söker i användarens kontakter...');
    const userContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { phoneNumber: { in: phoneFormats } },
          { phone: { in: phoneFormats } }
        ],
        user: { email: session.user.email }
      }
    });

    if (userContact) {
      console.log('Hittade i användarens kontakter:', userContact);
      const response = NextResponse.json(userContact);
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    // Om ingen kontakt hittades, skapa en temporär
    console.log('Ingen kontakt hittades, returnerar temporär kontakt');
    const response = NextResponse.json({
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
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Fel i contacts/details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
