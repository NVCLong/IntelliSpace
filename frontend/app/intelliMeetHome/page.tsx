"use client";

import 'react-toastify/dist/ReactToastify.css'
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import { getCode } from "@/lib/apiCall";
import React, { SetStateAction,useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlayCircle, FiPlusCircle } from "react-icons/fi";

export default function Page() {
  const [code, setCode]=useState("");
  const handleChangeCode=(e: { target: { value: SetStateAction<string>; }; })=>{
    setCode(e.target.value)
}
const router = useRouter();
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

    <Input className="shadow-lg max-w-96" type="text" placeholder="Enter room code" value={code} onChange={handleChangeCode} />
    <div className="flex-col space-y-3 flexCenter ">
        <div className="px-4 py-2 transition-all duration-200 rounded-full shadow-lg cursor-pointer bg-slate-200 flexCenter hover:bg-slate-400" onClick={handleConnect}>
        <FiPlayCircle className="w-4 h-4 mr-2" />
        <span>Connect</span>
        </div>
        <div className="px-4 py-2 transition-all duration-200 rounded-full shadow-lg cursor-pointer bg-slate-200 flexCenter hover:bg-slate-400 max-w-fit" onClick={handleCreate}>
        <FiPlusCircle className="w-4 h-4 mr-2"/>
        <span>New meeting</span>
        </div>

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
