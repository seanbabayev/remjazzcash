import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const userContacts = await prisma.contact.findMany({
      where: {
        userId: user.id,
        isDefault: false
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(userContacts);
  } catch (error) {
    console.error("Error fetching user contacts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
