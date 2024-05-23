"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHome,
  FiFolder,
  FiVideo,
  FiCodesandbox,
  FiTrash2,
  FiLogOut,
  FiPaperclip,
  FiShare2
} from "react-icons/fi";
import StorageBar from "./StorageBar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCapacity } from "../lib/apiCall";

const SideBar: React.FC = () => {
  const router = useRouter();
  const clearCookies = () =>
    document.cookie
      .split(";")
      .forEach(
        (c) =>
        (document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()}; path=/`)),
      );
  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");
    // console.log(userId);
    const response = await axios.get(
      `http://localhost:8888/api/auth/logout/${userId}`,
    );
    // console.log(response.data);
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("storageID");
    localStorage.removeItem("folderId");
    localStorage.removeItem("parentFolder");
    clearCookies();
  };

  const navItems = [
    { name: "Home", path: "/", icon: FiHome, onClick: () => { } },
    { name: "Files", path: "/dashboard", icon: FiFolder, onClick: () => { } },
    { name: "Share", path: "/shareFolder", icon: FiShare2, onClick: () => { } },
    {
      name: "IntelliBot",
      path: "/intelliBot",
      icon: FiCodesandbox,
      onClick: () => { },
    },
    { name: "Meeting", path: "/meet", icon: FiVideo, onClick: () => { } },
    { name: "Notes", path: "/note", icon: FiPaperclip, onClick: () => { } },
    { name: "Bin", path: "/recyclebin", icon: FiTrash2, onClick: () => { } },
    {
      name: "Logout",
      path: "/",
      icon: FiLogOut,
      onClick: () => {
        // console.log("logout");
        handleLogout();
      },
    },
  ];

  const [open, setOpen] = useState(false);

  const [used, setUsed] = useState(0);
  const [total, setTotal] = useState(0);

  const handleStorageUsed = async () => {
    const storageId = localStorage.getItem("storageID");

    const storageUsed = await getCapacity(storageId);
    // console.log(storageUsed)
    setUsed(storageUsed.storage.currentStorage);
    setTotal(storageUsed.storage.maxStorage);

  };

  useEffect(() => {
    handleStorageUsed();
  }, []);

  return (
    <div
      className={`${open ? "w-60" : "w-24 p-2"
        } z-10 flex-col shadow-xl backdrop-blur-2xl transition-all duration-300 p-5 pt-8 h-dvh`}
    >
      <div className="h-full overflow-y-auto lg:block">
        <img
          src="/control.png"
          className={`absolute cursor-pointer rounded-full -right-3 top-9 w-6 transition duration-200 transform hover:scale-110
          ${!open && "rotate-180"}`}
          alt="control_icon"
          onClick={() => setOpen(!open)}
        />

        <div className="flex flex-shrink-0 space-x-2">
          <a href="/">
            <Image
              src="/IntelliSpace.png"
              alt="logo"
              width={30}
              height={30}
              className={`cursor-pointer ml-3 transition-full
            ${!open && ""}`}
            />
          </a>
          <span
            className={`text-xl font-bold ml-2 flex-shrink-0 flex ${!open && "hidden"
              }`}
          >
            IntelliDrive
          </span>
        </div>

        <div className="p-4 space-y-2 overflow-hidden">
          {navItems.map((item, index) => (
            <Link key={index} href={item.path}>
              <div className="flex items-center p-4 mt-2.5 transition duration-100 ease-linear transform rounded-lg cursor-pointer focus:bg-slate-50 focus:outline-none active:bg-slate-50 hover:text-white focus:bg-white/10 active:bg-white/10 w-fit ">
                <div
                  className={`${!open ? "w-full flex justify-center" : ""
                    } transition-all duration-100`}
                >
                  <item.icon
                    className={`${!open ? "w-6 h-6 cursor-pointer flex justify-center " : ""
                      } transition-all duration-100 w-6 h-6 -ml-4`}
                    onClick={item.onClick}
                  />
                </div>
                <span
                  className={`${!open && "hidden"
                    } relative pl-3 font-semibold duration-100 after:block after:content-[''] after:absolute after:h-[3px] after:bg-purple-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-center`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          ))}

          <div className={`${!open && "w-full "} duration-200`}>
            <StorageBar used={used} total={total} open={open} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
