'use client';

import Image from 'next/image';
import PhoneInput from '@/components/dashboard/PhoneInput'; 
import QuickRemit from '@/components/home/QuickRemit';
import { Header } from '@/components/core/layout/Header';
import SignOutButton from '@/components/auth/SignOutButton';

export default function DashboardPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#FCF7F1] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute left-0 top-0 w-full h-[210px]" 
        style={{
          background: 'linear-gradient(180deg, #6ED7A3 30%, #FCF7F1 100%)'
        }}
      >
        {/* Center accent */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: '-126px',
            top: '-130px',
            width: '252px',
            height: '252px',
            background: 'rgba(251, 237, 173, 1)',
            borderRadius: '100%',
            filter: 'blur(30px)',
          }}
        />
      </div>
      
      <div className="max-w-md mx-auto p-6 relative z-[1]">
        {/* Header Section */}
        <Header />

        {/* New Remittance Section */}
        <section className="mt-8 w-full">
          <h2 className="text-[24px] text-[#171717] mb-0">New remittance transfer</h2>
          <PhoneInput />
        </section>

        {/* Quick Remit Section */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[24px] text-[#171717] mb-0">Quick remit</h3>
          </div>
          <QuickRemit />
        </section>

        {/* Event Reminder Section */}
        <section className="mt-10">
          <h3 className="text-[24px] text-[#171717] mb-0">Event Reminder</h3>
          <div className="relative mt-4 rounded-2xl overflow-hidden">
            <Image
              src="/img/mosque.jpg"
              alt="Mosque"
              width={600}
              height={300}
              className="w-full"
            />
            <div className="absolute bottom-6 left-6">
              <p className="text-2xl font-bold text-[#333333] mb-2">Don't forget Eid in<br />three days</p>
              <a href="#" className="text-[#333333] underline">Send Eid gift today</a>
            </div>
          </div>
        </section>

        {/* Sign Out Button */}
        <div className="mt-10 pb-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
