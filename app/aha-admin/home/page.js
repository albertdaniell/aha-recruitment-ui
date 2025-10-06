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

function Card({ name, value, gradient = "from-teal-500 to-teal-500" }) {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} rounded-2xl shadow-lg px-6 py-5 text-center transform hover:scale-[1.02] transition-all duration-300`}
    >
      <p className="text-sm text-white/90 tracking-wide uppercase">{name}</p>
      <p className="text-xl font-extrabold text-white mt-1">{value ?? 0}</p>
    </div>
  );
}
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
  const submittedApps = applications?.results;

  // ✅ Show 4 first
  const displayedApps = showAll ? submittedApps : submittedApps?.slice(0, 12);
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
          process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION,
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
      {userCounty ? (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 items-start justify-between">
          {/* LEFT SIDE */}
          <div className="col-span-2">
            <h1 className="text-3xl font-bold text-[#009639]">
              Welcome, {user?.role} - {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
            {/* {user.fpo?.name && (
              <p className="text-gray-600 mt-2">FPO: {user.fpo?.name}</p>
            )} */}
          </div>

          {/* RIGHT SIDE */}
          {user?.role !== "ADMIN" && (
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
          )}
        </div>
      ) : (
        <>
          <div className="col-span-2">
            <h1 className="text-3xl font-bold text-[#009639]">
              Welcome, {user?.role} - {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
            {/* {user.fpo?.name && (
              <p className="text-gray-600 mt-2">FPO: {user.fpo?.name}</p>
            )} */}
          </div>
        </>
      )}

      {applications?.length === 0 && (
        <div className="bg-orange-300 p-5 rounded-md my-4">
          <p className="text-orange-800">
            There seems to be no applications made.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 md:gap-3 gap-2 my-4">
        <Card
          gradient={"from-purple-400 to-purple-500"}
          value={stats?.all_applications}
          name={"Applications"}
        ></Card>

        <Card
          gradient={"from-blue-400 to-blue-500"}
          value={stats?.all_applications_submitted}
          name={"Submitted"}
        ></Card>

        <Card
          gradient={"from-slate-400 to-slate-500"}
          value={stats?.all_applications_drafts}
          name={"Drafts"}
        ></Card>

        <Card
          gradient={"from-green-400 to-green-500"}
          value={stats?.all_applications_shortlisted}
          name={"Shortlisted"}
        ></Card>
        <Card
          gradient={"from-red-400 to-red-500"}
          value={stats?.all_applications_rejected}
          name={"Rejected"}
        ></Card>
        <Card
          gradient={"from-teal-500 to-teal-600"}
          value={stats?.all_applications_recruited}
          name={"Recruited"}
        ></Card>
      </div>

      <div className="grid md:grid-cols-0   lg:grid-cols-3  md:grid-cols-0 gap-5">
        <div className="shadow-lg rounded-xl p-3 bg-white  lg:col-span-1">
          <p className="text-sm text-slate-600 mb-3">Submissions By Gender</p>
          {/* {JSON.stringify(stats)} */}
          {stats?.gender_stats?.male ? (
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
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600 p-5">
              <p className="text-center">No stats to show</p>
            </div>
          )}
        </div>
        <div className="shadow-lg rounded-xl p-3 bg-white md:col-span-2">
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
        {user?.role === "ADMIN" && (
          <div className="shadow-lg rounded-xl p-3 bg-white col-span-2">
            <p className="text-sm text-slate-600 mb-3">County Submission</p>
            {/* {JSON.stringify(stats)} */}
            {stats && (
              <AppChart
                options={make_data_past_7_days_graph(
                  stats?.county_stats,
                  "user__county__name",
                  "count"
                )}
              />
            )}
          </div>
        )}

        {/* show stats for fpo is user is not FPO */}

        {userCounty?.project === "NAVCDP" && (
          <>
            {user?.role !== "FPO" && (
              <div className="rounded-xl bg-white mt-3">
                <p className="text-sm text-slate-600 mb-3 px-2 pt-2">
                  FPO Submission
                </p>
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
                      {user?.role === "REVIEWER" && (
                        <>
                          {stats?.fpo_stats
                            ?.filter(
                              (i) =>
                                i?.user__county__name === user?.county?.name
                            )
                            ?.map((item, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
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
                      )}

                      {user?.role === "FPO" && (
                        <>
                          {stats?.fpo_stats
                            ?.filter(
                              (i) => i?.user__fpo__name === user?.fpo?.name
                            )
                            ?.map((item, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
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
                      )}

                      {user?.role === "ADMIN" && (
                        <>
                          {stats?.fpo_stats?.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
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
                      )}
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
            )}
          </>
        )}
      </div>
      <h1 className="text-xl font-bold mb-5 mt-5">
        Applications
        {/* {user.county?.name ? `for ${user.county.name} county` : ""} */}
      </h1>

      <div className="space-y-6">
        {/* Grid of Applications */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedApps?.map((app) => (
            <div
              key={app.id}
              className={` border rounded-xl shadow hover:shadow-lg ${
                app?.status === "draft"
                  ? "opacity-2 bg-slate-100"
                  : "bg-green-50"
              }`}
            >
              <div className="relative flex items-start">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-br-lg ">
                  {app?.position || "-"}
                </span>
              </div>
              <div className="flex  flex-col items-center  p-4 text-center">
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

                <p className="text-xs my-2 text-slate-500">
                  {app?.county} - {app?.ward}
                </p>

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
                  <Link
                    href={`applications/${app.id}/`}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    View
                  </Link>
                ) : (
                  // <button
                  //   disabled
                  //   className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                  // >
                  //   View
                  // </button>
                  <Link
                    href={`applications/${app.id}/`}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {!showAll && applications?.results?.length > 12 && (
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
