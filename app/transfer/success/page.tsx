'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TransferHeader } from '@/components/features/transfer/components/TransferHeader';
import { format } from 'date-fns';
import { Suspense } from 'react';

interface TransactionDetails {
  amount: string;
  recipientId: string;
  message: string;
  status: string;
  transactionId: string;
}

// Fallback-data för demo-läge
const getDemoTransactionDetails = (sessionId: string): TransactionDetails => {
  return {
    amount: '1500.00',
    recipientId: 'default-1', // Använd ID som matchar defaultContacts
    message: 'Demo transaction',
    status: 'completed',
    transactionId: sessionId || `demo-${Date.now().toString(36)}`,
  };
};

const TransactionContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopyTransId = async () => {
    if (!transactionDetails) return;
    
    const shortTransId = transactionDetails.transactionId.slice(0, 10);
    try {
      await navigator.clipboard.writeText(shortTransId);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setCopySuccess(false);
    }
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setIsLoading(true);
      const sessionId = searchParams.get('session_id');
      
      // Om ingen session_id finns, använd demo-data efter en kort fördröjning
      if (!sessionId) {
        setTimeout(() => {
          setTransactionDetails(getDemoTransactionDetails(''));
          setIsLoading(false);
        }, 1500);
        return;
      }

      try {
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch transaction details: ${response.status}`);
        }
        const data = await response.json();
        setTransactionDetails(data);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        // Använd demo-data vid fel
        setTransactionDetails(getDemoTransactionDetails(sessionId));
      } finally {
        setIsLoading(false);
      }
    };

    // Lägg till en kort fördröjning för att simulera laddning
    setTimeout(() => {
      fetchTransactionDetails();
    }, 1000);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Om vi fortfarande inte har transaktionsdetaljer efter laddning, använd demo-data
  if (!transactionDetails) {
    setTransactionDetails(getDemoTransactionDetails(''));
    return null; // Returnera null för att undvika rendering innan state uppdateras
  }

  const today = new Date();
  const transferDate = format(today, 'MMMM do');
  const estimatedDate = format(new Date(today.setDate(today.getDate() + 1)), 'MMMM do');
  const completionDate = format(new Date(today.setDate(today.getDate() + 1)), 'MMMM do');

  return (
    <div className="relative min-h-screen bg-[#FCF7F1] overflow-hidden">
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
      
      <div className="relative z-[1] p-6">
        <div className="max-w-md mx-auto">
          <TransferHeader title="Thank you!" />
          
          <div className="mt-8 bg-white rounded-[24px] p-6 shadow-sm border border-[#EAEAEA]">
            <h3 className="text-sm font-medium text-gray-500 mb-6">TRANSFER UPDATES</h3>
            
            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-200" />
              
              {/* Timeline items */}
              <div className="space-y-8">
                {/* Current step */}
                <div className="relative flex items-start">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-black" />
                  <div className="ml-10">
                    <p className="font-medium">{transferDate}</p>
                    <p className="text-gray-500 text-sm">Transfer initiated.</p>
                  </div>
                </div>
                
                {/* Current step */}
                <div className="relative flex items-start">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-black" />
                  <div className="ml-10">
                    <p className="font-medium">{transferDate}</p>
                    <p className="text-gray-500 text-sm">We've sent your transfer.<br />Conversion fees you've paid: €{(Number(transactionDetails.amount) * 0.02).toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Future step */}
                <div className="relative flex items-start">
                  <div className="absolute left-0 w-6 h-6 rounded-full border-2 border-gray-300" />
                  <div className="ml-10">
                    <p className="font-medium text-gray-500">{estimatedDate}</p>
                    <p className="text-gray-400 text-sm">Recipient should receive your transfer.</p>
                  </div>
                </div>
                
                {/* Future step */}
                <div className="relative flex items-start">
                  <div className="absolute left-0 w-6 h-6 rounded-full border-2 border-gray-300" />
                  <div className="ml-10">
                    <p className="font-medium text-gray-500">{completionDate}</p>
                    <p className="text-gray-400 text-sm">Your transfer should be complete.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transaction ID */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                TRANS ID: #{transactionDetails.transactionId.slice(0, 10)}
              </p>
              <button 
                onClick={handleCopyTransId}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Copy transaction ID"
              >
                {copySuccess ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6663 5L7.49967 14.1667L3.33301 10" stroke="#049D52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.16667 12.5H3.33333C2.89131 12.5 2.46738 12.3244 2.15482 12.0118C1.84226 11.6993 1.66667 11.2754 1.66667 10.8333V3.33333C1.66667 2.89131 1.84226 2.46738 2.15482 2.15482C2.46738 1.84226 2.89131 1.66667 3.33333 1.66667H10.8333C11.2754 1.66667 11.6993 1.84226 12.0118 2.15482C12.3244 2.46738 12.5 2.89131 12.5 3.33333V4.16667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 w-full bg-[#FCF7F1]">
          <div className="max-w-md mx-auto w-full">
            <button
              onClick={() => router.push('/dashboard')}
              className="h-[56px] rounded-full w-full transition-colors box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[18px] font-medium bg-[#00BD5F] text-white"
              data-component-name="SuccessContent"
            >
              Go to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-4">Laddar...</div>}>
      <TransactionContent />
    </Suspense>
  );
}
