'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Contact = {
  id: string
  name: string
  image: string
  phoneNumber: string
}

// Statiska demo-kontakter som anvu00e4nds som fallback
const DEMO_CONTACTS: Contact[] = [
  {
    id: 'demo-1',
    name: 'Alaya',
    image: '/img/contact1.jpg',
    phoneNumber: '+46701234567'
  },
  {
    id: 'demo-2',
    name: 'Badeeda',
    image: '/img/contact2.jpg',
    phoneNumber: '+46701234568'
  },
  {
    id: 'demo-3',
    name: 'Abdullah',
    image: '/img/contact3.jpg',
    phoneNumber: '+46701234569'
  }
];

// Statisk version som anvu00e4nds vid serverrendering
function StaticQuickRemit() {
  return (
    <div className="flex flex-wrap justify-between mt-4">
      {DEMO_CONTACTS.map((contact) => (
        <div key={contact.id} className="flex flex-col items-center justify-center w-[72px]">
          <div className="w-16 h-16 relative mb-2 border-2 border-white rounded-full bg-gray-200"></div>
          <p className="text-sm text-center whitespace-nowrap">{contact.name}</p>
        </div>
      ))}
      <div className="flex flex-col items-center justify-center w-[72px]">
        <div className="w-16 h-16 relative mb-2 bg-[#C4E9F3] rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-2xl">+</span>
        </div>
        <p className="text-sm text-center whitespace-nowrap">Add new</p>
      </div>
      {/* Osynliga placeholder-element fu00f6r ju00e4mn fu00f6rdelning */}
      <div className="w-[72px]" aria-hidden="true" />
      <div className="w-[72px]" aria-hidden="true" />
      <div className="w-[72px]" aria-hidden="true" />
    </div>
  );
}

// Dynamisk version som anvu00e4nds pu00e5 klientsidan
function ClientQuickRemit() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hu00e4mta kontakter med vanlig fetch
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setContacts(data);
          } else {
            // Om inga kontakter hittas, anvu00e4nd demo-kontakter
            setContacts(DEMO_CONTACTS);
          }
        } else {
          setError('Failed to fetch contacts');
          setContacts(DEMO_CONTACTS);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Error loading contacts');
        setContacts(DEMO_CONTACTS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  const handleContactClick = (phoneNumber: string) => {
    router.push(`/transfer?phone=${encodeURIComponent(phoneNumber)}`);
  };

  // Visa laddningsindikator medan vi hu00e4mtar kontakter
  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-between mt-4">
        {DEMO_CONTACTS.map((contact) => (
          <div key={contact.id} className="flex flex-col items-center justify-center w-[72px] opacity-50">
            <div className="w-16 h-16 relative mb-2 border-2 border-white rounded-full bg-gray-200 animate-pulse"></div>
            <p className="text-sm text-center whitespace-nowrap">{contact.name}</p>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center w-[72px] opacity-50">
          <div className="w-16 h-16 relative mb-2 bg-[#C4E9F3] rounded-full flex items-center justify-center border-2 border-white">
            <span className="text-2xl">+</span>
          </div>
          <p className="text-sm text-center whitespace-nowrap">Add new</p>
        </div>
        {/* Osynliga placeholder-element fu00f6r ju00e4mn fu00f6rdelning */}
        <div className="w-[72px]" aria-hidden="true" />
        <div className="w-[72px]" aria-hidden="true" />
        <div className="w-[72px]" aria-hidden="true" />
      </div>
    );
  }

  // Visa felmeddelande om nu00e5got gick fel
  if (error) {
    console.warn('Showing demo contacts due to error:', error);
    // Visa demo-kontakter u00e4ven vid fel
  }

  return (
    <div className="flex flex-wrap justify-between mt-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex flex-col items-center justify-center cursor-pointer w-[72px]"
          onClick={() => handleContactClick(contact.phoneNumber)}
        >
          <div className="w-16 h-16 relative mb-2 border-2 border-white rounded-full overflow-hidden">
            <Image
              src={contact.image && contact.image.trim() !== '' ? contact.image : '/img/default-avatar.png'}
              alt={contact.name}
              fill
              sizes="64px"
              priority={true}
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/img/default-avatar.png';
              }}
            />
          </div>
          <p className="text-sm text-center whitespace-nowrap">{contact.name}</p>
        </div>
      ))}
      <div 
        onClick={() => router.push('/add-favourite')}
        className="flex flex-col items-center justify-center cursor-pointer w-[72px]"
      >
        <div className="w-16 h-16 relative mb-2 bg-[#C4E9F3] rounded-full flex items-center justify-center border-2 border-white">
          <span className="text-2xl">+</span>
        </div>
        <p className="text-sm text-center whitespace-nowrap">Add new</p>
      </div>
      {/* Osynliga placeholder-element fu00f6r ju00e4mn fu00f6rdelning */}
      <div className="w-[72px]" aria-hidden="true" />
      <div className="w-[72px]" aria-hidden="true" />
      <div className="w-[72px]" aria-hidden="true" />
    </div>
  );
}

// Huvudkomponenten som anvu00e4nder dynamisk import fu00f6r att undvika hydreringsproblem
export default function QuickRemit() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Pu00e5 servern, visa alltid den statiska versionen
  if (!isClient) {
    return <StaticQuickRemit />;
  }
  
  // Pu00e5 klienten, visa den dynamiska versionen
  return <ClientQuickRemit />;
}
