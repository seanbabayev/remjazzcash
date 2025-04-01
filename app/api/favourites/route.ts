import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Kontrollera autentisering
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hämta och validera form data
    const data = await request.formData();
    const fullName = data.get('fullName');
    const phoneNumber = data.get('phoneNumber');
    const photo = data.get('photo');

    // Validera obligatoriska fält
    if (!fullName || typeof fullName !== 'string') {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Validera telefonnummerformat (börjar med +92 och minst 8 siffror efter)
    if (!/^\+92\d{8,}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Must start with +92 and have at least 8 digits.' },
        { status: 400 }
      );
    }

    // Hämta användar-ID från databasen
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { contacts: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kolla om kontakten redan finns
    const existingContact = user.contacts.find(
      contact => contact.phoneNumber === phoneNumber
    );

    if (existingContact) {
      return NextResponse.json(
        { error: 'Contact already exists' },
        { status: 400 }
      );
    }

    // Hantera bilduppladdning
    let imageData = null;
    if (photo instanceof File) {
      try {
        const buffer = await photo.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        imageData = `data:${photo.type};base64,${base64}`;
      } catch (error) {
        console.error('Error processing image:', error);
        // Fortsätt utan bild om det blir fel
      }
    }

    // Spara kontakten
    const contact = await prisma.contact.create({
      data: {
        name: fullName,
        phoneNumber,
        userId: user.id,
        image: imageData,
      },
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
