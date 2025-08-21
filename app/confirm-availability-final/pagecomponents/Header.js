import React from "react";

function Header() {
  let TITLE_PAGE = [
    "Agripreneur Expression of Interest - Confirm Availability",
    "Weka nambari yako ya kitambulisho",
  ];

  let TITLE_ENTER_NAT_ID = [
    "Enter your national Identification number",
    "Weka nambari yako ya kitambulisho",
  ];
  return (
    <>
      <div className="md:min-h-[10vh] min-h-[8vh] bg-[url('/job-01.svg')] bg-no-repeat bg-cover bg-center  overflow-auto rounded-md">
        <div className="h-[100%] w-[100%] bg-[#0a855ad1] flex flex-col lg:p-10 p-4 justify-center text-center">
          <center>
           <div className="flex flex-row self-center justify-center items-center rounded-lg flex-wrap">
           <img
              src="/emblem.png"
              className="w-[80px] h-[80px] text-right self-start justify-end"
            ></img>
            <img
              src="/cog.png"
              className="w-[80px] h-[80px] text-right self-start justify-end"
            ></img>
           </div>
          </center>

          <h1 className="lg:text-3xl text-sm my-1 text-white">
            {TITLE_PAGE[0]}
          </h1>
        </div>
      </div>

     
    </>
  );
}

export default Header;
