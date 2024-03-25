"use client"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="flex flex-col items-center">
        <Link href="/" className="mt-24 mb-8 hoverScale">
          <Image src="/IntelliSpace.png" alt="logo" width={100} height={100} />
        </Link>
        <h1 className="text-xl font-medium sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Welcome to</h1>
        <h1 className="text-3xl font-black sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">IntelliSpace</h1>
        <p className="mt-3 text-sm sm:text-base md:text-lg lg:text-xl mb-60">
          IntelliSpace is a platform to store data, meeting notes, and other...
        </p>
      </motion.div>
      <Footer />
    </div>
  )
}
