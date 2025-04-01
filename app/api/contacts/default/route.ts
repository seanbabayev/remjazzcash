import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const defaultContacts = await prisma.contact.findMany({
      where: {
        isDefault: true
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 3
    });

    return NextResponse.json(defaultContacts);
  } catch (error) {
    console.error("Error fetching default contacts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
