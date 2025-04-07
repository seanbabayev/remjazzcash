import type { Contact } from '@prisma/client';

type DefaultContact = Omit<Contact, 'userId'> & { userId: string | null };

export const DEFAULT_CONTACTS: DefaultContact[] = [
  {
    id: 'default-1',
    name: 'Alaya',
    phoneNumber: '+46701234567',
    phone: '+46701234567',
    email: 'alaya@example.com',
    image: '/img/contact1.jpg',
    isDefault: true,
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'default-2',
    name: 'Badeeda',
    phoneNumber: '+46701234568',
    phone: '+46701234568',
    email: 'badeeda@example.com',
    image: '/img/contact2.jpg',
    isDefault: true,
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'default-3',
    name: 'Abdullah',
    phoneNumber: '+46701234569',
    phone: '+46701234569',
    email: 'abdullah@example.com',
    image: '/img/contact3.jpg',
    isDefault: true,
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'default-4',
    name: 'Hassan Ali',
    phoneNumber: '+92123456789',
    phone: '+92123456789',
    email: 'hassan@example.com',
    image: null,
    isDefault: false,
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
