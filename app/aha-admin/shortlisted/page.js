"use client";

import { FormatDate } from "@/app/constants/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counties, setCounties] = useState(null);
  const [userCounty, setUserCounty] = useState(null); // store user application

  const router = useRouter();

  let shorlisted = applications?.filter(app_1=>app_1?.is_shortlisted === true)

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
    if (app.is_recruited) {
      return (
        <span className="px-2 py-1 rounded bg-teal-600 text-white text-xs">
          Recruited
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

  // filter shortlisted
  const shortlisted = applications.filter((app) => app.is_shortlisted === true);

  const exportData = shortlisted?.filter((app1)=>{
    return app1?.status === "submitted"
  })?.map((app, index) => ({
    "#": index + 1,
    "APPLICATION_ID": app.id,
    Position:
      app.position === "VS"
        ? "Veterinary Surgeon"
        : app.position === "VPP"
        ? "Veterinary Para-professional"
        : "—",
    "FIRST_NAME": app.first_name || "—",
    "LAST_NAME": app.last_name || "—",
    "GENDER": app?.profile?.gender || "—",
    "PHONE": app?.phone || "—",
    "COUNTY": app?.county || "—",
    "WARD": app?.ward || "—",
    "FPO": app?.fpo || "—",
    "LOCATION": app?.profile.location || "—",
    "IS_PWD": app?.profile.fpo || "—",
    "DISABILITY_TYPE": app?.profile.disability_type || "—",
    "PWD_CERTIFICATE": app?.profile.disability_certificate || "—",
    "BIO": app?.bio || "—",
    "EMAIL": app.email || app.user?.email || "—",
    "STATUS": app.is_shortlisted
      ? "Shortlisted"
      : app.is_not_shortlisted
      ? "Rejected"
      : app.status,
    "CVUploaded": app.cv ? app.cv : "No",
    "CoverLetterUploaded": app.cover_letter ? app.cover_letter : "No",
    "KVBCertificateUploaded": app.kvb_certificate ? app.kvb_certificate: "No",
    "ProfessionalCertificateUploaded": app.professional_certificate ? app.professional_certificate  : "No",
    "NationalIDUploaded": app.national_id_document ? app.national_id_document : "No",
    "DateCreated": app.created_at
      ? new Date(app.created_at).toLocaleDateString()
      : "—",
    "DateUpdated": app.updated_at
      ? new Date(app.updated_at).toLocaleDateString()
      : "—",
  }));

  // create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);

  // autosize columns
  const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.max(key.length + 2, 15), // min 15 width
  }));
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Shortlisted Applications");

  // save file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    "shortlisted_applications.xlsx"
  );
};

    // format for excel
  const exportData = applications?.filter((app1)=>{
    return app1?.status === "submitted"
  })?.map((app, index) => ({
    "#": index + 1,
    "APPLICATION_ID": app.id,
    Position:
      app.position === "VS"
        ? "Veterinary Surgeon"
        : app.position === "VPP"
        ? "Veterinary Para-professional"
        : "—",
    "FIRST_NAME": app.first_name || "—",
    "LAST_NAME": app.last_name || "—",
    "GENDER": app?.profile?.gender || "—",
    "PHONE": app?.phone || "—",
    "COUNTY": app?.county || "—",
    "WARD": app?.ward || "—",
    "FPO": app?.fpo || "—",
    "LOCATION": app?.profile.location || "—",
    "IS_PWD": app?.profile.fpo || "—",
    "DISABILITY_TYPE": app?.profile.disability_type || "—",
    "PWD_CERTIFICATE": app?.profile.disability_certificate || "—",
    "BIO": app?.bio || "—",
    "EMAIL": app.email || app.user?.email || "—",
    "STATUS": app.is_shortlisted
      ? "Shortlisted"
      : app.is_not_shortlisted
      ? "Rejected"
      : app.status,
    "CVUploaded": app.cv ? app.cv : "No",
    "CoverLetterUploaded": app.cover_letter ? app.cover_letter : "No",
    "KVBCertificateUploaded": app.kvb_certificate ? app.kvb_certificate: "No",
    "ProfessionalCertificateUploaded": app.professional_certificate ? app.professional_certificate  : "No",
    "NationalIDUploaded": app.national_id_document ? app.national_id_document : "No",
    "DateCreated": app.created_at
      ? new Date(app.created_at).toLocaleDateString()
      : "—",
    "DateUpdated": app.updated_at
      ? new Date(app.updated_at).toLocaleDateString()
      : "—",
  }));

 const exportToExcel_OLD = () => {
  if (!applications) return;

  // filter shortlisted
  const shortlisted = applications.filter((app) => app.is_shortlisted === true);

  // format for excel
  const exportData = shortlisted.map((app, index) => ({
    "#": index + 1,
    "ApplicationID": app.id,
    Position:
      app.position === "VS"
        ? "Veterinary Surgeon"
        : app.position === "VPP"
        ? "Veterinary Para-professional"
        : "—",
    "FirstName": app.first_name || "—",
    "LastName": app.last_name || "—",
    Email: app.email || app.user?.email || "—",
    Status: app.is_shortlisted
      ? "Shortlisted"
      : app.is_not_shortlisted
      ? "Rejected"
      : app.status,
    "CVUploaded": app.cv ? app.cv : "No",
    "CoverLetterUploaded": app.cover_letter ? app.cover_letter : "No",
    "KVBCertificateUploaded": app.kvb_certificate ? app.kvb_certificate: "No",
    "ProfessionalCertificateUploaded": app.professional_certificate ? app.professional_certificate  : "No",
    "NationalIDUploaded": app.national_id_document ? app.national_id_document : "No",
    "DateCreated": app.created_at
      ? new Date(app.created_at).toLocaleDateString()
      : "—",
    "DateUpdated": app.updated_at
      ? new Date(app.updated_at).toLocaleDateString()
      : "—",
  }));

  // create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);

  // autosize columns
  const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
    wch: Math.max(key.length + 2, 15), // min 15 width
  }));
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Shortlisted Applications");

  // save file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    "shortlisted_applications.xlsx"
  );
};
  return (
    <div className="">
    
      {/* <h1 className="text-2xl font-bold mb-6">Shorlisted {user.county?.name ? `for ${user.county.name} county`:""}</h1> */}
      <h1 className="text-2xl font-bold mb-6">Shorlisted candidates</h1>

      {/* Export button */}
      {/* {JSON.stringify(applications)} */}
        <button
        disabled={shorlisted?.length === 0}
          onClick={exportToExcel}
          className={`${shorlisted?.length === 0 ? "bg-slate-300 cursor-not-allowed":"bg-green-600 hover:bg-green-700"} px-4 py-2  text-white rounded  transition mb-5 text-sm`}
        >
         Export to Excel
        </button>

        {
          shorlisted?.length === 0 ?
          <div className="bg-orange-300 p-5 rounded-md">
            <p className="text-orange-800">
              No shorlisted candidates
            </p>
          </div>
          :
           <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                #
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Application ID
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
                Date Updated
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {shorlisted?.map((app,index) => (
              <tr
                key={app.id}
                className={`${
                  app.status === "draft"
                    ? "bg-gray-200 text-gray-500"
                    : "bg-white"
                } border-t`}
              >
                <td className="px-4 py-2">{index+1}</td>

                <td className="px-4 py-2 max-w-[150px] truncate">{app?.id || "—"}</td>
                <td className="px-4 py-2">{app?.position || "—"}</td>

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
        }
    
    </div>
  );
}