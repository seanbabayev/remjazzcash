'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { Contact } from '@prisma/client';
import { TransferHeader } from '@/components/features/transfer/components/TransferHeader';
import { loadStripe } from '@stripe/stripe-js';
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from '@/lib/env';

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SummaryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recipient, setRecipient] = useState<Contact | null>(null);
  const [exchangeRate, setExchangeRate] = useState<{ rate: number, timestamp: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactList, setShowContactList] = useState(false);
  const [showAmountEdit, setShowAmountEdit] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editAmount, setEditAmount] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);

  const MIN_AMOUNT = 10;

  const amount = searchParams.get('amount');
  const recipientId = searchParams.get('recipient');
  const message = searchParams.get('message');
  const paymentMethod = searchParams.get('paymentMethod') || 'card';

  useEffect(() => {
    const loadData = async () => {
      if (!recipientId) {
        setError('No recipient specified');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let recipientData = null;
        let rateData = null;

        try {
          const recipientResponse = await fetch(`/api/contacts/${recipientId}`);
          if (recipientResponse.ok) {
            recipientData = await recipientResponse.json();
          } else {
            console.warn(`Failed to fetch recipient: ${recipientResponse.status}`);
            recipientData = {
              id: recipientId,
              name: 'Alaya',
              phoneNumber: '+46701234567',
              image: '/img/contact1.jpg',
              userId: 'demo-user',
              createdAt: new Date(),
              updatedAt: new Date(),
              email: null,
              phone: null,
              isDefault: false
            };
          }
        } catch (recipientError) {
          console.error('Error fetching recipient:', recipientError);
          recipientData = {
            id: recipientId,
            name: 'Alaya',
            phoneNumber: '+46701234567',
            image: '/img/contact1.jpg',
            userId: 'demo-user',
            createdAt: new Date(),
            updatedAt: new Date(),
            email: null,
            phone: null,
            isDefault: false
          };
        }

        try {
          const rateResponse = await fetch('/api/exchange-rate');
          if (rateResponse.ok) {
            rateData = await rateResponse.json();
          } else {
            console.warn(`Failed to fetch exchange rate: ${rateResponse.status}`);
            rateData = {
              rate: 300.25,
              timestamp: Date.now()
            };
          }
        } catch (rateError) {
          console.error('Error fetching exchange rate:', rateError);
          rateData = {
            rate: 300.25,
            timestamp: Date.now()
          };
        }

        setRecipient(recipientData);
        setExchangeRate(rateData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Kunde inte ladda nödvändig information');
      } finally {
        setIsLoading(false);
      }
    };

    const loadContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          console.warn(`Failed to fetch contacts: ${response.status}`);
          setContacts([
            {
              id: '1',
              name: 'Alaya',
              phoneNumber: '+46701234567',
              image: '/img/contact1.jpg',
              userId: 'demo-user',
              createdAt: new Date(),
              updatedAt: new Date(),
              email: null,
              phone: null,
              isDefault: false
            },
            {
              id: '2',
              name: 'Badeeda',
              phoneNumber: '+46701234568',
              image: '/img/contact2.jpg',
              userId: 'demo-user',
              createdAt: new Date(),
              updatedAt: new Date(),
              email: null,
              phone: null,
              isDefault: false
            },
            {
              id: '3',
              name: 'Abdullah',
              phoneNumber: '+46701234569',
              image: '/img/contact3.jpg',
              userId: 'demo-user',
              createdAt: new Date(),
              updatedAt: new Date(),
              email: null,
              phone: null,
              isDefault: false
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setContacts([
          {
            id: '1',
            name: 'Alaya',
            phoneNumber: '+46701234567',
            image: '/img/contact1.jpg',
            userId: 'demo-user',
            createdAt: new Date(),
            updatedAt: new Date(),
            email: null,
            phone: null,
            isDefault: false
          },
          {
            id: '2',
            name: 'Badeeda',
            phoneNumber: '+46701234568',
            image: '/img/contact2.jpg',
            userId: 'demo-user',
            createdAt: new Date(),
            updatedAt: new Date(),
            email: null,
            phone: null,
            isDefault: false
          },
          {
            id: '3',
            name: 'Abdullah',
            phoneNumber: '+46701234569',
            image: '/img/contact3.jpg',
            userId: 'demo-user',
            createdAt: new Date(),
            updatedAt: new Date(),
            email: null,
            phone: null,
            isDefault: false
          }
        ]);
      }
    };

    loadData();
    loadContacts();
  }, [recipientId]);

  useEffect(() => {
    if (amount) {
      setEditAmount(amount);
    }
  }, [amount]);

  const calculateReceivedAmount = () => {
    if (!amount || !exchangeRate) return 0;
    const result = parseFloat(amount) * exchangeRate.rate;
    return Math.round(result * 100) / 100;
  };

  const calculateFee = () => {
    return paymentMethod === 'business' ? 5 : 2;
  };

  const calculateTotalAmount = () => {
    if (!amount) return 0;
    return parseFloat(amount) + calculateFee();
  };

  const handleConfirm = async () => {
    try {
      let responseData;
      try {
        const response = await fetch('/api/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: calculateTotalAmount(),
            recipientId,
            message,
          }),
        });
        
        responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create checkout session');
        }
      } catch (fetchError) {
        console.error('API fetch error:', fetchError);
        throw new Error('Could not connect to payment service');
      }

      let stripe;
      try {
        stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }
      } catch (stripeError) {
        console.error('Stripe initialization error:', stripeError);
        throw new Error('Payment service unavailable');
      }

      try {
        const result = await stripe.redirectToCheckout({
          sessionId: responseData.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } catch (redirectError) {
        console.error('Redirect error:', redirectError);
        throw new Error('Could not redirect to payment page');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.push('/transfer')} className="text-blue-500">
          Return to transfer page
        </button>
      </div>
    );
  }

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
      
      <div className="p-6 relative z-[1] flex flex-col items-center">
        <div className="w-full max-w-[400px]">
          <TransferHeader title="Summary" />

          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-[24px] p-6 pb-[32px] border border-[#E4E4E4] w-full" data-component-name="SummaryContent">
              <h2 className="text-[18px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold mb-6">Transfer to</h2>

              {!showContactList ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-[48px] h-[48px] rounded-full overflow-hidden mr-4">
                      <Image
                        src={recipient?.image || '/img/default-avatar.png'}
                        alt={recipient?.name || 'Recipient'}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold">{recipient?.name}</p>
                      <p className="text-gray-600 text-sm">{recipient?.phoneNumber}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowContactList(true)}
                    className="px-[10px] py-[10px] rounded-full bg-[#333333] text-white text-[12px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full p-4 rounded-full bg-[#F5F5F5] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[14px] mb-4"
                  />
                  <div className="grid grid-cols-4 gap-4">
                    {contacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set('recipient', contact.id);
                          router.push(`/transfer/summary?${params.toString()}`);
                          setShowContactList(false);
                        }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-[64px] h-[64px] rounded-full overflow-hidden mb-2">
                          <Image
                            src={contact.image || '/img/default-avatar.png'}
                            alt={contact.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-center">{contact.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[24px] p-6 pb-[32px] border border-[#E4E4E4] w-full">
              <h2 className="text-[18px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold mb-4">Transfer amount details</h2>
              
              {!showAmountEdit ? (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[24px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal">€{amount}</p>
                    <button
                      onClick={() => setShowAmountEdit(true)}
                      className="w-[60px] p-[10px] rounded-full bg-[#333333] text-white text-[12px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-extrabold mb-2">
                    {recipient?.name} will receive: PKR {calculateReceivedAmount()}
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex flex-col space-y-4">
                    <div className="relative">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => {
                          setEditAmount(e.target.value);
                          setAmountError(null);
                        }}
                        className={`w-full p-4 rounded-full bg-[#F5F5F5] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[24px] pl-8 ${
                          amountError ? 'border-2 border-red-500' : ''
                        }`}
                        placeholder="Enter amount"
                        min={MIN_AMOUNT}
                      />
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[24px]">€</span>
                    </div>
                    {amountError && (
                      <p className="text-red-500 text-[12px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">{amountError}</p>
                    )}
                    <button
                      onClick={() => {
                        const newAmount = parseFloat(editAmount);
                        if (isNaN(newAmount) || newAmount < MIN_AMOUNT) {
                          setAmountError(`Minimum amount is €${MIN_AMOUNT}`);
                          return;
                        }
                        const params = new URLSearchParams(searchParams);
                        params.set('amount', editAmount);
                        router.push(`/transfer/summary?${params.toString()}`);
                        setShowAmountEdit(false);
                        setAmountError(null);
                      }}
                      className="w-full bg-[#7C1E1C] text-white py-4 rounded-full font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-semibold"
                    >
                      Save amount
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal text-gray-600">You'll Pay in Total:</span>
                  <span className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal">€{calculateTotalAmount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal text-gray-600">Card Fee:</span>
                  <span className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal">€{calculateFee()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal text-gray-600">FX Rate:</span>
                  <span className="text-[14px] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] font-normal">{exchangeRate?.rate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6">
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              className="h-[56px] rounded-full w-full max-w-[400px] transition-colors box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] text-[18px] font-medium bg-[#00BD5F] text-white"
              data-component-name="SummaryContent"
            >
              Proceed to payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryPage = () => {
  return (
    <Suspense fallback={
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
        
        <div className="p-6 relative z-[1]">
          <div className="max-w-md mx-auto">
            <TransferHeader title="Summary" />
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          </div>
        </div>
      </div>
    }>
      <SummaryContent />
    </Suspense>
  );
};

export default SummaryPage;
