"use client";

import { APP_FETCH } from "@/app/constants/FetchService";
import {
  FormatDate,
  make_data_past_7_days_graph,
  make_gender_pie,
} from "@/app/constants/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AppChart from "@/app/components/AppChart";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counties, setCounties] = useState(null);
  const [userCounty, setUserCounty] = useState(null); // store user application
  const [stats, set_stats] = useState(null); // store user application
  const [showAll, setShowAll] = useState(false);

  // Limit to 4 unless "showAll" is true
// const submittedApps = applications?.filter((app) => app.status === "submitted");
const submittedApps = applications

// ✅ Show 4 first
const displayedApps = showAll ? submittedApps : submittedApps?.slice(0, 4);
  const router = useRouter();

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
    const fetchStats = async () => {
      try {
        const res = await APP_FETCH(process.env.NEXT_PUBLIC_STATS_URL);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        set_stats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (counties && user) {
      let county = counties?.find((c) => c?.id === user.county?.id);
      setUserCounty(county);
    }
  }, [user, counties]);

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

        const res = await fetch(
          process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      {userCounty && (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 items-start justify-between">
          {/* LEFT SIDE */}
          <div className="col-span-2">
            <h1 className="text-3xl font-bold text-[#009639]">
              Welcome, {user?.role} - {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
            {user.fpo?.name && (
              <p className="text-gray-600 mt-2">FPO: {user.fpo?.name}</p>
            )}
          </div>

          {/* RIGHT SIDE */}
          {
            user?.role !== "ADMIN" 
            &&
<div className="inline-flex items-center gap-4 px-2 py-3 border-green-500 border rounded-2xl mb-4 bg-white">
            <img
              src={userCounty.logo || "/cog.png"}
              alt={userCounty?.name}
              className="w-16 h-16 object-contain rounded-md"
            />
            <div className="min-w-0">
              <h2 className="font-semibold truncate text-slate-600">
                {userCounty.name} County
              </h2>
              <p className="text-slate-500 text-xs">
                Ends:{" "}
                {FormatDate(userCounty.end_of_application, false) ||
                  "Not specified"}
              </p>
            </div>
          </div>
          }
          
        </div>
      )}

      {
        applications?.length ===0
        &&
        <div className="bg-orange-300 p-5 rounded-md">
            <p className="text-orange-800">
              There seems to be no applications made.
            </p>
          </div>
      }

      <div className="grid md:grid-cols-3  gap-6 my-4">
        {/* School Year */}
        <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-2xl shadow-md px-6 py-4  text-center">
          <p className="text-sm text-white opacity-80">Applications</p>
          <p className="text-xl font-bold text-white">
            {applications?.length || 0}
          </p>
        </div>

        {/* Semester */}
        <div className="bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl shadow-md px-6 py-4  text-center">
          <p className="text-sm text-white opacity-80">Submitted</p>
          <p className="text-xl font-bold text-white">
            {applications?.filter((app) => app?.status === "submitted")
              ?.length || 0}
          </p>
        </div>

        {/* Quarter */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl shadow-md px-6 py-4  text-center">
          <p className="text-sm text-white opacity-80">Drafts</p>
          <p className="text-xl font-bold text-white">
            {applications?.filter((app) => app?.status === "draft")?.length ||
              0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="shadow-lg rounded-xl p-3 bg-white col-span-1">
          <p className="text-sm text-slate-600 mb-3">Submissions By Gender</p>
          {/* {JSON.stringify(stats)} */}
          {
            stats?.gender_stats?.male ?
              <>
               {stats && (
            <AppChart
              options={make_gender_pie(
                stats?.gender_stats,
                "male",
                "female",
                "unspecified"
              )}
            />
          )}
              </>
:
<div className="flex items-center justify-center h-full text-slate-600">
<p className="text-center">No stats to show</p>
</div>
          }
         
        </div>
        <div className="shadow-lg rounded-xl p-3 bg-white col-span-2">
          <p className="text-sm text-slate-600 mb-3">Last 7 Days Submission</p>
 {/* {JSON.stringify(stats)} */}
          {stats && (
            <AppChart
              options={make_data_past_7_days_graph(stats?.daily_stats)}
            />
          )}
        </div>

        
      </div>
      {/* <div className={`mt-2 ${user?.role !=="FPO" ? "grid grid-cols-3 gap-3":"grid-cols-1" }`}> */}
<div className="mt-2">
        {
          user?.role ==="ADMIN" &&
 <div className="shadow-lg rounded-xl p-3 bg-white col-span-2">
          <p className="text-sm text-slate-600 mb-3">County Submission</p>
 {/* {JSON.stringify(stats)} */}
          {stats && (
            <AppChart
              options={make_data_past_7_days_graph(stats?.county_stats,"user__county__name","count")}
            />
          )}
        </div>
        }
        

        {/* show stats for fpo is user is not FPO */}

        {
          user?.role !== "FPO" &&

          <div className="rounded-xl bg-white mt-3">
             <p className="text-sm text-slate-600 mb-3 px-2 pt-2">FPO Submission</p>
<div className="overflow-auto mt-2 rounded-sm h-[300px]">
            
        <table className="table-auto border-collapse border border-gray-200 w-full shadow-md rounded-lg text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-200 px-4 py-2 text-gray-700 font-semibold">
                County
              </th>
              <th className="border border-gray-200 px-4 py-2 text-gray-700 font-semibold">
                FPO
              </th>
              <th className="border border-gray-200 px-4 py-2 text-gray-700 font-semibold">
                Submitted Count
              </th>
            </tr>
          </thead>
          <tbody>
            {
              user?.role === "REVIEWER" &&
              <>
              {stats?.fpo_stats?.filter(i=>i?.user__county__name === user?.county?.name)?.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__county__name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__fpo__name}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center font-medium">
                  {item.count}
                </td>
              </tr>
            ))}
              </>
            }

            {
              user?.role === "FPO" &&
              <>
              {stats?.fpo_stats?.filter(i=>i?.user__fpo__name === user?.fpo?.name)?.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__county__name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__fpo__name}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center font-medium">
                  {item.count}
                </td>
              </tr>
            ))}
              </>
            }

              {
              user?.role === "ADMIN" &&
              <>
              {stats?.fpo_stats?.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__county__name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__fpo__name}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center font-medium">
                  {item.count}
                </td>
              </tr>
            ))}
              </>
            }
            {/* {stats?.fpo_stats?.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__county__name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.user__fpo__name}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center font-medium">
                  {item.count}
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
            </div>

          
          
        }
      </div>
      <h1 className="text-xl font-bold mb-5 mt-5">
        Applications 
        {/* {user.county?.name ? `for ${user.county.name} county` : ""} */}
      </h1>

