"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiFolder, FiUsers, FiStar, FiInbox, FiTrash2 } from "react-icons/fi";
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Files', path: '/drive', icon: FiFolder },
    { name: 'Shared', path: '/shared', icon: FiUsers },
    { name: 'Starred', path: '/starred', icon: FiStar },
    { name: 'Spam', path: '/spam', icon: FiInbox },
    { name: 'Bin', path: '/bin', icon: FiTrash2 },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div

      className={`${open ? "w-60" : "w-20"
        }  z-10 flex-col h-screen text-gray-700 shadow-xl backdrop-blur-2xl transition-all duration-500 p-5 pt-8`}
    >
      <div className="h-full overflow-y-auto lg:block">

        <img
          src="/control.png"
          className={`absolute cursor-pointer rounded-full -right-3 top-7 w-7 border-2 border-white transition duration-200 transform hover:scale-110
          ${!open && "rotate-180"}`}
          alt="control_icon"
          onClick={() => setOpen(!open)}
        />

        <div className="flex space-x-2 transition">
          <Link href="/" >
            <Image src="/IntelliSpace.png" alt="logo" width={30} height={30} className={`cursor-pointer duration-200 hoverScale
            ${open && "rotate-[360deg]"}`} />
          </Link>
          <span className={`text-2xl font-bold transition duration-200 ${!open && "hidden transition"
            }`}>IntelliDrive</span>
        </div>

        <div className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 mt-8 transition duration-200 ease-linear transform rounded-lg cursor-pointer hover:bg-white-100 focus:bg-slate-50 focus:outline-none active:bg-slate-50 hover:text-white hover:bg-white/10 focus:bg-white/10 active:bg-white/10 w-fit"
            >
              <div
                className={`${!open ? "w-full flex justify-center" : ""
                  } transition-all duration-200`}
              >
                <item.icon className="w-6 h-6 text-gray-500 cursor-pointer" />
              </div>
              <Link href={item.path}>
                <span
                  className={`${!open && "hidden"
                    } relative pl-3 duration-200 after:block after:content-[''] after:absolute after:h-[3px] after:bg-purple-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center`}
                >
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
