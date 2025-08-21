"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const router = useRouter();
   useEffect(() => {

  async function fetchApplications() {
      try {
        const loginDataRaw = localStorage.getItem("login_response");

        if (!loginDataRaw) {
          router.push("/aha/login");
          return;
        }

        let loginData;
        try {
          loginData = JSON.parse(loginDataRaw);
        } catch {
          router.push("/aha/login");
          return;
        }


        const token = loginData?.access;
        if (!token) {
          router.push("/aha/login");
          return;
        }
        console.log({token})

        const res = await fetch("http://localhost:8000/api/applications/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log({res})


        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/aha/login");
            return;
          }
          throw new Error(`Failed to fetch applications: ${res.status}`);
        }

        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    }

    fetchApplications();
  }, [router]);


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

  // console.log({ applications });

  return (
    <div className="">
       <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#009639]">
          Welcome, Admin - {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Email: {user?.email}</p>
          <p className="text-gray-600 mt-2">
          Get started by viewing applications
        </p>
      </div>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                First name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Last name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Date Submitted
              </th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((app) => (
              <tr
                key={app.id}
                className={`${
                  app.status === "draft"
                    ? "bg-gray-200 text-gray-500"
                    : "bg-green-50"
                } border-t`}
              >
                <td className="px-4 py-2">{app?.first_name || "—"}</td>
                <td className="px-4 py-2">{app.last_name || "—"}</td>
                <td className="px-4 py-2 font-medium">
                  {app.status === "draft" ? (
                    <span className="px-2 py-1 rounded bg-gray-400 text-white text-xs">
                      Draft
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-green-600 text-white text-xs">
                      Submitted
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {app.created_at
                    ? new Date(app.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
