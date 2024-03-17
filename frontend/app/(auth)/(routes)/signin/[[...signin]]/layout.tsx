import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Sign in | IntelliSpace",
  description: "Sign in to your IntelliSpace account",
};

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <NextTopLoader color="#000" showSpinner={false} />
      {children}
      <Footer />
    </>
  );
};

export default SignInLayout;
