"use client";
import { Person } from "akar-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

function AppNav() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLoadingUser(true);
    setTimeout(() => {
      const loginData = localStorage.getItem("login_response");
      if (loginData) {
        const parsed = JSON.parse(loginData);
        setUser(parsed);
      }
      setLoadingUser(false);
    }, 10);
  }, [router]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("login_response");
    setUser(false);
    setOpenDropdown(false);
    // router.push("/aha/login");
  };

  let LINKS = [
    { name: "Home", link: "#" },
    { name: "Learn More", link: "#learn-more" },
    { name: "NAVCDP", link: "/" },
    { name: "FSRP", link: "/fsrp" },

  ];

  return (
    <nav className="flex items-center justify-between px-5 md:px-20 md:py-4 py-2 shadow-sm bg-white w-full z-50 md:relative fixed">
      <div className="flex items-center gap-2">
        <Link href={"/"}>
          <img src={`/emblem.png`} alt="GOK" className="w-14 h-14" />
        </Link>
      </div>

      <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
        {LINKS?.map((link) => (
          <li key={link.name}>
            <Link href={link.link} className="hover:text-[#05a552]">
              {link?.name}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        {!loadingUser && (
          <>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className={`${openDropdown ? "bg-[#135231]":"bg-[#05a552]"}  text-white md:px-4 md:py-2 px-6 py-2 md:text-lg text-sm rounded-lg hover:bg-green-800 transition flex flex-row gap-2 items-center`}
                >
                  <Person /> Account - {user?.user?.first_name}
                </button>

                {/* Dropdown */}
                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <Link
                      href="/aha/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 "
                      onClick={() => setOpenDropdown(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-row gap-3">
                <Link
                  href="/aha/login"
                  className="bg-[#05a552] text-white md:px-4 md:py-2 px-3 py-2 md:text-lg text-sm rounded-lg hover:bg-green-800 transition"
                >
                  Login
                </Link>
                <Link
                  href="/aha/sign-up"
                  className="border border-[#05a552] text-[#05a552] md:px-4 md:py-2 px-3 py-2 md:text-lg text-sm rounded-lg hover:bg-green-50 transition-all duration-300"
                >
                  Create Account
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default AppNav;