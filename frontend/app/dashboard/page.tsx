"use client";
import {useEffect} from "react";
import {getHeader} from "@/lib/apiCall";
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {RootState} from "@reduxjs/toolkit/query";
import {useAppSelector} from "../../lib/store"

export default function Page() {
  // @ts-ignore
  const storageID: string | null = useAppSelector(
      (state) => state.storageSlice.storageID
  );
  console.log(storageID)

  useEffect(() => {

    if (storageID !== null) {
      console.log("storage id : "+storageID)
    }
    getHeader();

  }, []);
  return (
    <>
    </>
  )
}
