'use client';

import { useRouter } from 'next/navigation';

interface PaymentHeaderProps {
  title?: string;
}

export const PaymentHeader = ({ title = 'Payment Options' }: PaymentHeaderProps) => {
  const router = useRouter();

  return (
    <header className="flex items-center h-[72px] -mt-[10px]">
      <button 
        onClick={() => router.back()}
        className="w-[40px] h-[40px] bg-[#322D3C] rounded-full flex justify-center items-center"
        data-component-name="PaymentHeader"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-component-name="PaymentHeader"
        >
          <path
            d="M19 12H5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19L5 12L12 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className="flex-1 text-center text-[24px] text-[#171717]">
        {title}
      </h1>

      {/* Tom div för att balansera layouten */}
      <div className="w-[40px]" />
    </header>
  );
};
