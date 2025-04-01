'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { TransferHeader } from '@/components/features/transfer/components/TransferHeader';

const PaymentMethodPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectCard = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('paymentMethod', 'card');
    router.push(`/transfer/summary?${params.toString()}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FDF8F4]">
      {/* Background gradient */}
      <div className="absolute w-[252px] h-[252px] top-[138px] left-[223px] bg-[radial-gradient(circle,rgba(255,202,154,0.8)_0%,rgba(255,202,154,0)_70%)] z-[0] blur-[50px]" />
      
      <div className="max-w-full p-6 relative z-[1]">
        <TransferHeader title="Payment Method" />

        <div className="mt-6">
          <div 
            onClick={handleSelectCard}
            className="p-6 rounded-[24px] bg-white border border-[#EAEAEA] cursor-pointer hover:border-[#00B767] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 10H23" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[16px]">
                    Card Payment
                  </div>
                  <div className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] text-gray-600 mt-1">
                    Pay with credit or debit card
                  </div>
                </div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
