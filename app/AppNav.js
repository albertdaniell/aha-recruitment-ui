import Link from "next/link";
import React from "react";

function AppNav() {
  let LINKS = [
     {
      name: "Home",
      link: "#",
    },
    {
      name: "Learn More",
      link: "#learn-more",
    },
   
  ];
  return (
    <nav className="flex items-center justify-between px-10 md:px-20 py-4 md:py-4 shadow-sm bg-white  w-full z-50">
      <div className="flex items-center gap-2">
        <Link href={"/"}>
        <img
          src="/emblem.png"
          alt="KALROAssist Logo"
          className="w-14 h-14"
        /></Link>
        {/* <span className="text-xl font-bold text-[#05a552]">KALROAssist</span> */}
      </div>
      <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
        {LINKS?.map((link) => {
          return (
            <li key={link.name}>
              <Link href={link.link} className="hover:text-[#05a552]">
                {link?.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div>
        <div className="flex flex-row gap-3">
 <Link
          href="/aha/login"
          className="bg-[#05a552] text-white md:px-6 md:py-3 px-3 py-2 md:text-lg text-sm rounded-lg hover:bg-green-800 transition"
        >
          Login
        </Link>
         <Link
                href="/aha/sign-up"
                className="border border-[#05a552] text-[#05a552] md:px-6 md:py-3 px-3 py-2 md:text-lg text-sm rounded-lg hover:bg-green-50 transition-all duration-300"
              >
                Create Account
              </Link>
        </div>
       
      </div>
    </nav>
  );
}

export default AppNav;
