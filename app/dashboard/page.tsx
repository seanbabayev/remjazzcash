'use client';

import Image from 'next/image';
import PhoneInput from '@/components/dashboard/PhoneInput'; 
import QuickRemit from '@/components/home/QuickRemit';
import SignOutButton from '@/components/auth/SignOutButton';

// Enkel Header-komponent
const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-2">
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20" stroke="#7C1E1C" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12H20" stroke="#7C1E1C" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 18H20" stroke="#7C1E1C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      
      <div className="flex items-center justify-center">
        <Image 
          src="/img/jazzcash.png" 
          alt="JazzCash logo" 
          width={120} 
          height={40} 
          className="h-8 w-auto"
          priority
        />
      </div>
      
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full relative">
        <Image
          src="/img/bell-icon.svg"
          alt="Notifications"
          width={16}
          height={16}
          className="brightness-100"
        />
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#00BD5F] rounded-full border border-white"></div>
      </div>
    </header>
  );
};

export default function DashboardPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#FCF7F1] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute left-0 top-0 w-full h-[210px]" 
        style={{
          background: 'linear-gradient(180deg, #7C1E1C 0%, #FCF7F1 100%)'
        }}
        data-component-name="DashboardPage"
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
            background: 'rgba(247, 195, 17, 0.7)',
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
