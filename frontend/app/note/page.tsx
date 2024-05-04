"use client";
import { useEffect } from "react";
import {AppDispatch, useAppSelector} from "@/lib/store";
import {getAllNotes, getAllRootFolder, openFolder} from "@/lib/apiCall";
import { useState } from "react";
import FileList from "@/components/listDeleted/FileList";
import {useDispatch} from "react-redux";
import {deletedFile} from "@/lib/apiCall";
import NoteList from "@/components/NoteList";
import {NewFolder} from "@/components/NewFolder";
import {NewNote} from "@/components/NewNote";



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
        <>
            <NewNote userId={userId}/>
            <div className="mt-10 ml-16">
                <div>
                    {noteList !== null && <NoteList notes={noteList}/>}
                </div>
            </div>
        </>
    );
}
