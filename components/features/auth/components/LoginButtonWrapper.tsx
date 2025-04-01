'use client';

import dynamic from 'next/dynamic';

const LoginButton = dynamic(() => import('./LoginButton'), {
  ssr: false // Detta förhindrar server-rendering av komponenten
});

export default function LoginButtonWrapper(props: any) {
  return <LoginButton {...props} />;
}
