'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PaymentHeader } from '@/components/payment/PaymentHeader';
import { Suspense } from 'react';

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
    <div className="relative w-full min-h-screen bg-[#FCF7F1] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute left-0 top-0 w-full h-[210px]" 
        style={{
          background: 'linear-gradient(180deg, #7C1E1C 0%, #FCF7F1 100%)'
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
            background: 'rgba(247, 195, 17, 0.7)',
            borderRadius: '100%',
            filter: 'blur(30px)',
          }}
        />
      </div>
      
      <div className="max-w-md mx-auto p-6 relative z-[1]">
        <PaymentHeader title="Payment method" />

        {/* Payment Options */}
        <div className="mt-[48px] space-y-4">
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
      <div className="relative w-full min-h-screen bg-[#FCF7F1] overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute left-0 top-0 w-full h-[210px]" 
          style={{
            background: 'linear-gradient(180deg, #7C1E1C 0%, #FCF7F1 100%)'
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
              background: 'rgba(247, 195, 17, 0.7)',
              borderRadius: '100%',
              filter: 'blur(30px)',
            }}
          />
        </div>
        
        <div className="max-w-md mx-auto p-6 relative z-[1]">
          <PaymentHeader title="Payment method" />
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
};

export default PaymentOptionsPage;
