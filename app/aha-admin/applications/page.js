"use client";

import { FormatDate } from "@/app/constants/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  StoreofflineLocalStorage,
  getOfflineData,
  removeValueFromOffline,
} from "@/app/constants/OfflineStorage";
export default function ApplicationsPage() {
  const [applications, setApplications] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counties, setCounties] = useState(null);
  const [userCounty, setUserCounty] = useState(null); // store user application
  const [filter, setFilter] = useState("all"); // 🔑 new filter state
  const [county_filter, setCountyFilter] = useState("all"); // 🔑 new filter state

  const [search, setSearch] = useState(""); // 🔎 new search state
  const [exportAll, setExportAll] = useState(false);

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

  let handleCountyFilter = async (val) => {
  setCountyFilter(val);

  let url_offline = await getOfflineData("@applications_url");
  let baseUrl = url_offline || process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION;

  // If "all" is selected, fetch all
  if (val === "all" || (Array.isArray(val) && val.length === 0)) {
    // alert(0)
    baseUrl = process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION
    console.log({baseUrl})
    await fetchApplications(baseUrl, true);
    return;
  }

  // Convert multiple selected counties into comma-separated string
  const countyParams = Array.isArray(val) ? val.join(",") : val;

  // Remove any existing county params before appending
  const cleanUrl = baseUrl.replace(/([?&])county=[^&]*/g, "").replace(/[?&]$/, "");

  // Append counties properly
  const separator = cleanUrl.includes("?") ? "&" : "?";
  const url = `${cleanUrl}${separator}county=${countyParams}`;

  await fetchApplications(url, true);
};

  let handleCountyFilterOld = async (val) => {
    setCountyFilter(val);

    let url_offline = await getOfflineData("@applications_url");
    let url = null;

    if (url_offline) {
      url = url_offline;
    } else {
      url = process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION;
    }

    if(val === "all"){
      url = process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION
    await fetchApplications(url,true)
    return 0
    }


    if(url.includes("?")){
      url = `${url}&county=${val}`

    }else{
      url = `${url}?county=${val}`
    }
    // console.log({url})
    await fetchApplications(url,true)


    // fetchApplications
  };

  useEffect(()=>{
    if(counties && userCounty){
      let app_counties = counties
      app_counties = app_counties?.filter((county)=>{
        return county?.project === userCounty?.project
      })
      console.log({app_counties})
      setCounties(app_counties)
    }
  },[counties, userCounty,])

  useEffect(() => {
    if (counties && user) {
      let county = counties?.find((c) => c?.id === user.county?.id);
      setUserCounty(county);
    }
  }, [user, counties]);

  async function fetchApplications(
    url = process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION,
    is_button_click = false
  ) {
    if (url === null) {
      return 0;
    }

    if (!is_button_click) {
      let url_offline = await getOfflineData("@applications_url");
      if (url_offline) {
        url = url_offline;
      }
    }

    // if(url){
    //   url =
    // }
    // store url in browser
    await removeValueFromOffline("@applications_url");
    await StoreofflineLocalStorage("@applications_url", url);
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

      const res = await fetch(url, {
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

  useEffect(() => {
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

  // 🔑 Export function
  const exportToExcel = () => {
    if (!applications) return;

    // ✅ Choose filter based on toggle
    const filteredApps = exportAll
      ? applications?.results
      : applications?.results?.filter((app1) => app1?.status === "submitted");

    // format for excel
    let exportData = filteredApps?.map((app, index) => ({
      "#": index + 1,
      APPLICATION_ID: app.id,
      Position:
        app.position === "VS"
          ? "Veterinary Surgeon"
          : app.position === "VPP"
          ? "Veterinary Para-professional"
          : "—",
      FIRST_NAME: app.first_name || "—",
      LAST_NAME: app.last_name || "—",
      GENDER: app?.profile?.gender || "—",
      PHONE: app?.phone || "—",
      COUNTY: app?.county || "—",
      WARD: app?.ward || "—",
      FPO: app?.fpo || "—",
      LOCATION: app?.profile?.location || "—",
      IS_PWD: app?.profile?.fpo || "—",
      DISABILITY_TYPE: app?.profile?.disability_type || "—",
      PWD_CERTIFICATE: app?.profile?.disability_certificate || "—",
      BIO: app?.profile?.bio || "—",
      EMAIL: app.email || app.user?.email || "—",
      STATUS: app.is_shortlisted
        ? "Shortlisted"
        : app.is_not_shortlisted
        ? "Rejected"
        : app.status,
      CVUploaded: app.cv ? app.cv : "No",
      CoverLetterUploaded: app.cover_letter ? app.cover_letter : "No",
      KVBCertificateUploaded: app.kvb_certificate ? app.kvb_certificate : "No",
      ProfessionalCertificateUploaded: app.professional_certificate
        ? app.professional_certificate
        : "No",
      NationalIDUploaded: app.national_id_document
        ? app.national_id_document
        : "No",
      DateCreated: app.created_at
        ? new Date(app.created_at).toLocaleDateString()
        : "—",
      DateUpdated: app.updated_at
        ? new Date(app.updated_at).toLocaleDateString()
        : "—",
    }));

    if(userCounty?.project === "FSRP"){
      exportData = filteredApps?.map((app, index) => ({
      "#": index + 1,
      APPLICATION_ID: app.id,
      Position:
        app.position === "VS"
          ? "Veterinary Surgeon"
          : app.position === "VPP"
          ? "Veterinary Para-professional"
          : "—",
      FIRST_NAME: app.first_name || "—",
      LAST_NAME: app.last_name || "—",
      GENDER: app?.profile?.gender || "—",
      PHONE: app?.phone || "—",
      COUNTY: app?.county || "—",
      SUBCOUNTY: app?.subcounty || "—",
      WARD: app?.ward || "—",
      LOCATION: app?.profile?.location || "—",
      IS_PWD: app?.profile?.fpo || "—",
      DISABILITY_TYPE: app?.profile?.disability_type || "—",
      PWD_CERTIFICATE: app?.profile?.disability_certificate || "—",
      BIO: app?.profile?.bio || "—",
      EMAIL: app.email || app.user?.email || "—",
      STATUS: app.is_shortlisted
        ? "Shortlisted"
        : app.is_not_shortlisted
        ? "Rejected"
        : app.status,
      CVUploaded: app.cv ? app.cv : "No",
      CoverLetterUploaded: app.cover_letter ? app.cover_letter : "No",
      KVBCertificateUploaded: app.kvb_certificate ? app.kvb_certificate : "No",
      ProfessionalCertificateUploaded: app.professional_certificate
        ? app.professional_certificate
        : "No",
      NationalIDUploaded: app.national_id_document
        ? app.national_id_document
        : "No",
      DateCreated: app.created_at
        ? new Date(app.created_at).toLocaleDateString()
        : "—",
      DateUpdated: app.updated_at
        ? new Date(app.updated_at).toLocaleDateString()
        : "—",
    }));
    }

    // create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // autosize columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 2, 15), // min 15 width
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");

    // save file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "applications.xlsx"
    );
  };

  // // 🔑 Apply filter before rendering
  // const filteredApplications =
  //   filter === "all"
  //     ? applications
  //     : applications?.filter((app) => app?.status === filter);
  // 🔑 Filter and search
  const filteredApplications = (applications || [])?.results
    ?.filter((app) => {
      if (filter === "all") return true;
      return app?.status === filter;
    })
    .filter((app) => {
      if (!search.trim()) return true;

      const query = search.toLowerCase();
      return (
        String(app?.id).toLowerCase().includes(query) ||
        app?.email?.toLowerCase().includes(query) ||
        app?.user?.email?.toLowerCase().includes(query) ||
        app?.first_name?.toLowerCase().includes(query) ||
        app?.last_name?.toLowerCase().includes(query)
      );
    });

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-2">
        Applications{" "}
       
        {user.county?.name
          ? `${
              user?.role === "REVIEWER" ? `for ${user.county.name} county` : ""
            }`
          : ""}
      </h1>
       <p className="text-xs mb-6">
         Project {user?.county?.project || "-"}
        </p>

        {/* <p className="text-xs">
      userCounty   {JSON.stringify(userCounty)}

        </p>

  <p className="text-xs">
       user  {JSON.stringify(user)}

        </p> */}

      {/* Filters + Search row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm text-slate-600">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Applications</option>
            <option value="submitted">Submitted</option>
            <option value="draft">Drafts</option>
          </select>

          {
             user?.role === "ADMIN" &&
  <select
            id="filter"
            value={county_filter}
            onChange={(e) => handleCountyFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Counties</option>

            {counties?.map((county) => {
              return <option value={county?.id}>{county?.name}</option>;
            })}
            {/* <option value="submitted">Submitted</option>
            <option value="draft">Drafts</option> */}
          </select>
          }

        
        </div>

        {/* 🔎 Search input */}
        <input
          type="text"
          placeholder="Search by ID, Email, First or Last Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1 text-sm flex-1 min-w-[250px]"
        />
      </div>

      <div>
        {/* Toggle */}
        <label className="flex items-center mb-2 gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={exportAll}
            onChange={(e) => setExportAll(e.target.checked)}
            className="rounded border-gray-300"
          />
          Export all applications
        </label>

        {/* Export button */}
        <button
          disabled={applications?.results?.length === 0}
          onClick={exportToExcel}
          className={`${
            applications?.results?.length === 0
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } px-4 py-2 text-white rounded transition mb-2 text-sm`}
        >
          Export to Excel
        </button>

        <p className="text-slate-500 text-sm mb-5">
          {exportAll
            ? `This will export all (from ${applications?.showing} page records)`
            : `This will export only submitted (from ${applications?.showing} page records)`}
        </p>
      </div>

      {applications === null ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            {/* Spinner */}
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-slate-600">
              Loading applications...
            </p>
          </div>
        </div>
      ) : filteredApplications?.length === 0 ? (
        <div className="bg-orange-300 p-5 rounded-md">
          <p className="text-orange-800">
            There seems to be no applications made.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow bg-green-400  max-h-[500px]">
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full border border-gray-200 text-md text-slate-800 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Application ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      County
                    </th>
                    {
                      userCounty?.project === "NAVCDP"
                      ?
 <th className="px-4 py-2 text-left text-sm font-semibold">
                      FPO
                    </th>:
                     <th className="px-4 py-2 text-left text-sm font-semibold">
                      Subcounty
                    </th>
                    }
                        <th className="px-4 py-2 text-left text-sm font-semibold">
                      Ward
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Position
                    </th>
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
                      Date Submitted
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Missing Docs
                    </th>

                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications?.map((app, index) => {
                    // ✅ Figure out missing documents if draft
                    let missingDocs = [];
                    if (app.status === "draft") {
                      if (!app.cv) missingDocs.push("CV");
                      if (!app.cover_letter) missingDocs.push("Cover Letter");
                      if (!app.kvb_certificate)
                        missingDocs.push("KVB Certificate");
                      if (!app.professional_certificate)
                        missingDocs.push("Professional Certificate");
                      if (!app.national_id_document)
                        missingDocs.push("National ID");
                    }

                    return (
                      <tr
                      onClick={()=>{
                        router.push(`applications/${app?.id}/`)
                      }}
                        key={app.id}
                        className={`${
                          app.status === "draft"
                            ? "bg-gray-200 text-gray-500 hover:bg-green-100 hover:text-black hover:shadow-xl hover:cursor-pointer"
                            : "bg-white hover:bg-green-100 hover:text-black hover:shadow-xl hover:cursor-pointer"
                        } border-t`}
                      >
                        <td className="px-4 py-2">{index + 1}</td>

                        {/* Application ID */}
                        {app.status === "submitted" ? (
                          <td className="max-w-[150px] px-4 py-2 truncate">
                            <Link
                              className="text-blue-500 hover:underline"
                              href={`applications/${app?.id}/`}
                            >
                              {app?.id || "—"}
                            </Link>
                          </td>
                        ) : (
                          <td className="px-4 py-2 max-w-[150px] truncate">
                            <span className="text-slate-400">
                              {app?.id || "—"}
                            </span>
                          </td>
                        )}
                         <td className="px-4 py-2 max-w-[150px] truncate">
                            <span className="text-slate-400">
                              {app?.county || "—"}
                            </span>
                          </td>

                        {
                      userCounty?.project === "NAVCDP"
                      ?
<td className="px-4 py-2 max-w-[150px] truncate">
                          <p>{app?.fpo || "—"}</p>
                          <span className="text-slate-400">
                            {app?.profile?.location}
                          </span>
                        </td>:

                         <td className="px-4 py-2 max-w-[150px] truncate">
                            <span className="text-slate-400">
                              {app?.subcounty || "—"}
                            </span>
                          </td>
                    }

                         <td className="px-4 py-2 max-w-[150px] truncate">
                            <span className="text-slate-400">
                              {app?.ward || "—"}
                            </span>
                          </td> 

                        <td className="px-4 py-2">{app?.position || "—"}</td>
                        <td className="px-4 py-2">{app?.first_name || "—"}</td>
                        <td className="px-4 py-2">{app?.last_name || "—"}</td>
                        <td className="px-4 py-2 font-medium">
                          {renderStatus(app)}
                        </td>
                        <td className="px-4 py-2">
                          {app.created_at
                            ? FormatDate(app.created_at, false)
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          {app.submission_date
                            ? FormatDate(app.submission_date, false)
                            : "—"}
                        </td>

                        {/* ✅ Missing docs column */}
                        <td className="px-4 py-2 text-xs">
                          {app.status === "draft" ? (
                            missingDocs.length > 0 ? (
                              missingDocs.length > 2 ? (
                                <span className="text-red-500 text-xs">
                                  {missingDocs?.length === 5
                                    ? "all"
                                    : missingDocs?.length}{" "}
                                  documents missing
                                </span>
                              ) : (
                                <span className="text-red-500 text-xs">
                                  {missingDocs.join(", ")}
                                </span>
                              )
                            ) : (
                              <span className="text-green-600 text-sm">
                                All uploaded
                              </span>
                            )
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-2">
                          <Link
                            className="text-blue-500 hover:underline"
                            href={`applications/${app?.id}/`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-slate-500 text-xs mb-2">
              Showing {applications?.showing} of {applications?.total_records}{" "}
              records (Page {applications?.current_page})
            </p>

            <div class="flex items-center gap-2">
              <button
                disabled={applications?.previous_page ? false : true}
                onClick={() => {
                  fetchApplications(
                    `${process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION}?page=${applications?.previous_page}`,
                    true
                  );
                }}
                class={`px-4 py-2 ${
                  applications?.previous_page
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-300"
                }   rounded-lg hover:bg-gray-300 text-sm`}
              >
                ⬅ Previous Page {applications?.previous_page}
              </button>

              <button
                disabled={applications?.next_page ? false : true}
                onClick={() => {
                  fetchApplications(
                    `${process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL_PAGINATION}?page=${applications?.next_page}`,
                    true
                  );
                }}
                class={`px-4 py-2 ${
                  applications?.next_page
                    ? "bg-teal-400 text-white hover:bg-teal-500"
                    : "bg-teal-200 text-teal-300  cursor-not-allowed"
                }   rounded-lg text-sm`}
              >
                Next Page {applications?.next_page} ➡
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
