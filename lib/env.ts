// Klientsidan kan bara komma åt NEXT_PUBLIC_ variabler

// Serversidan kan komma åt alla variabler
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value;
}

export function getPublicEnvVar(key: string, defaultValue?: string): string {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Public env var must start with NEXT_PUBLIC_: ${key}`);
  }
  
  return getEnvVar(key, defaultValue);
}

// Client-side safe
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Använd window.location.origin om tillgängligt, annars fallback till default
export const NEXT_PUBLIC_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NODE_ENV === 'production'
    ? 'https://remjazzcash.vercel.app'
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Server-side only
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Specifik URL för Stripe-återdirigeringar - använd samma logik som NEXT_PUBLIC_BASE_URL
export const STRIPE_REDIRECT_URL = typeof window !== 'undefined'
  ? window.location.origin
  : process.env.NODE_ENV === 'production'
    ? 'https://remjazzcash.vercel.app'
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
