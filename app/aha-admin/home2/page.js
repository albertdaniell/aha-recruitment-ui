"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, InfoFill, Person } from "akar-icons";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null); // store user application

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) {
        router.push("/aha/login");
        return;
      }
      setUser(loginData.user);
      setLoading(false)
    };

    fetchUserData();
  }, [router]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="">
      {/* Welcome Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#009639]">
          Welcome, {user.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Email: {user.email}</p>
          <p className="text-gray-600 mt-2">
          Get started by viewing applications
        </p>
      </div>
    </div>
  );
}
