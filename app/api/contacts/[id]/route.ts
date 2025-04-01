import prisma from '@/lib/prisma';
import { DEFAULT_CONTACTS } from '@/lib/defaultContacts';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Först kolla i databasen
    const contact = await prisma.contact.findUnique({
      where: {
        id: params.id,
      },
    });

    if (contact) {
      return Response.json(contact);
    }

    // Om kontakten inte finns i databasen, kolla i standardkontakterna
    const defaultContact = DEFAULT_CONTACTS.find(
      contact => contact.id === params.id
    );

    if (defaultContact) {
      return Response.json(defaultContact);
    }

    return Response.json(
      { error: 'Contact not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching contact:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const contact = await prisma.contact.update({
      where: {
        id: params.id,
      },
      data,
    });

    return Response.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: {
        id: params.id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
