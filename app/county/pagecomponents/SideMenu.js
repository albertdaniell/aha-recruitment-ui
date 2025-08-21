"use cliemt"
import { logoutUser } from "@/app/app-redux/features/AppData/appSlice";
import { removeValueFromOffline } from "@/app/constants/OfflineStorage";
import { Briefcase, Home, Paper, PersonAdd, PersonCheck, SignOut } from "akar-icons";
import { ListGroup } from "flowbite-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

function SideMenu({ county_name }) {
  const router = useRouter();
  const dispatch = useDispatch();
  let pathName = usePathname()

  const logout = () => {
    setTimeout(() => {
      removeValueFromOffline("@userData");
      removeValueFromOffline("@isLoggedIn");
      removeValueFromOffline("@CountyStats_Merged");
      router.replace(`/login`);
      dispatch(logoutUser());
    }, 1000);
  };
  return (
    <div className="bg-[#17803d] h-[100%]  overflow-auto flex flex-col justify-between">
      <div>
        
      <div className="p-3 gap-3  flex flex-col px-5  bg-green-500 h-[100px] justify-center">
      <div className="flex flex-row gap-3">
      <Briefcase />
      <h4>
        Dashboard
      </h4>
      </div>
{/* 
        <div>
          <h3 className="text-sm">{county_name} county</h3>
        </div> */}

        {/* Dashboard */}
      </div>
      <div className="p-3">
        <div className="flex justify-center">
          <ListGroup className="w-[100%] rounded-none bg-transparent overflow-hidden border-0 text-slate-200 my-5">
            <div className="flex flex-col">
              <Link
                className={`hover:cursor-pointer w-[100%] gap-2 text-left h-[100%] py-4 px-2 hover:bg-white hover:text-black flex flex-row items-center rounded-lg my-2 ${pathName.endsWith("/county") && "bg-white text-black"}`}
                href="/county"
              >
               <Home/> <span className=""> Home</span>
              </Link>
              <Link
                className={`hover:cursor-pointer w-[100%] gap-2  text-left h-[100%] py-4 hover:bg-white px-2 hover:text-black flex flex-row items-center rounded-lg my-2 ${pathName.endsWith("/applications") && "bg-white text-black"}`}
                href="/county/applications"
              >
             <Paper/>   <span className=""> Applications  & Confirmations</span>
              </Link>
              {county_name !== "admin" && (
                <>
                <Link
                className={`hover:cursor-pointer w-[100%] gap-2  text-left h-[100%] py-4 hover:bg-white px-2 hover:text-black flex flex-row items-center rounded-lg my-2 ${pathName.endsWith("/agripreneurs") && "bg-white text-black"}`}
                 href="/county/agripreneurs"
              >
             <PersonAdd/>   <span className=""> Agripreneurs</span>
              </Link>
                  {/* <Link
                    className="hover:cursor-pointer gap-2  w-[100%] text-left h-[100%] py-4 hover:bg-white hover:text-black items-center hover:rounded-lg"
                    href="/county/agripreneurs"
                  >
                    <span className="">Agripreneurs</span>
                  </Link> */}
                  {/* <Link
                    className="hover:cursor-pointer gap-2  w-[100%] text-left h-[100%] py-4 hover:bg-white hover:text-black "
                    href="/county/confirmations"
                  >
                    <span className="px-4">Confirmations</span>
                  </Link> */}
                </>
              )}
            </div>
            {/* <ListGroup.Item>Messages</ListGroup.Item> */}
            {/* <ListGroup.Item disabled>Download</ListGroup.Item> */}
          </ListGroup>
        </div>
        {/* <hr></hr> */}
        {/* <h3 className="text-sm-lg mt-5">{county_name} County</h3> */}

       
      </div>

      </div>
     
      {/* <hr></hr> */}

      

      {/* <Lock/> */}
      <div className="flex flex-col px-5">
        <div className=" flex flex-row gap-3 items-center">
          <div className="bg-yellow-400 p-3 rounded-full">
          <PersonCheck/>
          </div>
        <h3 className="text-sm">{county_name} county</h3>
        </div>
      <button
          onClick={logout}
          className="bg-white text-black px-5  py-2 text-sm rounded-sm my-5 flex gap-1"
        >
          <SignOut /> Logout
        </button>
      </div>
    </div>
  );
}

export default SideMenu;
