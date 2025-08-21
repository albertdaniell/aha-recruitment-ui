import React from 'react'
import Detail from "./pagecomponents/Detail"
import Logos from "../components/Search/Logos";
import Header from "./pagecomponents/Header";

function page() {
  return (
    <div>
        
       

        <div
      className="w-100 min-h-[100vh] flex flex-col lg:px-24 py-5 p-2 
    "
    >
      <Header />
      <Detail/>

      <div className="flex justify-center items-center p-1 my-5">
        <div className="bg-white p-3">
          <Logos />
        </div>
      </div>
    </div>
    </div>
  )
}

export default page