const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_CONTACTS = [
  {
    name: 'Alaya',
    phoneNumber: '+46701234567',
    email: 'alaya@example.com',
    image: '/img/contact1.jpg'
  },
  {
    name: 'Badeeda',
    phoneNumber: '+46701234568',
    email: 'badeeda@example.com',
    image: '/img/contact2.jpg'
  },
  {
    name: 'Abdullah',
    phoneNumber: '+46701234569',
    email: 'abdullah@example.com',
    image: '/img/contact3.jpg'
  },
];

async function main() {
  console.log('Starting seeding...');
  
  // Skapa eller hitta system-användaren
  console.log('Setting up system user...');
  let systemUser = await prisma.user.findFirst({
    where: {
      email: 'system@vopy.com'
    }
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: 'system@vopy.com',
        name: 'System User'
      }
    });
  }

  console.log('Starting seeding default contacts...');

  // Ta bort alla existerande standardkontakter
  await prisma.contact.deleteMany({
    where: {
      isDefault: true
    }
  });

  // Skapa nya standardkontakter
  for (const contact of DEFAULT_CONTACTS) {
    await prisma.contact.create({
      data: {
        ...contact,
        isDefault: true,
        userId: systemUser.id
      }
    });
  }

  console.log('Default contacts created');
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
