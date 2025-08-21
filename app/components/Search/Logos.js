import Image from "next/image";
import React from "react";

function Logos() {
  return (
    <div className="flex  flex-row gap-3 overflow-auto">
      <div className="flex-1">
        <Image
          alt="Agripreneur Expression of Interest Form
"
          width={100}
          height={100}
          src="/kalro.png"
          className="md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
        ></Image>
      </div>
      <div className="flex-1">
        <Image
          alt="Agripreneur Expression of Interest Form
"
          width={100}
          height={100}
          src="/navcdp.png"
          className="md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
        ></Image>
      </div>
      <div className="flex-1">
        <Image
          alt="Agripreneur Expression of Interest Form
"
          width={100}
          height={100}
          src="/fsrp.png"
          className="md:w-[120px] md:h-[120px] w-[75px] h-[75px]  my-5"
        ></Image>
      </div>
      <div className="flex-1">
        <Image
          alt="Agripreneur Expression of Interest Form
"
          width={100}
          height={100}
          src="/worldbank.png"
          className="md:w-[120px] md:h-[120px] w-[75px] h-[75px] my-5"
        ></Image>
      </div>
    </div>
  );
}

export default Logos;
