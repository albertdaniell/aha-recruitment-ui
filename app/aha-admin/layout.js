"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircleX, ThreeLineHorizontal } from "akar-icons";
import { FormatDate } from "../constants/utils";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const [userCounty, setUserCounty] = useState(null); // store user application
  const [counties, setCounties] = useState(null);

  // Fetch counties on mount
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_COUNTY_LIST_URL);
        if (!res.ok) throw new Error("Failed to fetch counties");
        const data = await res.json();
        setCounties(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounties();
  }, []);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (loginData && loginData.user) {
      setUser(loginData.user);
      // 🚨 If role is NOT REVIEWER, redirect away
      if (loginData.user.role !== "REVIEWER") {
        router.push("/aha/login"); // or maybe "/not-authorized"
      }
    } else {
      router.push("/aha/login");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (counties && user) {
      let county = counties?.find((c) => c?.id === user.county?.id);
      setUserCounty(county);
    }
  }, [user, counties]);

  const sidebarLinks = [
    { name: "Home", href: "/aha-admin/home" },
    { name: "Applications", href: "/aha-admin/applications" },
    { name: "Shortlisted", href: "/aha-admin/shortlisted" },
    { name: "County Settings", href: "/aha-admin/county-setting" },
    // { name: "Advertisement", href: "/applicant/advertisement" },
    { name: "Website Home", href: "/" },

    // { name: "Users", href: "/aha-admin/users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("login_response");
    router.push("/aha/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "REVIEWER") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-xl font-semibold">
          Access Denied — Reviewer role required.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded shadow"
        >
          {sidebarOpen ? (
            <CircleX size={24} color="red" />
          ) : (
            <ThreeLineHorizontal color="green" size={24} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-teal-900 shadow-md p-6 flex flex-col justify-between transform transition-transform duration-300 z-40
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mt-14 md:mt-0">
          <h2 className="text-xl font-bold mb-4 text-white">Dashboard</h2>
          <nav className="flex flex-col space-y-1">
            <div className="inline-flex items-center gap-3 px-2 py-3 border-green-500 border rounded-lg  bg-white mb-5">
              <img
                src={userCounty?.logo || "/cog.png"}
                alt={userCounty?.name}
                className="w-9 h-9 object-contain rounded-md"
              />
              <div className="min-w-0">
                <h2 className="font-semibold truncate text-slate-600 text-xs">
                  {userCounty?.name} County
                </h2>
                <p className="text-slate-500 text-xs">
                  Ends:{" "}
                  {FormatDate(userCounty?.end_of_application, false) ||
                    "Not specified"}
                </p>
              </div>
            </div>
            {sidebarLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded  hover:text-teal-600 hover:bg-gray-50 ${
                    isActive
                      ? "bg-white text-slate-700 font-semibold"
                      : "text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            {/* {sidebarLinks.map((link) => {
              const isActive = pathname?.includes(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded  hover:text-teal-600 hover:bg-gray-50 ${
                    isActive ? "bg-white text-slate-700 font-semibold" : "text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })} */}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:px-14 px-4 md:py-8 py-4 md:ml-64 mt-14 md:mt-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
