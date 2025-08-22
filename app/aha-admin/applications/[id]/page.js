"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicationDetails({ params }) {
  const router = useRouter();
  const { id } = params;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "shortlist" | "reject"

  async function fetchApplicationDetail() {
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL}${id}/`, {
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
      const loginDataRaw = localStorage.getItem("login_response");
      const loginData = JSON.parse(loginDataRaw);
      const token = loginData?.access;

      const body =
        actionType === "shortlist"
          ? { is_shortlisted: true, is_not_shortlisted: false }
          : { is_shortlisted: false, is_not_shortlisted: true };

      const res = await fetch(`${process.env.NEXT_PUBLIC_APPLICATION_DETAIL_URL}${id}/shortlist/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to update shortlist status");
      }

      const updated = await res.json();
      setApplication((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating status.");
    } finally {
      setShowModal(false);
      setActionType(null);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!application) return <p className="p-6">Application not found</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl mt-6">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>

      <div className="space-y-3">
        <p><span className="font-semibold">Name:</span> {application.first_name} {application.last_name}</p>
        <p><span className="font-semibold">Email:</span> {application.email}</p>
        <p><span className="font-semibold">Status:</span> 
          <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-600">{application.status}</span>
        </p>
        <p><span className="font-semibold">Shortlisted:</span> {application.is_shortlisted ? "✅ Yes" : "❌ No"}</p>
        <p><span className="font-semibold">Rejected:</span> {application.is_not_shortlisted ? "✅ Yes" : "❌ No"}</p>
        <p><span className="font-semibold">Created At:</span> {new Date(application.created_at).toLocaleString()}</p>
        <p><span className="font-semibold">Updated At:</span> {new Date(application.updated_at).toLocaleString()}</p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => { setShowModal(true); setActionType("shortlist"); }}
        >
          ✅ Shortlist
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          onClick={() => { setShowModal(true); setActionType("reject"); }}
        >
          ❌ Reject
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p>
              Are you sure you want to{" "}
              <span className="font-bold">
                {actionType === "shortlist" ? "shortlist ✅" : "reject ❌"}
              </span>{" "}
              this application?
            </p>
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
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={handleActionConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Documents</h2>
      <ul className="space-y-2">
        <li><a href={application.cover_letter} target="_blank" className="text-blue-600 underline">📄 Cover Letter</a></li>
        <li><a href={application.cv} target="_blank" className="text-blue-600 underline">📄 CV</a></li>
        <li><a href={application.kvb_certificate} target="_blank" className="text-blue-600 underline">📄 KVB Certificate</a></li>
        <li><a href={application.national_id_document} target="_blank" className="text-blue-600 underline">📄 National ID</a></li>
        <li><a href={application.professional_certificate} target="_blank" className="text-blue-600 underline">📄 Professional Certificate</a></li>
      </ul>
    </div>
  );
}