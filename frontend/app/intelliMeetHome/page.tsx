"use client";
import ChatMeeting from "@/components/intelliMeet/ChatMeeting";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { getCode } from "@/lib/apiCall";
import React, { MutableRefObject,SetStateAction, useEffect, useRef, useState } from "react";





export default function Page() {
  const [code, setCode]=useState("");
  const handleChangeCode=(e: { target: { value: SetStateAction<string>; }; })=>{
    setCode(e.target.value)
}
  const handleCreate=async  ()=>{
    try{
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
  return(
  <div className="w-3/4 h-screen ml-auto mr-auto space-x-36 flexCenter">
    <div className="flex-col space-y-5 flexCenter">
    <h1 className="text-4xl italic font-black flexCenter">IntelliMeet</h1>
    <span className="text-center max-w-96 text-wrap">IntelliMeet is a meeting companion that helps you collaborate better during meetings by taking notes, tracking action items, and keeping things on track.</span>

    <Input className="max-w-96" type="text" placeholder="Room code" value={code} onChange={handleChangeCode} />
    <div className="flex-col space-y-3 flexCenter ">
          <Button onClick={handleCreate}>Create room</Button>
          <h4>OR</h4>
          <Button>Connect</Button>
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
  )
}
