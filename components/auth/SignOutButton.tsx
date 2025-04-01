'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="px-6 py-3 bg-[#DC3545] text-white font-medium rounded-full hover:bg-[#C82333] transition-colors"
    >
      Sign Out
    </button>
  );
}
