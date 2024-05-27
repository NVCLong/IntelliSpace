"use client";

import 'react-toastify/dist/ReactToastify.css'
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import copy from "copy-to-clipboard";
import { getCode } from "@/lib/apiCall";
import { toast, ToastContainer } from "react-toastify";
import React, { createContext, MutableRefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";


interface CodeContextType {
  code: string;
  setCode: (newCode: string) => void;
}



export default function Page() {
  const [code, setCode]=useState("");
  // @ts-ignore
  const DataContext = createContext<CodeContextType | undefined>(undefined);
  const router = useRouter();
  const handleChangeCode=(e: { target: { value: SetStateAction<string>; }; })=>{
    setCode(e.target.value)
  }

  const handleCreate=async  ()=>{
    try{
      let userId:string|null
        // @ts-ignore
      if(typeof window !=="undefined"){
        userId=localStorage.getItem("userId");
      }
        // @ts-ignore
      const data = await getCode(userId);
        console.log(data)
        toast.success(<div>
            Code: {data.roomId}
            <br />
            Copied to clipboard
        </div>)
        copy(data.roomId);
    }catch (e){
        console.log(e)
        throw  e
    }
  }

  const handleConnect= ()=>{
    if(code !=="") {
      router.push(`/intelliMeet?roomId=${code}`);
    }
  }
  return(
    <>
      <ToastContainer
      position="bottom-right"
      autoClose={8000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  <div className="w-3/4 h-screen ml-auto mr-auto space-x-36 flexCenter">
    <div className="flex-col space-y-5 flexCenter">
    <h1 className="text-4xl italic font-black flexCenter">IntelliMeet</h1>
    <span className="text-center max-w-96 text-wrap">IntelliMeet is a meeting companion that helps you collaborate better during meetings by taking notes, tracking action items, and keeping things on track.</span>

    <Input className="max-w-96" type="text" placeholder="Room code" value={code} onChange={handleChangeCode} />
    <div className="flex-col space-y-3 flexCenter ">
          <Button onClick={handleCreate}>Create room</Button>
          <h4>OR</h4>
          <Button onClick={handleConnect}>Connect</Button>
    </div>

    </div>
    <div className="shadow-lg">
    <Image
              src="/Meet_Home.png"
              alt="logo"
              width={500}
              height={500}
              className="rounded-lg"
            />
    </div>


  </div>
      </>
  )
}
