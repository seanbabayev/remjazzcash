'use client';

import { useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { LoginButtonProps } from '../types/auth-types';
import { useApi } from '@/lib/hooks/useApi';
import { API_ENDPOINTS } from '@/lib/constants';
import styles from './LoginButton.module.css';

const LoginButton: React.FC<LoginButtonProps> = ({ 
  provider = 'google',
  callbackUrl = '/dashboard',
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { execute } = useApi();
  
  // Rensa eventuella felmeddelanden när komponenten monteras
  useEffect(() => {
    // Kontrollera om det finns felparametrar i URL:en
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      console.log('Error parameter detected in URL:', errorParam);
      setError(`Inloggningsfel: ${errorParam}`);
      
      // Ta bort felparametern från URL:en för att undvika problem vid upprepad inloggning
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Rensa eventuella kvarvarande sessionsdata
      try {
        await signOut({ redirect: false });
        console.log('Signed out before signing in to clear session');
      } catch (e) {
        console.log('No active session to sign out from');
      }
      
      // Använd absolut URL för callback
      const absoluteCallbackUrl = callbackUrl.startsWith('http') 
        ? callbackUrl 
        : `${window.location.origin}${callbackUrl}`;
      
      // Logga mer information för felsökning
      console.log('Device info:', {
        userAgent: window.navigator.userAgent,
        platform: window.navigator.platform,
        vendor: window.navigator.vendor
      });
      console.log('Window location:', {
        origin: window.location.origin,
        href: window.location.href,
        host: window.location.host
      });
      console.log('Signing in with callback URL:', absoluteCallbackUrl);
      
      // Försök inloggning med timeout för att hantera hängande anrop
      const loginPromise = signIn(provider, {
        callbackUrl: absoluteCallbackUrl,
        redirect: true, // Aktivera automatisk redirect för att låta NextAuth hantera redirects
      });
      
      // Sätt en timeout för att hantera hängande anrop
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Inloggningen tog för lång tid')), 15000);
      });
      
      // Använd Promise.race för att hantera timeout
      await Promise.race([loginPromise, timeoutPromise]);
      
      // Denna kod körs bara om redirect: false används ovan
      // eller om Promise.race returnerar loginPromise före timeout
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Ett oväntat fel uppstod vid inloggning. Försök igen.');
      
      // Försök att omdirigera till dashboard vid fel
      setTimeout(() => {
        window.location.href = `${window.location.origin}/dashboard`;
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className={`${styles.gsiButton} ${className || ''}`}
      disabled={isLoading}
      type="button"
      {...props}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.icon}></div>
        <span className={styles.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </span>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </button>
  );
};

export default LoginButton;
