'use client';

import { useRouter } from 'next/navigation';
import { BaseComponentProps } from '@/components/shared/types/shared-types';

interface TransferHeaderProps extends BaseComponentProps {
  title: string;
}

export const TransferHeader: React.FC<TransferHeaderProps> = ({ title, className }) => {
  const router = useRouter();

  return (
    <header className={`flex items-center justify-between h-[72px] -mt-[10px] ${className || ''}`}>
      {/* Tillbakaknapp till vänster */}
      <button 
        onClick={() => router.back()}
        className="w-[40px] h-[40px] bg-[#FCFDFD] rounded-full flex justify-center items-center"
        data-component-name="TransferHeader"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5"
            stroke="#81201F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19L5 12L12 5"
            stroke="#81201F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {/* Centrerad rubrik */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[24px] text-white">{title}</h1>
      
      {/* Osynlig div till höger för att balansera layouten */}
      <div className="w-[40px] h-[40px] invisible"></div>
    </header>
  );
};
