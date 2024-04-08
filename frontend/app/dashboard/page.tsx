"use client";
import {useEffect} from "react";
import {getHeader} from "@/lib/apiCall";

export default function Page() {
  useEffect(() => {
    getHeader();
  }, []);
  return (
    <>
    </>
  )
}
