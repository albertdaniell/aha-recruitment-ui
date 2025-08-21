"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (loginData && loginData.user) {
      setUser(loginData.user);
    } else {
      router.push("/aha/login"); // redirect if not authenticated
    }
    setLoading(false); // finished checking
  }, [router]);

  const sidebarLinks = [
    { name: "Home", href: "/applicant/home" },
    { name: "Profile", href: "/applicant/profile" },
    { name: "Certificates", href: "/applicant/certificates" },
    { name: "Settings", href: "/applicant/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("login_response"); // clear offline data
    router.push("/aha/login"); // redirect to login
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
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col space-y-3">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 hover:bg-gray-50 px-3 py-2 rounded"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}