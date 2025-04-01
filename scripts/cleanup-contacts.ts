const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

interface Contact {
  id: string;
  image: string | null;
  isDefault: boolean;
}

async function cleanupContacts() {
  try {
    // Hitta alla kontakter med default-bilder som är markerade som standard
    const defaultContactsWithoutImages: Contact[] = await prisma.contact.findMany({
      where: {
        isDefault: true,
        OR: [
          { image: null },
          { image: '' }
        ]
      }
    });

    console.log(`Hittade ${defaultContactsWithoutImages.length} kontakter att ta bort`);

    // Ta bort dessa kontakter
    const deleteResult = await prisma.contact.deleteMany({
      where: {
        id: {
          in: defaultContactsWithoutImages.map(c => c.id)
        }
      }
    });

    console.log(`Borttagna kontakter: ${deleteResult.count}`);
  } catch (error) {
    console.error('Fel vid städning av kontakter:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupContacts();
