"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChatBubble,
  ChatError,
  Check,
  CircleX,
  Info,
  Paper,
  Pencil,
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
    } else {
      router.push("/aha/login");
    }
    setLoading(false);
  }, [router]);

  const sidebarLinks = [
    { name: "Home", href: "/applicant/home" },
    { name: "Profile", href: "/applicant/profile" },
    { name: "Application", href: "/applicant/apply" },
    { name: "Help", href: "/applicant/help" },
    { name: "Advertisement", href: "/applicant/advertisement" },
    { name: "Website Home", href: "/" },
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

  if (!user) return null;

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
        className={`fixed top-0 left-0 h-full w-64 bg-[#009639] shadow-md p-6 flex flex-col justify-between transform transition-transform duration-300 z-40
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
                  className={`px-3 py-2 rounded text-white hover:text-teal-600 hover:bg-gray-50 ${
                    isActive ? "bg-teal-900 text-slate-700 font-semibold" : ""
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

      {/* Main Content */}
      {/* <main className="flex-1 p-2 md:p-8 md:mt-0 mt-10 overflow-auto">{children}</main> */}

      {/* <main className="flex-1 p-8 overflow-auto md:ml-64">{children}</main> */}
    </div>
  );
}