<div className="space-y-6">
      {/* Grid of Applications */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedApps?.map((app) => (
          <div
            key={app.id}
            className="bg-white border rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-lg"
          >
            {/* Profile Picture */}
            {app.profile?.profile_picture ? (
              <img
                src={app.profile.profile_picture}
                alt={`${app.first_name} ${app.last_name}`}
                className="w-24 h-24 rounded-full border object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-gray-100 text-gray-500">
                No Photo
              </div>
            )}

            {/* Applicant Name */}
            <h3 className="mt-3 font-semibold text-lg text-slate-800">
              {app.first_name} {app.last_name}
            </h3>

            {/* Status */}
            <p className="mt-1 text-sm">
              <span
                className={`px-2 py-1 rounded ${
                  app.status === "submitted"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {app.status}
              </span>
            </p>

            {/* Dates */}
            <p className="mt-2 text-sm text-gray-600">
              Submitted:{" "}
              {app.submission_date
                ? FormatDate(app.submission_date, false)
                : "—"}
            </p>
            <p className="text-sm text-gray-600">
              Created:{" "}
              {app.created_at ? FormatDate(app.created_at, false) : "—"}
            </p>

            {/* View Button */}
            {app.status === "draft" ? (
              <button
                disabled
                className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
              >
                View
              </button>
            ) : (
              <Link
                href={`applications/${app.id}/`}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                View
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* View More Button */}
      {!showAll && applications?.length > 4 && (
        <div className="flex justify-center">
          <button
            onClick={() => router.push("applications/")}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            View More Applications
          </button>
        </div>
      )}
    </div>
     
    </div>
  );
}
