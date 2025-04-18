'use client';

import { useRouter } from 'next/navigation';
import { BaseComponentProps } from '@/components/shared/types/shared-types';

interface TransferHeaderProps extends BaseComponentProps {
  title: string;
}

export const TransferHeader: React.FC<TransferHeaderProps> = ({ title, className }) => {
  const router = useRouter();

  return (
    <header className={`flex items-start justify-between h-[72px] ${className || ''}`}>
      {/* Tillbakaknapp till vänster */}
      {title !== 'Thank you!' && (
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-[#FEFEFE] rounded-[4px] border border-[#D9D9D9]"
          data-component-name="TransferHeader"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6L3 12L8 18" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 12H4" stroke="#A8A8A8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {/* Centrerad rubrik */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[24px] text-[#322D3C] whitespace-nowrap">{title}</h1>
      {/* Osynlig div till höger för att balansera layouten */}
      <div className="w-[40px] h-[40px] invisible"></div>
    </header>
  );
};
