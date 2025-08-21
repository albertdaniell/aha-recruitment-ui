"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "akar-icons";

export default function ApplyPage() {
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [application, setApplication] = useState(null);
  const [draftStatus, setDraftStatus] = useState("Draft");
  const [showConfirm, setShowConfirm] = useState(false); // confirmation popup
  const [messages, setMessages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const openPdfModal = (url) => {
    setPdfUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndApplication = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) return router.push("/aha/login");

      const token = loginData.access;

      try {
        const profileRes = await fetch("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileExists(profileRes.ok);

        const appRes = await fetch("http://localhost:8000/api/application/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (appRes.ok) {
          const data = await appRes.json();
          setApplication(data);
          setDraftStatus(data.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndApplication();
  }, [router]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setApplication({ ...application, [name]: files[0] });
    }
  };

  const handleFileSave = async (field) => {
    if (draftStatus === "submitted") return;
    if (!application || !application[field]) return; // <-- prevents null access

    setMessage("");
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (!loginData) {
      router.push("/aha/login");
      return;
    }
    const token = loginData.access;

    const body = new FormData();
    body.append(field, application[field]);

    try {
      const res = await fetch("http://localhost:8000/api/application/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save document");
      }

      const updated = await res.json();
      setApplication(updated);
      setDraftStatus(updated.status);
      // setMessage(`✅ ${field} saved successfully!`);

      setMessages((prev) => ({
        ...prev,
        [field]: `${field.replace("_", " ")} uploaded successfully ✅`,
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [field]: `Failed to upload ${field.replace("_", " ")}`,
      }));
      // setMessage(err.message);
    }
  };
  const handleSubmitApplication = async () => {
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setMessage("");
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (!loginData) return router.push("/aha/login");

    const token = loginData.access;

    try {
      const res = await fetch("http://localhost:8000/api/application/submit/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit application");
      }

      const updated = await res.json();
      setDraftStatus(updated.status);
      setMessage("🎉 Application submitted successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;

  if (!profileExists)
    return (
      <div className="p-8 text-center">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">Oops! 🚫</h1>
        <p className="text-xl text-gray-700 mb-6">
          You need to <span className="font-bold">update your profile</span>{" "}
          before applying.
        </p>
        <button
          onClick={() => router.push("/applicant/profile")}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-teal-700 transition"
        >
          Update Profile Now
        </button>
      </div>
    );

  return (
    <div className="">
      {draftStatus === "submitted" && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
          ✅ We have received your application.
        </div>
      )}

      <h1 className="text-4xl font-bold mb-2">Application</h1>
      <p className="text-lg mb-6">
        <strong>Status:</strong> {draftStatus}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "CV", field: "cv" },
          { label: "Cover Letter", field: "cover_letter" },
          { label: "KVB Certificate", field: "kvb_certificate" },
          {
            label: "Professional Certificate",
            field: "professional_certificate",
          },
          { label: "National ID Document", field: "national_id_document" },
        ].map(({ label, field }) => (
          <div key={field} className="bg-white p-6 shadow-md rounded-2xl">
            <label className="block font-semibold mb-2">{label}</label>
            {messages[field] && (
              <p className="mb-4 text-green-600">{messages[field]}</p>
            )}
            <input
              type="file"
              name={field}
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={draftStatus === "submitted"}
              className={`w-full file:py-2 file:px-4 file:border-0 file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 rounded mb-3 ${
                draftStatus === "submitted"
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            />
            <hr className="my-5"></hr>
            <div className="flex flex-col justify-between ">

                </div>
                

            {application && application[field] && typeof application[field] === "string" && (
            <div className="flex flex-col space-y-2">
              {/* <p className="text-gray-600">Current: {application[field].split("/").pop()}</p> */}

              {/* View Button */}
              <button
                onClick={() => openPdfModal(application[field])}
                className="py-2  text-blue-600  transition"
              >
                View Current {label}
              </button>
            </div>
          )}
            <button
              onClick={() => handleFileSave(field)}
              disabled={
                draftStatus === "submitted" ||
                !application ||
                !application[field]
              }
              className={`w-full py-2 rounded-lg font-bold transition ${
                draftStatus === "submitted" ||
                !application ||
                !application[field]
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Save {label}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-xl shadow-lg overflow-hidden relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold"
            >
              ✕
            </button>
            {/* PDF iframe */}
            <iframe src={pdfUrl} title="PDF Viewer" className="w-full h-full" />
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSubmitApplication}
          disabled={draftStatus === "submitted"}
          className={`w-full py-3 rounded-lg font-bold text-white text-lg transition flex gap-5 items-center justify-center ${
            draftStatus === "submitted"
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#009639] hover:bg-green-700"
          }`}
        >
          <Send />{" "}
          {draftStatus === "submitted"
            ? "Already Submitted"
            : "Submit Application"}
        </button>
      </div>

      {/* Tailwind Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-6">
              Are you sure you want to submit your application? Once submitted,
              you won't be able to edit documents.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
