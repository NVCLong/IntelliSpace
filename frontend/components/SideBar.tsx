'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiBookmark,
  FiCodesandbox,
  FiFolder,
  FiHome,
  FiLogOut,
  FiShare2,
  FiTrash2,
  FiVideo,
} from 'react-icons/fi';
import StorageBar from './StorageBar';
import { useRouter } from 'next/navigation';
import { getCapacity } from '@/lib/apiCall';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';

const SideBar: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [used, setUsed] = useState(0);
  const [total, setTotal] = useState(0);
  const clearCookies = () =>
    document.cookie
      .split(';')
      .forEach(
        (c) =>
          (document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date().toUTCString()}; path=/`)),
      );

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: FiHome,
      onClick: () => {},
    },
    {
      name: 'Files',
      path: '/dashboard',
      icon: FiFolder,
      onClick: () => {},
    },
    {
      name: 'Share',
      path: '/shareFolder',
      icon: FiShare2,
      onClick: () => {},
    },
    {
      name: 'IntelliBot',
      path: '/intellibot',
      icon: FiCodesandbox,
      onClick: () => {},
    },
    {
      name: 'Meeting',
      path: '/intelliMeetHome',
      icon: FiVideo,
      onClick: () => {},
    },
    {
      name: 'Notes',
      path: '/note',
      icon: FiBookmark,
      onClick: () => {},
    },
    {
      name: 'Bin',
      path: '/recyclebin',
      icon: FiTrash2,
      onClick: () => {},
    },
    {
      name: 'Logout',
      path: '',
      icon: FiLogOut,
      onClick: () => {
        onOpen();
      },
    },
  ];

  const handleLogout = async () => {
    const userId = localStorage.getItem('userId');
    // console.log(userId);
    const response = await axios.get(
      `https://intelli-space-v1.azurewebsites.net/api/auth/logout/${userId}`,
    );
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('storageID');
    localStorage.removeItem('folderId');
    localStorage.removeItem('parentFolder');
    clearCookies();
    router.push('/');
  };

  const handleStorageUsed = async () => {
    const storageId = localStorage.getItem('storageID');

    const storageUsed = await getCapacity(storageId);
    // console.log(storageUsed)
    setUsed(storageUsed.storage.currentStorage);
    setTotal(storageUsed.storage.maxStorage);
  };

  useEffect(() => {
    handleStorageUsed();
  }, []);

  return (
    <div className="mr-28">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flexCenter flex-col gap-1">
                Are you sure you want to logout?
              </ModalHeader>
              <ModalFooter className="flexCenter">
                <Button
                  className="bg-red-500 text-white font-medium"
                  onPress={handleLogout}
                >
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div
        className={`${
          open ? 'w-60' : 'w-20 p-2 flexCenter'
        } z-50 flex-col shadow-2xl backdrop-blur-xl transition-all duration-400 py-5 h-screen fixed`}
      >
        <div className="h-full overflow-y-auto lg:block mt-3">
          <img
            src="/control.png"
            className={`absolute cursor-pointer rounded-full -right-3 top-9 w-6 transition duration-200 transform hover:scale-110
          ${!open && 'rotate-180'}`}
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
                className={`cursor-pointer ml-7 transition-full
            ${!open && ''}`}
              />
            </a>
            <span
              className={`text-xl font-bold ml-2 flex-shrink-0 flex ${
                !open && 'hidden'
              }`}
            >
              IntelliDrive
            </span>
          </div>

          <div className="px-4 space-y-2 overflow-hidden mt-5">
            {navItems.map((item, index) => (
              <Link key={index} href={item.path}>
                <div
                  className="flex items-center p-4 mt-2.5 transition duration-100 ease-linear transform rounded-lg cursor-pointer focus:bg-slate-50 focus:outline-none active:bg-slate-50 hover:text-white focus:bg-white/10 active:bg-white/10 "
                  onClick={item.onClick}
                >
                  <div
                    className={`${
                      !open ? 'w-full flex justify-center' : ''
                    } transition-all duration-100`}
                  >
                    <item.icon
                      className={`${
                        !open
                          ? 'w-6 h-6 cursor-pointer flex justify-center '
                          : ''
                      } transition-all duration-100 w-6 h-6 `}
                    />
                  </div>
                  <span
                    className={`${
                      !open && 'hidden'
                    } relative pl-3 font-semibold duration-100 after:block after:content-[''] after:absolute after:h-[3px] after:bg-purple-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-200 after:origin-center`}
                  >
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}

            <div className={`${!open && 'w-full '} duration-200`}>
              <StorageBar used={used} total={total} open={open} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
