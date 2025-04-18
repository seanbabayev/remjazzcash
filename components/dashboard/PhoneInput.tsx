'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "@/styles/shiny-button.css";

type VerificationStep = 
  | 'idle'
  | 'verifying_phone'
  | 'fetching_beneficiary'
  | 'checking_limits'
  | 'preparing_transfer';

export default function PhoneInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('idle');
  const router = useRouter();

  useEffect(() => {
    if (phoneNumber === '') {
      setIsValid(null);
      return;
    }

    const timer = setTimeout(() => {
      // Tillåt + i början av numret
      const phoneNumberPattern = /^\+?[0-9]{10,15}$/;
      const valid = phoneNumberPattern.test(phoneNumber);
      setIsValid(valid);
    }, 500);

    return () => clearTimeout(timer);
  }, [phoneNumber]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Tillåt endast + i början och siffror
    if (value === '' || value === '+' || /^\+?\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const getButtonStyles = () => {
    if (isLoading) {
      return {
        backgroundColor: '#00BD5F',
        cursor: 'wait',
        color: '#1B1B1B',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      };
    }
    if (phoneNumber === '') {
      return {
        backgroundColor: '#E4E4E4',
        cursor: 'not-allowed',
        color: 'rgba(27,27,27,0.5)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      };
    } else if (isValid === false) {
      return {
        backgroundColor: '#ff6b6b',
        cursor: 'not-allowed',
        color: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      };
    } else if (isValid === true) {
      return {
        backgroundColor: '#7BCDC9',
        cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      };
    } else {
      return {
        backgroundColor: '#E4E4E4',
        cursor: 'not-allowed',
        color: 'rgba(27,27,27,0.5)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      };
    }
  };

  const getVerificationMessage = () => {
    switch (verificationStep) {
      case 'verifying_phone':
        return 'Verifying phone number...';
      case 'fetching_beneficiary':
        return 'Fetching beneficiary info...';
      case 'checking_limits':
        return 'Checking transfer limits...';
      case 'preparing_transfer':
        return 'Preparing transfer...';
      default:
        return isValid === false && phoneNumber !== '' 
          ? 'Minimum 10 digits' 
          : 'Continue to the amount';
    }
  };

  const handleContinue = async () => {
    if (isValid) {
      try {
        setIsLoading(true);
        
        // Simulera verifieringssteg
        setVerificationStep('verifying_phone');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setVerificationStep('fetching_beneficiary');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setVerificationStep('checking_limits');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setVerificationStep('preparing_transfer');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Spara verifierat nummer
        localStorage.setItem('verifiedPhoneNumber', phoneNumber);
        
        // Navigera direkt med telefonnumret
        router.push(`/transfer?phone=${encodeURIComponent(phoneNumber)}`);
      } catch (error) {
        console.error('Error during verification:', error);
      } finally {
        setIsLoading(false);
        setVerificationStep('idle');
      }
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black transition-all duration-300 ease-in-out z-10"
        style={{ 
          opacity: isLoading ? 0.7 : 0,
          pointerEvents: 'none',
          visibility: isLoading ? 'visible' : 'hidden'
        }}
      />
      <div className={`relative ${isLoading ? 'z-20' : ''}`}>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="h-[48px] border rounded-[99px] px-4 mt-4 w-full box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]"
          style={{
            borderColor: isValid === false ? '#ff6b6b' : '#E7ECF0',
          }}
        />
        <button
          onClick={handleContinue}
          disabled={!isValid || isLoading}
          className={`h-[48px] rounded-[99px] px-4 mt-4 w-full transition-colors box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] ${isLoading ? 'shiny-button' : ''}`}
          style={{
            ...getButtonStyles(),
            opacity: isLoading ? 1 : undefined,
            cursor: isLoading ? 'wait' : (isValid ? 'pointer' : 'not-allowed'),
            ...(isValid === true && !isLoading ? { color: '#322D3C' } : {}),
          }}
        >
          <span>
            {getVerificationMessage()}
          </span>
        </button>
      </div>
    </>
  );
}
