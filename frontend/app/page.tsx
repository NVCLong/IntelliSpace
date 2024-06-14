'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import TopLoader from '@/components/TopLoader';
import { NextUIProvider } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const handleSignin = () => {
    router.push('/signin');
  };
  useEffect(() => {
    let userId;
    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('userId');
    }
    if (userId !== null) {
      router.push('/dashboard');
    }
  }, []);
  return (
    <NextUIProvider>
      <div className="flex flex-col min-h-screen">
        <TopLoader />
        <NavBar />
        <div className="flex-grow flexCenter flex-col h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="flexCenter flex-col space-y-5 mt-10 sm:mt-10"
          >
            <Link
              href="/"
              className="hoverScale animate-fade-right animate-once animate-delay-300 animate-ease-in-out"
            >
              <Image
                src="/IntelliSpace.png"
                alt="logo"
                width={100}
                height={100}
                priority
              />
            </Link>
            <h1 className="text-lg font-medium sm:text-3xl">Welcome to</h1>
            <h1 className="text-3xl font-black sm:text-5xl">IntelliSpace</h1>
            <p className="text-center text-md sm:text-base text-balance px-4 sm:px-0">
              IntelliSpace provides a secure platform
              <br /> to store and manage your data, meeting notes, and other
              information.
            </p>
            <Button
              className="bg-blue-300/90 mx-auto shadow-lg w-46 mt-7 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out text-md hover:bg-blue-400"
              onClick={handleSignin}
            >
              <FiChevronRight className="mr-2" />
              Getting started
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    </NextUIProvider>
  );
}
