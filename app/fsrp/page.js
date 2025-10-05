import Image from "next/image";

// import Search from "./components/Search/Search";
import Landing from "./LandingNewFSRP"
import AppNav from "../AppNav"

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
