'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { TransferHeader } from '@/components/features/transfer/components/TransferHeader';
import { Suspense } from 'react';
import '@/styles/loader.css';

const PaymentContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const amount = searchParams.get('amount');
  const recipientId = searchParams.get('recipient');
  const message = searchParams.get('message');

  const paymentOptions = [
    {
      id: 'visa',
      title: 'Pay with Visa/Mastercard',
      icon: '/icons/credit-card.svg',
    },
    {
      id: 'business',
      title: 'Pay with Business Card',
      icon: '/icons/credit-card.svg',
    },
    {
      id: 'bank',
      title: 'Bank transfer',
      icon: '/icons/credit-card.svg',
    },
  ];

  const handlePaymentSelect = (paymentId: string) => {
    // Preserve all transfer details when navigating to summary
    const params = new URLSearchParams({
      amount: amount || '',
      recipient: recipientId || '',
      message: message || '',
      paymentMethod: paymentId
    });
    router.push(`/transfer/summary?${params.toString()}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FEFEFE] overflow-hidden pt-6 px-6">
      {/* Radial background effekt inspirerad av Remittance-main */}
      <div className="absolute w-[252px] h-[252px] top-[138px] left-[223px] bg-[radial-gradient(circle,rgba(124,204,201,0.8)_0%,rgba(124,204,201,0)_70%)] z-0 blur-[50px]" />
      <div className="max-w-md mx-auto pt-0 px-0 relative z-[1]">
        <TransferHeader title="Payment method" />

        {/* Payment Options */}
        <div className="mt-6 space-y-4">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePaymentSelect(option.id)}
              className="w-full h-[68px] bg-white border border-[#E4E4E4] rounded-[20px] px-4 flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 relative">
                  <Image
                    src={option.icon}
                    alt={option.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="ml-4 text-[16px]">{option.title}</span>
              </div>
              <Image 
                src="/icons/arrow-right.svg"
                alt="Next"
                width={24}
                height={24}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PaymentOptionsPage = () => {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-screen bg-[#FEFEFE] overflow-hidden pt-6 px-6">
        <div className="max-w-md mx-auto pt-0 px-0 relative z-[1]">
          <TransferHeader title="Payment method" />
          <div className="mt-6 flex justify-center">
            <div className="loader" />
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
};

export default PaymentOptionsPage;
