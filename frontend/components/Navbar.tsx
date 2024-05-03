"use client";
import { useState } from "react";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMenu } from "react-icons/fi";
import NextTopLoader from "nextjs-toploader";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();
  const handleSignin = () => {
    router.push("/signin");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-30 w-screen py-1.5 shadow-md flexBetween padding-container backdrop-blur-md "
    >
      <Link href="/" className="hoverScale">
        <Image src="/IntelliSpace.png" alt="logo" width={40} height={40} />
      </Link>

      <div
        className={`absolute right-5 mt-36 transform translate-x-2 lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col items-center p-4 mt-24 text-black bg-white rounded-md shadow-lg">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="block p-6 py-2 transition rounded-md hover:bg-purple-200 hover:font-bold hover:scale-110"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul className="hidden h-full gap-12 lg:flex" id="navBarFull">
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className="relative font-semibold ml-10 px-6 py-2 rounded-md text-xl text-neutral-600 flex cursor-pointer pb-1.5 transition hover:text-gray-900 duration-200 after:block after:content-[''] after:absolute after:h-[3px] after:bg-gray-900 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-center"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div
        className="hidden gap-2 px-4 py-2 bg-blue-400 rounded-full cursor-pointer lg:flex md:flex sm:hidden hoverScale drop-shadow-md flexCenter bold-16 "
        onClick={handleSignin}
      >
        {isLoading && (
          <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
        )}
        <div className="text-white fill-current ">
          <FiUser size={20} />
        </div>
        <span className="font-semibold text-white md:block">Login</span>
      </div>

      <div
        className="relative inline-block p-1 bg-blue-400 rounded-md shadow lg:hidden drop-shadow-xl"
        onClick={toggleMenu}
      >
        <div className="text-white cursor-pointer fill-current hover:text-gray-300">
          <FiMenu size={40} />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
