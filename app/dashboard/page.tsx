'use client';

import Image from 'next/image';
import PhoneInput from '@/components/dashboard/PhoneInput'; 
import QuickRemit from '@/components/home/QuickRemit';
import SignOutButton from '@/components/auth/SignOutButton';

// Enkel Header-komponent
const Header = () => {
  return (
    <header className="flex items-start justify-between h-[50px]">
      {/* Menyknapp vänsterjusterad */}
      <div className="w-10 h-10 flex items-center justify-center bg-[#FEFEFE] rounded-[4px] border border-[#D9D9D9]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12H20" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 18H20" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      {/* Logotyp centrerad */}
      <Image 
        src="/img/zindigi.png" 
        alt="Zindigi logo" 
        width={130} 
        height={60} 
        className="mx-auto object-contain"
        priority
      />
      {/* Bell högerjusterad */}
      <div className="w-10 h-10 flex items-center justify-center bg-[#FEFEFE] rounded-[4px] border border-[#D9D9D9] relative">
        <span className="relative inline-block w-4 h-4">
          <Image
            src="/img/bell-icon.svg"
            alt="Notifications"
            width={16}
            height={16}
            className="brightness-0 invert-[60%] sepia-[0%] saturate-0 hue-rotate-0 opacity-100"
          />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00BD5F] rounded-full border-2 border-white" />
        </span>
      </div>
    </header>
  );
};

export default function DashboardPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#FEFEFE] overflow-hidden p-6">
      {/* Radial background effekt inspirerad av Remittance-main */}
      <div className="absolute w-[252px] h-[252px] top-[138px] left-[223px] bg-[radial-gradient(circle,rgba(124,204,201,0.8)_0%,rgba(124,204,201,0)_70%)] z-0 blur-[50px]" />
      {/* Header Section */}
      <Header className="px-6" />
      <div className="max-w-md mx-auto relative z-[1]">
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
