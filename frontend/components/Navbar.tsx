import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="relative py-5 border-2 border-red-500 flexBetween max-container padding-container z-300">
      <Link href="/">Home</Link>
    </nav>
  );
};

export default Navbar;
