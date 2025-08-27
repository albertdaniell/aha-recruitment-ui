"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  CircleX,
  ThreeLineHorizontal,
} from "akar-icons";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

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

  const sidebarLinks = [
    { name: "Home", href: "/aha-admin/home" },
    { name: "Applications", href: "/aha-admin/applications" },
    { name: "Shortlisted", href: "/aha-admin/shortlisted" },
    { name: "County Settings", href: "/aha-admin/county-setting" },
    { name: "Users", href: "/aha-admin/users" },
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
          <h2 className="text-2xl font-bold mb-6 text-white">Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            {sidebarLinks.map((link) => {
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
            })}
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