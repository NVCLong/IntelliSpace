'use client';
import React, { useState } from 'react';
import { NAV_LINKS } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMenu, FiUser } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import TopLoader from '@/components/TopLoader';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();
  const handleSignin = () => {
    setIsLoading(true);
    router.push('/signin');
    setIsLoading(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-30 w-screen py-1.5 shadow-md flexBetween padding-container backdrop-blur-md "
    >
      <Link href="/" className="hoverScale">
        <Image
          src="/IntelliSpace.png"
          alt="logo"
          width={30}
          height={30}
          priority
        />
      </Link>

      <ul className="hidden h-full space-x-14 sm:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className="relative font-semibold text-xl text-neutral-600 cursor-pointer transition hover:text-gray-900 duration-200 after:block after:content-[''] after:absolute after:h-[3px] after:bg-gray-900 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-center"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div
        className="hidden gap-2 px-4 py-2 bg-blue-300/90 rounded-full cursor-pointer hover:bg-blue-400 lg:flex md:flex sm:hidden hoverScale drop-shadow-md flexCenter bold-16"
        onClick={handleSignin}
      >
        {isLoading ? (
          <TopLoader />
        ) : (
          <>
            <div className="text-white fill-current">
              <FiUser size={20} />
            </div>
            <span className="font-semibold text-white sm:block">Login</span>
          </>
        )}
      </div>

      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={toggleMenu}>
            <Button variant="destructive">
              <FiMenu size={40} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem
                key={link.key}
                className="text-lg font-semibold bg-white flexCenter hover:bg-blue-300"
              >
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  );
};

export default NavBar;
