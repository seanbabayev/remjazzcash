'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Contact } from '@prisma/client';
import { ArrowUpDown } from 'lucide-react';
import { TransferHeader } from '@/components/features/transfer/components/TransferHeader';

interface ExchangeRate {
  rate: number;
  timestamp: number;
}

function TransferPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneNumber = searchParams.get('phone');
  
  const [recipient, setRecipient] = useState<Contact | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isEuroInput, setIsEuroInput] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      if (!phoneNumber) {
        setError('No phone number provided');
        setIsLoading(false);
        return;
      }

      try {
        const encodedPhone = encodeURIComponent(phoneNumber);
        const [contactResponse, rateResponse] = await Promise.all([
          fetch(`/api/contacts/details?phone=${encodedPhone}`),
          fetch('/api/exchange-rate')
        ]);

        if (!contactResponse.ok) {
          const errorText = await contactResponse.text();
          console.error('Contact API error:', errorText);
          throw new Error('Failed to fetch contact');
        }

        if (!rateResponse.ok) throw new Error('Failed to fetch exchange rate');

        const [contactData, rateData] = await Promise.all([
          contactResponse.json(),
          rateResponse.json()
        ]);

        if (!contactData?.id) throw new Error('Invalid contact data received');
        if (!rateData?.rate) throw new Error('Invalid exchange rate data received');

        setRecipient(contactData);
        setExchangeRate(rateData);
      } catch (error) {
        console.error('Error in transfer page:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setTimeout(() => router.push('/dashboard'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [phoneNumber, router]);

  useEffect(() => {
    if (amount === '') {
      setIsValidating(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsValidating(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [amount]);

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    if (cleanValue.split('.').length > 2) return;
    
    const parts = cleanValue.split('.');
    if (parts[1] && parts[1].length > 2) return;
    
    setAmount(cleanValue);
  };

  const calculateOtherAmount = () => {
    if (!exchangeRate || !amount) return '0';
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0';
    
    if (isEuroInput) {
      return (numAmount * exchangeRate.rate).toFixed(2);
    } else {
      return (numAmount / exchangeRate.rate).toFixed(2);
    }
  };

  const toggleCurrency = () => {
    const converted = calculateOtherAmount();
    if (converted && converted !== '0') {
      setAmount(converted);
    }
    setIsEuroInput(!isEuroInput);
  };

  const formatCurrency = (value: string, currency: string) => {
    return `${currency} ${value}`;
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    return phoneNumber;
  };

  const handleContinue = () => {
    if (!recipient?.id) return;

    if (!isAmountValid()) {
      return;
    }

    const params = new URLSearchParams();
    params.set('recipient', recipient.id);
    params.set('amount', amount);
    if (message) params.set('message', message);
    router.push(`/transfer/payment?${params.toString()}`);
  };

  const isAmountValid = () => {
    const euroAmount = isEuroInput ? parseFloat(amount) : parseFloat(calculateOtherAmount());
    
    // Kontrollera att beloppet är minst 10 euro
    const isValid = !isNaN(euroAmount) && euroAmount >= 10;
    
    // Om beloppet är ogiltigt och vi inte redan visar ett felmeddelande, visa ett
    if (!isValid && amount !== '') {
      // Här kan vi lägga till logik för att visa ett felmeddelande om vi vill
    }
    
    return isValid;
  };

  const getButtonStyles = () => {
    if (!recipient || amount === '') {
      return {
        backgroundColor: '#E4E4E4',
        cursor: 'not-allowed',
        color: 'rgba(27, 27, 27, 0.5)',
      };
    } else if (!isAmountValid()) {
      return {
        backgroundColor: '#ff6b6b', 
        cursor: 'not-allowed',
        color: '#FFFFFF',
      };
    } else {
      return {
        backgroundColor: '#00BD5F', 
        cursor: 'pointer',
        color: '#FFFFFF',
      };
    }
  };

  const getButtonText = () => {
    if (!isValidating || amount === '') {
      return 'Continue';
    } else if (!isAmountValid()) {
      return 'Minimum amount is €10';
    } else {
      return 'Continue';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

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
        <TransferHeader title="Money transfer" />

        <div className="mt-6">
          {/* Amount Input */}
          <div>
            <h2 className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[18px]">
              {isEuroInput ? 'The amount you will send excl fees' : 'The amount to be received'}
            </h2>
            
            <div className="mt-2 relative">
              <div className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[40px] flex items-center">
                <span>{isEuroInput ? '€' : '₨'}</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="ml-2 w-full bg-transparent focus:outline-none font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[40px]"
                  placeholder="0"
                />
                <button
                  onClick={toggleCurrency}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                >
                  <ArrowUpDown size={24} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="mt-2 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-bold text-[14px] text-gray-600">
              {isEuroInput 
                ? `The amount to be received: ₨ ${calculateOtherAmount()}`
                : `The amount you will send: € ${calculateOtherAmount()}`
              }
            </div>
          </div>

          {/* Transfer To Section */}
          <div className="mt-8 p-4 rounded-[24px] bg-white border border-[#EAEAEA]">
            <h2 className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[18px]">Transfer to</h2>
            
            <div className="mt-4 flex items-start">
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={recipient?.image || '/img/default-avatar.png'}
                  alt={recipient?.name || 'Recipient'}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-3">
                <div className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[14px]">
                  {recipient?.name}
                </div>
                <div className="mt-2 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[12px] text-gray-600">
                  {formatPhoneNumber(recipient?.phoneNumber || '')}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <input
                type="text"
                placeholder="Add message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-[#EAEAEA] text-[#333333] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold text-[16px] rounded-[100px] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleContinue}
              style={getButtonStyles()}
              className="h-[56px] rounded-full w-full max-w-[400px] mx-auto block transition-colors box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[18px] font-medium"
              data-component-name="TransferPage"
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={<div className="p-4">Laddar...</div>}>
      <TransferPageContent />
    </Suspense>
  );
}