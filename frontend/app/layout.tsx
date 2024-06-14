import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/lib/Provider';

import TopLoader from '@/components/TopLoader';
import React from 'react';

export const metadata: Metadata = {
  title: 'IntelliSpace | WAD Project',
  description:
    'IntelliSpace is a web application. It is a project for the Web Application Development course at the HCMIU.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth mdl-js">
      <body>
        <TopLoader />
        <div className="bg-[#4cbcd831] absolute -z-10 top-[-6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem]"></div>
        <div className="bg-[#6285c25b] absolute -z-10 top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
        <main>
          <ReduxProvider>{children}</ReduxProvider>
        </main>
      </body>
    </html>
  );
}
