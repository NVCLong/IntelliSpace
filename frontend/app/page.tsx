"use client"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { NextUIProvider } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";


export default function Home() {
  return (
    <NextUIProvider>
      <div>
        <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="flex flex-col items-center space-y-5 mb-36"
        >
          <Link
            href="/"
            className="mt-24 hoverScale animate-fade-right animate-once animate-delay-300 animate-ease-in-out"
          >
            <Image
              src="/IntelliSpace.png"
              alt="logo"
              width={100}
              height={100}
            />
          </Link>
          <h1 className="text-lg font-medium sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ">
            Welcome to
          </h1>
          <h1 className="text-3xl font-black sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            IntelliSpace
          </h1>
          <p className="text-center text-md sm:text-base md:text-lg lg:text-xl text-balance">
            IntelliSpace provides a secure platform
            <br /> to store and manage your data, meeting notes, and other
            information.
          </p>
          <Button className="shadow-lg animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out text-md">
            <ChevronRight className="mr-2 w-7 h-7" /> Getting started
          </Button>
        </motion.div>
        <Footer />
      </div>
    </NextUIProvider>
  );

}

