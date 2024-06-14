'use client';
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay: 1,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="flexCenter mt-24 sm:mt-0"
    >
      <div className="padding-container max-container flex w-full flex-col gap-5">
        <div className="flex flex-col items-start justify-center gap-[10%] sm:flex-row">
          <Link href="/" className="mb-3">
            <Image src="/IntelliSpace.png" alt="logo" width={74} height={74} />
          </Link>

          <div className="flex flex-row flex-wrap space-x-16">
            {FOOTER_LINKS.map((columns, index) => (
              <FooterColumn title={columns.title} key={index}>
                <ul className="flex flex-col gap-2 sm:gap-4 regular-14 text-gray-30">
                  {columns.links.map((link, linkIndex) => (
                    <Link href="/" key={linkIndex}>
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}
            <div className="flex sm:flex-col flex-row gap-5 ">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link
                    href="/"
                    key={link.label}
                    className="flex gap-2 flex-col sm:flex-row"
                  >
                    <p className="whitespace-nowrap">{link.label}:</p>
                    <p className="font-medium whitespace-nowrap text-blue-70">
                      {link.value}
                    </p>
                  </Link>
                ))}
              </FooterColumn>
            </div>

            <div className=" gap-5 ">
              <FooterColumn title={SOCIALS.title}>
                <ul className="flex gap-4 regular-14 text-gray-30">
                  {SOCIALS.links.map((link, index) => (
                    <Link href={SOCIALS.href[index]} key={link}>
                      <Image src={link} alt="logo" width="25" height="25" />
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>

        <p className="w-full font-medium text-center text-gray-30">
          © 2024 IntelliSpace | All rights reserved
        </p>
      </div>
    </motion.footer>
  );
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>
      {children}
    </div>
  );
};

export default Footer;
