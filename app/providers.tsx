'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/shared/components/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
  session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </SessionProvider>
  );
}
