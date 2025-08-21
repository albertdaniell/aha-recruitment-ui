import React from "react";
import Login from "./LoginForm";
import Logos from "@/app/components/Search/Logos";

function PageWrapper() {
  let TITLE_PAGE = ["County Views", "Weka nambari yako ya kitambulisho"];

  return (
    <div>
      <div className="w-100 min-h-[100vh] flex flex-col items-center  lg:p-0 overflow-auto bg-white dark:bg-white">
        <div className="bg-white border-2 lg:border-gray-50 border-gray-50 shadow-sm self-center w-[100%] lg:h-[100vh] lg:rounded-lg md:overflow-auto">
          <div className="flex justify-between md:hidden p-3">
            <img src="/emblem.png" className="w-[50px] h-[50px] my-5"></img>

            <img src="/cog.png" className="w-[50px] h-[50px] my-5"></img>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1">
            <div className="md:h-[100vh] md:col-span-0 md:p-0  h-[0vh]  col-span-1 bg-white bg-[url('/ai_image5.png')] bg-no-repeat bg-cover md:bg-top bg-left-top md:block hidden">
              <div className="h-[100%] w-[100%]"></div>
            </div>

            <div className="lg:h-[100vh] md:col-span-0 md:p-0  h-[26vh]  col-span-1 bg-white bg-[url('/ai_image6.png')] bg-no-repeat bg-cover md:bg-top bg-left-top md:hidden block overflow-auto">
              <div className="h-[100%] w-[100%] bg-[#0a855a3b]"></div>
            </div>

            <div className="md:col-span-2  flex flex-col lg:p-15 md:p-10 p-3 overflow-auto b justify-between">
              <div className="md:flex hidden   justify-between">
                <img
                  src="/emblem.png"
                  className="w-[100px] h-[100px] my-1"
                ></img>

                <img src="/cog.png" className="w-[100px] h-[100px] my-1"></img>
              </div>
              <div>
                <h1 className="lg:text-3xl md:text-2xl text-2xl  text-[#057a55] font-semibold text-left mb-3">
                  {TITLE_PAGE[0]}
                </h1>
                <hr></hr>
              </div>
              <div className="my-6 flex flex-col">
                <Login />
              </div>
              <div>
                <Logos />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageWrapper;
