'use client';
import React, { useEffect, useState } from 'react';
import { deletedFile } from '@/lib/apiCall';
import dynamic from 'next/dynamic';
import BarLoader from 'react-spinners/BarLoader';
import { useRouter } from 'next/navigation';
import { FiTrash } from 'react-icons/fi';

const DynamicFileList = dynamic(
  () => import('@/components/listDeleted/FileList'),
  { ssr: false },
);

export default function Page() {
  const router = useRouter();
  const [fetchedFileList, setFetchedFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ message: '' });

  const handleFetchData = async (storageID_temp: string | null) => {
    setIsLoading(true);
    setError({ message: '' });

    try {
      if (!storageID_temp) {
        throw new Error('storageID_temp is not available');
      }

      const response = await deletedFile(storageID_temp);

      if (response !== null) {
        if (Array.isArray(response)) {
          // @ts-ignore
          setFetchedFileList(response);
        } else {
          throw new Error('Response from deletedFile is not an array');
        }
      } else {
        throw new Error('Response from deletedFile is null');
      }
    } catch (error) {
      // @ts-ignore
      setError({ message: error.message });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let storageID_temp: string | null = null;
    // console.log(typeof window)
    if (typeof window !== 'undefined') {
      storageID_temp = localStorage.getItem('storageID') || '';
    }

    // @ts-ignore
    if (storageID_temp == null) {
      setError({ message: 'storageID_temp is not available' });
      setIsLoading(false);
      return;
    }
    handleFetchData(storageID_temp);
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flexCenter drop-shadow-md">
        <BarLoader
          color="#1351ae"
          height={8}
          loading
          speedMultiplier={1}
          width={200}
        />
      </div>
    );
  }


  if (error.message) {
    return (
      <div className="h-screen mx-auto flexCenter">Error: {error.message}</div>
    );
  }
  return (
    <>
      {fetchedFileList.length <= 0 && (
        <div className="flex-col h-screen mx-auto space-y-4 flexCenter">
          <FiTrash size={50} />
          <p className="text-xl">Recycle bin is empty</p>
        </div>
      )}

      {fetchedFileList.length > 0 && (
        <DynamicFileList files={fetchedFileList} />
      )}
    </>
  );
}
