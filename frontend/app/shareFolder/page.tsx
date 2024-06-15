'use client';
import { useEffect, useState } from 'react';
import FileList from '@/components/sharedList/FileList';
import FolderList from '@/components/sharedList/FolderList';
import { Spinner } from '@nextui-org/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { getSharedFolder } from '@/lib/apiCall';
import { useRouter } from 'next/navigation';
import { FiClipboard } from 'react-icons/fi';

export default function Page() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [folderList, setFolderList] = useState([]);
  const [parentFolder, setParentFolder] = useState({ parentFolderId: '' });
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // @ts-ignore
  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };
  const handleAccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSharedFolder(code);

      setFolderList(response.subFolders);

      // Handle potentially empty files array gracefully
      setFileList(response.files || []);

      setParentFolder({ parentFolderId: response.parentFolder.id });
    } catch (error) {
      // @ts-ignore
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window != 'undefined') {
      let userId = localStorage.getItem('userId');
      if (userId == null) {
        router.push('/');
      }
    }
  }, []);

  async function handlePasteFromClipboard() {
    if (!navigator.clipboard) {
      console.log('Clipboard API not available');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }

  // @ts-ignore
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="p-16"
    >
      <Card className="border-white border-1 bg-white/50 max-w-xs">
        <CardHeader>
          <CardTitle className="drop-shadow-lg text-lg flexCenter">
            Share code
          </CardTitle>
        </CardHeader>
        <CardContent className="flexCenter sm:space-x-3 space-y-3 flex-col">
          <Input
            onChange={handleChangeCode}
            onPaste={handlePasteFromClipboard}
            value={code}
            className="shadow-lg"
            placeholder="Enter shared code"
          />
          <Button onClick={handlePasteFromClipboard} className="shadow-lg">
            <FiClipboard /> Paste from clipboard
          </Button>
          <Button onClick={handleAccess} className="shadow-lg">
            Access
          </Button>
        </CardContent>
      </Card>

      {isLoading && <Spinner className="flexCenter" />}

      {!isLoading && (
        <>
          <>
            <FolderList
              folders={folderList}
              parentFolderId={parentFolder.parentFolderId}
            />
          </>
          <>
            <FileList files={fileList} />
          </>
        </>
      )}
    </motion.div>
  );
}
