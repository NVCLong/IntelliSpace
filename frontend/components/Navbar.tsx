"use client";
import { useState } from "react";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              className="font-medium ml-10 px-6 py-2 rounded-lg text-xl text-neutral-700 flexCenter cursor-pointer pb-1.5 hover:bg-purple-200 transition hover:font-bold hover:scale-110"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden hoverScale lg:flexCenter" onClick={handleSignin}>
        <Button
          type="button"
          title="Login"
          icon="user-solid.svg"
          variant="btn_dark"
        />
      </div>

      <div
        className="relative inline-block cursor-pointer lg:hidden hoverScale"
        onClick={toggleMenu}
      >
        <Image src="menu-dots.svg" alt="menu" width={32} height={32} />
      </div>
    </motion.nav>
  );
};

export default Navbar;
