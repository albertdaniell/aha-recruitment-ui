"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function layout({ children }) {
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
    <div className="min-h-screen md:flex">
      {/* Left Image */}
      <div
        className="w-1/2 bg-cover bg-center md:flex hidden"
        style={{ backgroundImage: "url('/cow.jpg')" }}
      ></div>

      {/* Right Form */}
      <main className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md ">
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

          {/* <div className="flex items-center justify-between mb-6">
                    <Link
                      href="/"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      ← Back to Home
                    </Link>
                    <h2 className="text-2xl font-bold">Account</h2>
                  </div> */}

          {children}

          {/* <div className="mt-4 flex justify-between text-sm">
                    <button
                      onClick={() => router.push("/aha/login")}
                      className="text-teal-600 hover:underline"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => router.push("/aha/request-reset")}
                      className="text-teal-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div> */}
        </div>
      </main>
    </div>
  );
}

export default layout;
