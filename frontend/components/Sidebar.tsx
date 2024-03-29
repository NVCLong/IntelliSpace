"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiFolder, FiUsers, FiStar, FiInbox, FiTrash2 } from "react-icons/fi";
import StorageBar from './StorageBar';

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

      className={`${open ? "w-60" : "w-24 p-2"
        } z-10 flex-col h-screen shadow-xl backdrop-blur-2xl transition-all duration-300 p-5 pt-8`}
    >
      <div className="h-full overflow-y-auto lg:block">

        <img
          src="/control.png"
          className={`absolute cursor-pointer rounded-full -right-3 top-9 w-6 transition duration-200 transform hover:scale-110
          ${!open && "rotate-180"}`}
          alt="control_icon"
          onClick={() => setOpen(!open)}
        />

        <div className="flex space-x-2">
          <Link href="/" >
            <Image src="/IntelliSpace.png" alt="logo" width={30} height={30} className={`cursor-pointer ml-3 w-8 h-8
            ${!open && ""}`} />
          </Link>
          <span className={`text-2xl font-bold ${!open && "hidden"
            }`}>IntelliDrive</span>
        </div>

        <div className="p-4 space-y-2 overflow-hidden">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 mt-8 transition duration-100 ease-linear transform rounded-lg cursor-pointer focus:bg-slate-50 focus:outline-none active:bg-slate-50 hover:text-white focus:bg-white/10 active:bg-white/10 w-fit"
            >
              <div
                className={`${!open ? "w-full flex justify-center" : ""
                  } transition-all duration-100`}
              >
                <item.icon className={`${!open ? "w-6 h-6 cursor-pointer flex justify-center " : ""
                  } transition-all duration-200 w-6 h-6 -ml-4`} />
              </div>
              <Link href={item.path}>
                <span
                  className={`${!open && "hidden"
                    } relative pl-3 duration-200 after:block after:content-[''] after:absolute after:h-[3px] after:bg-purple-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-center`}
                >
                  {item.name}
                </span>
              </Link>
            </div>
          ))}

          <div className={`${!open && "w-full"
            } duration-200 `}>
            <StorageBar used={20} total={100} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
