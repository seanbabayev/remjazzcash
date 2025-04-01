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
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : getPublicEnvVar('NEXT_PUBLIC_BASE_URL', 'https://remeasypaisa.vercel.app');

// Server-side only
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
