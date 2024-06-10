'use client';
import Chat from '@/components/Chat';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      router.push('/');
    }
  }, []);
  return (
    <>
      <Chat />
    </>
  );
}
