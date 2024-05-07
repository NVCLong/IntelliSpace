"use client";
import { useEffect } from "react";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {getAllNotes} from "@/lib/apiCall";
import { useState } from "react";
import {useDispatch} from "react-redux";
import NoteList from "@/components/NoteList";
import {NewNote} from "@/components/NewNote";
import {motion} from "framer-motion";



export default function Page() {
  const storageID_temp:string | null  = localStorage.getItem("storageID")
  const userId= localStorage.getItem("userId")
    const  dispatch = useDispatch<AppDispatch>();
  // @ts-ignore
  const storageID: string | null = useAppSelector(
    (state) => state.storageSlice.storageID
  );
  const [noteList, setNoteList] = useState([]);


  const handleFetchData = async ()=>{
          try {
              // @ts-ignore
              const response = await getAllNotes(userId);
              setNoteList(response);
              console.log(response);
          } catch (error) {
              console.error(error);
          }
        }

  useEffect(() => {
    handleFetchData();
  }
  , []
);
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
          className="flex flex-col">
            <NewNote className="flex flex-row ml-36" userId={userId}/>
            <div className="mt-10 ml-16">
                <div>
                    {noteList !== null && <NoteList notes={noteList}/>}
                </div>
            </div>
        </motion.div>
    );
}
