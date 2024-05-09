import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OTP | IntelliSpace",
  description: "OTP to reset your password.",
};

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NextTopLoader color="#BF40BF" showSpinner={false} easing="ease" />
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default RegisterLayout;
