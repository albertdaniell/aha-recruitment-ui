import Image from "next/image";
import Main from "./components/Main/Main";

// import Search from "./components/Search/Search";
import Landing from "./LandingNew"
import AppNav from "./AppNav"


export default function Home() {

  return (
    <div className="">
      <AppNav/>
      {/* <Search/> */}
      {/* <Landing/> */}
      <Landing/>

      
    </div>
  );
}
