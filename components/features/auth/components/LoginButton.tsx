'use client';

import { useState } from 'react';
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

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Rensa eventuella kvarvarande sessionsdata
      // Detta kan hjälpa till att undvika problem med redirect_uri_mismatch
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
      
      const result = await signIn(provider, {
        callbackUrl: absoluteCallbackUrl,
        redirect: true, // Aktivera automatisk redirect för att låta NextAuth hantera redirects
      });
      
      // Denna kod körs bara om redirect: false används ovan
      if (result?.error) {
        setError(result.error);
        console.error('Sign in error:', result.error);
      } else if (result?.url) {
        // Manuell redirect efter framgångsrik inloggning
        console.log('Manual redirect to:', result.url);
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Ett oväntat fel uppstod vid inloggning');
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
