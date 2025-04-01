import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { contactId } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Kontrollera att kontakten tillhör användaren och ta bort den
    const deletedContact = await prisma.contact.deleteMany({
      where: {
        id: contactId,
        userId: user.id,
        isDefault: false // Prevent deletion of default contacts
      }
    });

    if (deletedContact.count === 0) {
      return new NextResponse("Contact not found or cannot be deleted", { status: 404 });
    }

    return new NextResponse("Contact deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    if (error.code === 'P2002') {
      return new NextResponse("Cannot delete contact: unique constraint violation", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
