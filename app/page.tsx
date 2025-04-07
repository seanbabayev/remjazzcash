import { redirect } from 'next/navigation';

export default function Home() {
  // I demo-versionen omdirigerar vi alltid till dashboard
  redirect('/dashboard');
}
