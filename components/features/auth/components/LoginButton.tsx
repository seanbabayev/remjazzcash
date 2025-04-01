'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
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
  const { execute } = useApi();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error('Sign in error:', error);
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
    </button>
  );
};

export default LoginButton;
