'use client';

import { useEffect, useState } from 'react';
import { getAllNotes } from '@/lib/apiCall';
import NoteList from '@/components/NoteList';
import { NewNote } from '@/components/NewNote';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const [noteList, setNoteList] = useState([]);
  const [error, setError] = useState({ message: '' });

  const handleFetchData = async (userId: string | null) => {
    setError({ message: '' }); // Reset any previous error
    if (userId === '') {
      setError({ message: 'do not have userId' });
      return;
    }
    try {
      // @ts-ignore
      const response = await getAllNotes(userId);
      setNoteList(response);
      if (response === null) {
        // console.log('Null');
      }
    } catch (error) {
      // @ts-ignore
      setError({ message: error.message });
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Make sure window exists
      let user = localStorage.getItem('userId');
      if (user == null) {
        router.push('/');
      }
      const userId = localStorage.getItem('userId') || '';
      setUserId(userId);
      // console.log(userId === null);
      handleFetchData(userId)
        .then(() => {
          // console.log('success');
        })
        .catch(() => {
          console.log('error');
        });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="flex flex-col"
    >
      <NewNote className="flex flex-row ml-36" userId={userId} />
      <div className="mt-10 ml-16">
        {noteList.length > 0 && error.message === '' && (
          <NoteList notes={noteList} />
        )}
      </div>
    </motion.div>
  );
}
