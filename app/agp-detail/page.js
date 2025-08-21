"use client";

import React from "react";
import Logos from "../components/Search/Logos";
import Header from "./pagecomponents/Header";
import QrDetails from "./pagecomponents/QRDetail";
import { useSearchParams } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const id_number = searchParams.get("id_number");

  return (
    <div>
      <div
        className="w-100 min-h-[100vh] flex flex-col lg:px-24 py-5 p-2
    "
      >
        <Header />
        <QrDetails id_number={id_number} />
        <div className="flex justify-center items-center p-1 my-5">
          <div className="bg-white p-3">
            <Logos />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;