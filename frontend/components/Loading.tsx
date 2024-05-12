import React from 'react'
import BarLoader from "react-spinners/BarLoader";

const Loading = () => {
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
  )
}

export default Loading
