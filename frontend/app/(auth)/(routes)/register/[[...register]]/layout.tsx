import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Register | IntelliSpace",
  description: "Register for an account on IntelliSpace.",
};

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NextTopLoader color="#000" showSpinner={false} />
      {children}
    </>
  );
};

export default RegisterLayout;
