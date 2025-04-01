import { ButtonHTMLAttributes } from 'react';

export interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  callbackUrl?: string;
  provider?: 'google' | 'github';
  className?: string;
}

export interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  callbackUrl?: string;
  className?: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}
