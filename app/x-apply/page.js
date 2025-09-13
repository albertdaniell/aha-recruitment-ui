import React from "react";
import Header from "./pagecomponents/Header";
import Form from "./pagecomponents/Form";
import Logos from "../components/Search/Logos";

function page() {
  return (
    <div
      className="w-100 min-h-[100vh] flex flex-col lg:px-24 py-5 p-2 
    "
    >
      <Header />
      <Form />

      <div className="flex justify-center items-center p-1 my-5">
        <div className="bg-white p-3">
          <Logos />
        </div>
      </div>
    </div>
  );
}

export default page;
