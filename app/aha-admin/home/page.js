"use client";

import Link from "next/link";
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

        const res = await fetch(process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  if (loading) return <p className="p-8">Loading...</p>;

  function renderStatus(app) {
    if (app.status === "draft") {
      return (
        <span className="px-2 py-1 rounded bg-gray-400 text-white text-xs">
          Draft
        </span>
      );
    }
    if (app.is_shortlisted) {
      return (
        <span className="px-2 py-1 rounded bg-blue-600 text-white text-xs">
          Shortlisted
        </span>
      );
    }
    if (app.is_not_shortlisted) {
      return (
        <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">
          Rejected
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded bg-green-600 text-white text-xs">
        Submitted
      </span>
    );
  }

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
      <h1 className="text-2xl font-bold mb-6">Applications {user.county?.name ? `for ${user.county.name} county`:""}</h1>

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
                Date Created
              </th>
               <th className="px-4 py-2 text-left text-sm font-semibold">
                Date Updated
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Action
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
                    : "bg-white"
                } border-t`}
              >
                <td className="px-4 py-2">{app?.first_name || "—"}</td>
                <td className="px-4 py-2">{app.last_name || "—"}</td>
                <td className="px-4 py-2 font-medium">{renderStatus(app)}</td>
                <td className="px-4 py-2">
                  {app.created_at
                    ? new Date(app.created_at).toLocaleDateString()
                    : "—"}
                </td>
                 <td className="px-4 py-2">
                  {app.created_at
                    ? new Date(app.updated_at).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                 {
                  app.status === "draft"?
                  <>
                   <Link
                    className="text-slate-400 hover:cursor-not-allowed"
                    href={"#"}
                  >
                    View
                  </Link>
                  </>
                  :
                   <Link
                    className="text-blue-500 hover:underline"
                    href={`applications/${app?.id}/`}
                  >
                    View
                  </Link>
                 }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}