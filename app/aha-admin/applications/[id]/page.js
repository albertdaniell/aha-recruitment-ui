"use client";
import AppModal from "@/app/components/AppModal/AppModal";
import { FormatDate } from "@/app/constants/utils";
import { Check, Cross } from "akar-icons";
import { Spinner } from "flowbite-react";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicationDetails({ params }) {
  const router = useRouter();
  const { id } = params;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [showDoneShortlist, setShowDownShortlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(true);
  let [msg,set_msg] = useState("Done shortlisting!")

  async function fetchApplicationDetail() {
    try {
      const loginDataRaw = localStorage.getItem("login_response");
      if (!loginDataRaw) {
        router.push("/aha/login");
        return;
      }

      const loginData = JSON.parse(loginDataRaw);
      const token = loginData?.access;
      if (!token) {
        router.push("/aha/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL}${id}/`,
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
        throw new Error(`Failed to fetch application: ${res.status}`);
      }

      const data = await res.json();
      setApplication(data);
    } catch (err) {
      console.error("Error fetching application", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchApplicationDetail();
  }, [id]);

  async function handleActionConfirm() {
    if (!actionType) return;



    try {
      setLoading2(true);
      const loginDataRaw = localStorage.getItem("login_response");
      const loginData = JSON.parse(loginDataRaw);
      const token = loginData?.access;

      let body =
        actionType === "shortlist"
          ? { is_shortlisted: true, is_not_shortlisted: false }
          : { is_shortlisted: false, is_not_shortlisted: true };

          console.log({body})

          // return 0

          let url = process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL

          if(actionType === "recruit"){
            url = process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL
            body = {
              is_recruited:true
            }
          }

    console.log({url})

    // return 0


      const res = await fetch(
        `${url}${id}/${actionType === "recruit" ? "recruit":"shortlist"}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      // console.log(await re))
      console.log({res})

      if (!res.ok) {
        let res_json = await res.json();
        console.log({res_json})
        console.log(res_json);
        setLoading2(false);

        if (res_json?.detail) {
          // alert(0)
          throw new Error(res_json?.detail);
        } else {
          throw new Error("Failed to update shortlist status");
        }
      }


      const updated = await res.json();
      console.log({updated})
      if(updated?.detail){
        set_msg(updated?.detail)
      }
      setApplication((prev) => ({ ...prev, ...updated }));
      setLoading2(false);
      setShowDownShortlist(true);
      if (id) fetchApplicationDetail();
    } catch (err) {
      set_msg(`${err}`)
          setShowDownShortlist(true);
      // console.log(`Error : ${err}`)
      setLoading(false);
      // console.error(err);
      // alert(err);
      // alert("Something went wrong while updating status.");
    } finally {
      setLoading2(false);
      setShowModal(false);
      setActionType(null);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!application) return <p className="p-6">Application not found</p>;
  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-md  mb-4"><Link className="text-blue-500 hover:underline" href={"/aha-admin/applications/"}>Back to Applications</Link> / <Link href={"#"}>Application Details</Link></h1>

      <div className="border rounded-lg shadow-sm">
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded-t-lg"
        >
          <span className="text-green-400">
            {application.first_name} {application.last_name} (
            {application.email})
          </span>
          <span>{accordionOpen ? "▲" : "▼"}</span>
        </button>

        {accordionOpen && (
          <div className="p-6 border-t grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ✅ Left Column */}
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                  Applicant Info
                </h3>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {application.first_name} {application.last_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {application.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {application.phone || "—"}
                </p>
                <p>
                  <span className="font-medium">County:</span>{" "}
                  {application.county || "—"}
                </p>
                <p>
                  <span className="font-medium">Subcounty:</span>{" "}
                  {application.subcounty || "—"}
                </p>
                <p>
                  <span className="font-medium">Ward:</span>{" "}
                  {application.ward || "—"}
                </p>
                {
                  application?.fpo &&
<p>
                  <span className="font-medium">FPO:</span>{" "}
                  {application.fpo || "—"}
                </p>
                }
                
              </div>

              {/* Profile Info */}
              {application.profile && (
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                    Profile Info
                  </h3>
                  {application.profile.profile_picture && (
                    <div className="mb-3">
                      <img
                        src={application.profile.profile_picture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border object-cover"
                      />
                    </div>
                  )}
                  <p>
                    <span className="font-medium">Bio:</span>{" "}
                    {application.profile.bio || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {application.profile.location || "—"}
                  </p>
                  <p>
                    <span className="font-medium">DOB:</span>{" "}
                    {FormatDate(application.profile.date_of_birth, false) ||
                      "—"}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {application.profile.gender || "—"}
                  </p>
                  <p>
                    <span className="font-medium">PWD:</span>{" "}
                    {application.profile.is_pwd ? "✅ Yes" : "❌ No"}
                  </p>
                  {application.profile.is_pwd && (
                    <>
                      <p>
                        <span className="font-medium">Disability Type:</span>{" "}
                        {application.profile.disability_type || "—"}
                      </p>
                      <p>
                        <span className="font-medium">Certificate:</span>{" "}
                        {application.profile.disability_certificate ? (
                          <a
                            href={application.profile.disability_certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ✅ Right Column */}
            <div className="space-y-6">
              {/* Application Info */}
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                  Application Info
                </h3>
                <p>
                  <span className="font-medium">Position:</span>{" "}
                  {application.position === "VS"
                    ? "Veterinary Surgeon"
                    : "Veterinary Para-professional"}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-600">
                    {application.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Shortlisted:</span>{" "}
                  {application.is_shortlisted ? "✅ Yes" : "❌ No"}
                </p>
                <p>
                  <span className="font-medium">Rejected:</span>{" "}
                  {application.is_not_shortlisted ? "✅ Yes" : "❌ No"}
                </p>
                <p>
                  <span className="font-medium">Recruited:</span>{" "}
                  {application.is_recruited ? "✅ Yes" : "❌ No"}
                </p>

                {/* ✅ New date fields */}
                <p>
                  <span className="font-medium">Submission Date:</span>{" "}
                  {application.submission_date
                    ? new Date(application.submission_date).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <span className="font-medium">Date Shortlisted:</span>{" "}
                  {application.date_shortlisted
                    ? new Date(application.date_shortlisted).toLocaleString()
                    : "—"}
                </p>
                <p>
                  <span className="font-medium">Date Rejected:</span>{" "}
                  {application.date_rejected
                    ? new Date(application.date_rejected).toLocaleString()
                    : "—"}
                </p>

                {/* Existing timestamps */}
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(application.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Updated At:</span>{" "}
                  {new Date(application.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700  flex flex-row gap-5"
          onClick={() => {
            setShowModal(true);
            setActionType("shortlist ✅");
          }}
        >
          <Check /> Shortlist
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex flex-row gap-5"
          onClick={() => {
            setShowModal(true);
            setActionType("reject ❌");
          }}
        >
          <Cross /> Reject
        </button>

          <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex flex-row gap-5"
          onClick={() => {
            setShowModal(true);
            setActionType("recruit");
          }}
        >
          <Briefcase /> Recruit
        </button>
      </div>

      {/* Modal */}
      <AppModal
        isOpen={showDoneShortlist}
        setIsClose={() => {
          setShowDownShortlist(false);
        }}
        // title={"Cannot submit"}
        body={<p>{msg}</p>}
      />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm {actionType}</h2>
            <p>
              Are you sure you want to{" "}
              <span className="font-bold">
                {actionType}
              </span>{" "}
              this application/user? This will trigger an email to the user informing them of the status of their application.
            </p>
            {loading2 ? (
              <Spinner className="mt-3" />
            ) : (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded ${
                    actionType === "shortlist"
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  onClick={handleActionConfirm}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents */}
      {/* {JSON.stringify(application)} */}
      {/* ⚠️ Draft Warning */}
{application?.status === "draft" && (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4 rounded">
    <p>
      This application is still in <strong>Draft</strong> mode and has not been submitted yet.
    </p>
  </div>
)}


{/* ⚠️ Missing Documents Warning */}
{(() => {
  const requiredDocs = [
    { label: "Cover Letter", key: "cover_letter" },
    { label: "CV", key: "cv" },
    { label: "KVB Certificate", key: "kvb_certificate" },
    { label: "National ID", key: "national_id_document" },
    { label: "Professional Certificate", key: "professional_certificate" },
  ];

  const missingDocs = requiredDocs.filter((doc) => !application[doc.key]);

  if (missingDocs.length > 0) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
        <p className="font-semibold mb-2">
          Some required documents are missing:
        </p>
        <ul className="list-disc list-inside">
          {missingDocs.map((doc) => (
            <li key={doc.key}>{doc.label}</li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
})()}
      <h2 className="text-xl font-semibold mt-6 mb-4">Documents</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { label: "Cover Letter", url: application.cover_letter },
          { label: "CV", url: application.cv },
          { label: "KVB Certificate", url: application.kvb_certificate },
          { label: "National ID", url: application.national_id_document },
          {
            label: "Professional Certificate",
            url: application.professional_certificate,
          },
          // { label: "Personal Insurance", url: application.personal_insurance },
        ].map(
          (doc) =>
            doc.url && (
              <div key={doc.label} className="border rounded-lg p-2">
                <p className="font-semibold mb-2">{doc.label}</p>
                <iframe
                  src={doc.url}
                  className="w-full h-[600px] border rounded"
                  title={doc.label}
                />
                <div className="my-3">
                  <Link
                    href={doc.url}
                    className="text-blue-600 underline break-all text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.url}
                  </Link>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
