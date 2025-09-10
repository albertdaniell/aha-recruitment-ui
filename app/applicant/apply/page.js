"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "akar-icons";
import AppModal from "@/app/components/AppModal/AppModal";
import {APP_FETCH} from "@/app/constants/FetchService"
import axios from "axios";

export default function ApplyPage() {
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState(false);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [application, setApplication] = useState(null);
  const [draftStatus, setDraftStatus] = useState("Draft");
  const [showConfirm, setShowConfirm] = useState(false); // confirmation popup
  const [messages, setMessages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showMessage, set_showMessage] = useState(null);
  const [Message, set_Message] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({}); // { fieldName: 0-100 }
 const [userData, setUserData] = useState(null);
  const openPdfModal = (url) => {
    setPdfUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };
  const router = useRouter();

  // ✅ Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await APP_FETCH(
          `${process.env.NEXT_PUBLIC_USER_ME_URL}`,
          "GET"
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUserData((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          county: data.county || "",
          subcounty: data.subcounty || "",
          ward: data.ward || "",
          fpo: data.fpo || "",
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfileAndApplication = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) return router.push("/aha/login");

      const token = loginData.access;

      try {
        
        let profileRes = await APP_FETCH(process.env.NEXT_PUBLIC_PROFILE_URL)

        setProfileExists(profileRes.ok);
        if(profileRes.ok){
          let data = await profileRes.json();

          setProfile(data)
        }

        // const appRes = await fetch(process.env.NEXT_PUBLIC_APPLICATION_URL, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        let appRes = await APP_FETCH(process.env.NEXT_PUBLIC_APPLICATION_URL)

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
      setApplication({ ...application, [name]: files[0], saved: false });
    }
  };

  let checkApplicationUnsaved=()=>{
    if(application){
      console.log({application})
// let check = application?.find((app)=>{
//       app?.saved === true
//     })

//     console.log(check)

//     return check
    }
    
  }
  useEffect(()=>{
    checkApplicationUnsaved()
  },[application])

  const handleFileSave_Old = async (field) => {
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
    //   const res = await fetch(process.env.NEXT_PUBLIC_APPLICATION_URL, {
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}` },
    //     body,
    //   });

        let res = await APP_FETCH(process.env.NEXT_PUBLIC_APPLICATION_URL,"POST",body)
      

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save the document. If you’ve already uploaded it, you can safely ignore this message. Click ‘View current document’ above the Save button to confirm your upload.");
      }

      const updated = await res.json();
      setApplication(updated);
      setDraftStatus(updated.status);
      // setMessage(`✅ ${field} saved successfully!`);

      let msg = `${field.replace("_", " ")} uploaded successfully ✅`;
      set_Message(msg);
      set_showMessage(true);

      setMessages((prev) => ({
        ...prev,
        [field]: msg,
      }));
    } catch (err) {
      let err_msg = `${field.replace("_", " ")} uploaded successfully ✅`;
      set_Message(err_msg);
      set_showMessage(true);

      setMessages((prev) => ({
        ...prev,
        [field]: err_msg,
      }));
      // setMessage(err.message);
    }
  };

  const handleFileSave = async (field) => {
    if (draftStatus === "submitted") return;
    const file = application?.[field];
    if (!file) return;

    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (!loginData) return router.push("/aha/login");
    const token = loginData.access;

    const body = new FormData();
    body.append(field, file);

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_APPLICATION_URL,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [field]: percent }));
          },
        }
      );

      const updated = res.data;
      setApplication(updated);
      setDraftStatus(updated.status);

      const msg = `✅ ${field.replace("_", " ")} uploaded successfully`;
      setMessages((prev) => ({ ...prev, [field]: msg }));
      set_Message(msg);
      set_showMessage(true);

      // reset progress
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
    } catch (err) {
      console.log({ err });
      const msg = `❌ Failed to upload ${field.replace("_", " ")}`;
      setMessages((prev) => ({ ...prev, [field]: msg }));
      set_Message(msg);
      set_showMessage(true);
    }
  };

  const isAllDocumentsSaved = () => {
    const requiredFields = [
      "cv",
      "cover_letter",
      "kvb_certificate",
      "professional_certificate",
      "national_id_document",
      "personal_insurance",

    ];

    let allSaved = true;

    requiredFields.forEach((field) => {
      const file = application?.[field];

      // No file uploaded → ignore
      if (!file) return;

      // File exists → check if it's marked as saved
      if (typeof file === "object" && !file.saved) {
        const msg = `⚠️ ${field.replace("_", " ")} file not saved!`;
        set_Message(msg);
        set_showMessage(true);
        setMessages((prev) => ({
          ...prev,
          [field]: msg,
        }));
        allSaved = false;
      }
    });

    return allSaved;
  };
  const handleSubmitApplication2 = async () => {
    setShowConfirm(true);
  };

  function hasAllCertificates(application) {
  const requiredFields = [
    "cv",
    "cover_letter",
    "kvb_certificate",
    "professional_certificate",
    "national_id_document",
  ];

  return requiredFields.every((field) => application[field] !== null);
}

  const handleSubmitApplication = () => {
    console.log({ application });
      if (application === null) {
      set_Message("Cannot submit. Some required information are missing");
      set_showMessage(true);
      return false;
    }

     if (!hasAllCertificates(application)) {
    set_Message("❌ Cannot submit. Some required certificates are missing.");
      set_showMessage(true);
      return false;
  }

  
    if (!isAllDocumentsSaved()) {
      set_Message(
        "🛑 You have uploaded documents that are not saved. Please save all documents before final submission."
      );
      set_showMessage(true);

      // alert(
      //   "You have uploaded documents that are not saved. Please save all documents before final submission."
      // );
      return;
    }
    setShowConfirm(true); // open the confirmation modal
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setMessage("");
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (!loginData) return router.push("/aha/login");

    const token = loginData.access;

    try {
    //   const res = await fetch(process.env.NEXT_PUBLIC_SUBMIT_APPLICATION_URL, {
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
        let res = await APP_FETCH(process.env.NEXT_PUBLIC_SUBMIT_APPLICATION_URL,"POST")


      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit application");
      }

      const updated = await res.json();
      setDraftStatus(updated.status);
      let msg = "🎉 Application submitted successfully!";
      setMessage(msg);
      set_Message(msg);
      set_showMessage(true);
    } catch (err) {
      setMessage(err.message);
      set_Message(err?.message || "Failed to submit your application");
      set_showMessage(true);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;

 if (!profileExists || (profileExists && !profile.is_updated)) {
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
}

  


  return (
    <div className="">
      <AppModal
        isOpen={showMessage}
        setIsClose={() => {
          set_showMessage(false);
          set_Message(null);
        }}
        // title={"Cannot submit"}
        body={<p>{Message}</p>}
      />
      {draftStatus === "submitted" &&
        (application?.is_shortlisted ? (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded">
            🎉 Congratulations! Your application has been shortlisted.
          </div>
        ) : application?.is_not_shortlisted ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
            ❌ Unfortunately, your application was not shortlisted.
          </div>
        ) : (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
            ✅ We have received your application.
          </div>
        ))}

      <h1 className="text-4xl font-bold mb-2">Application</h1>
      <p className="text-lg mb-2">
        <strong>Status:</strong> {draftStatus}
      </p>
      <div className="flex shrink gap-3 items-center">
        <img
                src={profile.profile_picture}
                alt="image"
                // alt={`${app.first_name} ${app.last_name}`}
                className="w-12 h-12 rounded-full border object-cover my-5"
              />
              <p className="text-slate-600">Applying as {userData?.first_name} {userData?.last_name} </p>
      </div>
      {application?.id && (
        <p className="text-sm mb-4 text-slate-500">
          Application ID: {application?.id}
        </p>
      )}

      {/* 🔑 Position Field */}
<div className="bg-white p-6 shadow-md rounded-2xl mb-6">
  <label className="block font-semibold mb-2">Position</label>
  <select
    name="position"
    value={application?.position || ""}
    onChange={async (e) => {
      const selected = e.target.value;
      setApplication((prev) => ({ ...prev, position: selected }));

      // ✅ Save immediately to backend using axios
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) return router.push("/aha/login");
      const token = loginData.access;

      const body = new FormData();
      body.append("position", selected);

      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_APPLICATION_URL,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updated = res.data; // ✅ axios already parses JSON
        setApplication(updated);
        set_Message("✅ Position saved successfully");
        set_showMessage(true);
      } catch (err) {
        console.error("❌ Failed to save position", err);
        set_Message("❌ Failed to save position");
        set_showMessage(true);
      }
    }}
    disabled={draftStatus === "submitted"}
    className={`w-full p-2 border rounded ${
      draftStatus === "submitted" ? "cursor-not-allowed opacity-50" : ""
    }`}
  >
    <option value="" disabled>-- Select Position --</option>
    <option value="VS">Veterinary Surgeon (VS)</option>
    <option value="VPP">Veterinary Para-professional (VPP)</option>
  </select>

  {application?.position && (
    <p className="mt-2 text-sm text-gray-600">
      Current selection:{" "}
      <strong>
        {application?.position === "VS"
          ? "Veterinary Surgeon"
          : "Veterinary Para-professional"}
      </strong>
    </p>
  )}
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "CV", field: "cv" },
          { label: "Cover Letter", field: "cover_letter" },
          { label: "KVB Certificate", field: "kvb_certificate" },
          {
            label: "Professional Certificate",
            field: "professional_certificate",
          },
          { label: "National ID Document", field: "national_id_document" },
        //   { label: "Personal Insurance", field: "personal_insurance" },

        ].map(({ label, field }) => (
          <div key={field} className="bg-white p-6 shadow-md rounded-2xl">
            <label className="block font-semibold mb-2">{label}</label>
            {messages[field] && (
              <p className="mb-4 text-green-600 text-sm">{messages[field]}</p>
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
            {uploadProgress[field] > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress[field]}%` }}
                ></div>
              </div>
            )}
            <hr className="my-5"></hr>
            <div className="flex flex-col justify-between "></div>

            {application &&
              application[field] &&
              typeof application[field] === "string" && (
                <div className="flex flex-col space-y-2">
                  {/* <p className="text-gray-600">Current: {application[field].split("/").pop()}</p> */}

                  {/* View Button */}
                  <button
                    onClick={() => openPdfModal(application[field])}
                    className="py-2  text-blue-600  transition text-sm"
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
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold bg-red-500  rounded-full h-6 w-6"
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
          disabled={draftStatus === "submitted" || !application}
          className={`w-full py-3 rounded-lg font-bold text-white text-lg transition flex gap-5 items-center justify-center ${
            draftStatus === "submitted" || !application
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
