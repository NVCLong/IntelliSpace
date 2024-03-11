"use client";
import { useState } from "react";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignin = () => {
    const router = useRouter();
    router.push("/signin");
  };

  return (
    <nav className="relative z-30 py-5 flexBetween max-container padding-container">
      <Link href="/">
        <Image src="/IntelliSpace.png" alt="logo" width={40} height={40} />
      </Link>

      <div
        className={`absolute right-5 mt-36 transform translate-x-2 lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="p-4 text-black bg-white rounded shadow-lg">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link href={link.href} className="block py-2 hover:bg-gray-200">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <Link
              href={link.href}
              className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden lg:flexCenter" onClick={handleSignin}>
        <Button
          type="button"
          title="Login"
          icon="user-solid.svg"
          variant="btn_dark_green"
        />
      </div>

      <div
        className="relative inline-block cursor-pointer lg:hidden"
        onClick={toggleMenu}
      >
        <Image src="menu-dots.svg" alt="menu" width={32} height={32} />
      </div>
    </nav>
  );
};

export default Navbar;
