import Link from "next/link";
import React from "react";

function TopMobileNav({ user_county }) {
  return (
    <div className="md:hidden mb-5">

      <>
        <h1 className="text-xl mb-2">Dashboard</h1>
        <div className="md:hidden mb-5 gap-5 bg-gray-200 text-blue-600 p-3 flex space-x-6 rounded-md overflow-auto  flex-wrap">
          <Link className=" h-[10%]" href="/county">
            Home
          </Link>
          <Link className="" href="/county/applications">
            Applications
          </Link>
          <Link className="" href="/county/confirmations">
            Confirmations
          </Link>

          <Link className="" href="/county/agripreneurs">
          Agripreneurs
          </Link>
        </div>
        <div></div>
        <p className="mb-2">{user_county}</p>
      </>
    </div>
  );
}

export default TopMobileNav;
