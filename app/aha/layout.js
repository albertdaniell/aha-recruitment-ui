"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Layout({ children }) {
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoadingUser(true);
    setTimeout(() => {
      const loginData = localStorage.getItem("login_response");
      if (loginData) {
        const parsed = JSON.parse(loginData);
        if (
          parsed?.user?.role?.toUpperCase() === "REVIEWER" ||
          parsed?.user?.role?.toUpperCase() === "ADMIN"
        ) {
          setLoadingUser(false);
          router.push("/aha-admin/home");
        } else {
          setLoadingUser(false);
          router.push("/applicant/home");
        }
      }
      setLoadingUser(false);
    }, 10);
  }, [router]);

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Fixed Image */}
      <div
        className="hidden md:block fixed top-0 left-0 w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/cow.jpg')" }}
      ></div>

      {/* Right Scrollable Content */}
      <main className="md:ml-[50%] flex-1 flex items-center justify-center p-8">
        <div className="w-full p-10">
          <div className="flex justify-between">
            <img src="/emblem.png" className="w-[80px] h-[80px]" />
            <img src="/cog.png" className="w-[80px] h-[80px]" />
          </div>

          <h3 className="mt-5">
            Ward Veterinary Surgeons and Veterinary Para Professionals for
            County FMD & PPR Vaccination Campaign Application form
          </h3>
          <h3 className="mt-5">
            By having an account you can track your application
          </h3>

          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;