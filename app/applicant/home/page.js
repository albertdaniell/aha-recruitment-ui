"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, InfoFill, Person } from "akar-icons";
import { FormatDate } from "@/app/constants/utils";
import Stepper from "./Stepper";
export default function HomePage() {
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null); // store user application
  const [userCounty, setUserCounty] = useState(null); // store user application
  const [counties, setCounties] = useState(null);
  const router = useRouter();

  let [currentStep, setCurrentStep] = useState(0);

  let defineCurrentStep = () => {
    if (hasProfile) {
      setCurrentStep(1);
      if (application) {
        if (application?.status === "draft") {
          setCurrentStep(2);
        }
        if (application?.status === "submitted") {
          setCurrentStep(3);
        }
        if (application?.is_shortlisted === "submitted") {
          setCurrentStep(4);
        }
        // application?.is_not_shortlisted
      }
    }
  };

  useEffect(() => {
    defineCurrentStep();
  }, [hasProfile, application]);

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
    const fetchUserData = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) {
        router.push("/aha/login");
        return;
      }
      setUser(loginData.user);

      const token = loginData.access;

      try {
        // Check profile
        let profileRes = await fetch(process.env.NEXT_PUBLIC_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        profileRes = await profileRes.json();

        console.log(profileRes);
        if (profileRes.is_updated) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }

        // Get application
        const appRes = await fetch(process.env.NEXT_PUBLIC_APPLICATION_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (appRes.ok) {
          const data = await appRes.json();
          setApplication(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleApply = () => {
    if (hasProfile && application?.status !== "submitted") {
      router.push("/applicant/apply");
    }
  };

  const handleHelp = () => {
    router.push("/applicant/help");
  };

  const handleUpdateProfile = () => {
    router.push("/applicant/profile");
  };
  const handleUpdateAccount = () => {
    router.push("/applicant/user");
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="">
      {/* Welcome Header */}
      {/* {JSON?.stringify(userCounty)} */}

      {userCounty && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 items-start justify-between">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-[#009639]">
              Welcome, {user.first_name} {user.last_name}!
            </h1>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
            {user.fpo?.name && (
              <p className="text-slate-500 mt-2 text-sm">
                FPO: {user.fpo?.name}
              </p>
            )}
          </div>

          {/* RIGHT SIDE */}
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
                {userCounty?.project}
              </p>
              <p className="text-slate-500 text-xs">
                {userCounty?.is_open ? (
                  <>
                    Ends:{" "}
                    {FormatDate(userCounty.end_of_application, false) ||
                      "Not specified"}
                  </>
                ) : (
                  <span className="text-orange-500">
                    🚫 Applications closed
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        {/* <p className="text-gray-600 mt-2">
          Get started by updating your profile or applying to the program.
        </p> */}
        {application?.status === "submitted" &&
          !application?.is_shortlisted &&
          !application?.is_not_shortlisted && (
            <p className=" p-4 bg-green-100 text-green-800 rounded-lg font-semibold">
              ✅ We have received your application! Thank you for submitting.
            </p>
          )}

        {application?.status === "submitted" && application?.is_shortlisted && (
          <p className=" p-4 bg-blue-100 text-blue-800 rounded-lg font-semibold">
            🎉 Congratulations! Your application has been shortlisted. We’ll
            contact you with the next steps.
          </p>
        )}

        {application?.status === "submitted" &&
          application?.is_not_shortlisted && (
            <p className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg font-semibold">
              ❌ Unfortunately, your application was not shortlisted. We
              appreciate your effort and encourage you to apply for future
              opportunities.
            </p>
          )}
      </div>

      {/* Cards */}
      <Stepper currentStep={currentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Profile Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <Person color="#009639" size={40} />
            <h2 className="text-2xl font-bold mb-2 mt-3">Update Profile</h2>
            <p className="text-gray-600">
              Keep your personal information up to date before making an
              application
            </p>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-5">
            <button
              onClick={handleUpdateProfile}
              className="w-full mt-6 bg-[#009639] text-white py-3 rounded-lg hover:bg-[#007a2f] text-lg font-bold transition"
            >
              Update Profile
            </button>

            <button
              onClick={handleUpdateAccount}
              className="w-full sm:mt-6 mt-3 border border-[#009639] text-[#009639] py-3 rounded-lg hover:bg-[#f4f4f4] text-lg  transition"
            >
              User Account
            </button>
          </div>
        </div>

        {/* Apply Now / Continue Application Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <Clipboard color="indigo" size={40} />
            <h2 className="text-lg font-bold mb-2 mt-3">
  {!userCounty?.is_open ? (
    // 🔴 When county is closed
    `🚫 Applications Closed${
      userCounty?.end_of_application
        ? ` — Deadline was ${FormatDate(userCounty.end_of_application, false)}`
        : ""
    }`
  ) : application ? (
    // 🟡 When application exists
    application.status === "draft" ? (
      `Continue Your Application${
        userCounty?.end_of_application
          ? ` (Deadline: ${FormatDate(userCounty.end_of_application, false)})`
          : " — Deadline Not Specified"
      }`
    ) : (
      // ✅ Submitted application
      "✅ Application Submitted"
    )
  ) : (
    // 🟢 No application yet
    `Apply Now${
      userCounty?.end_of_application
        ? ` (Deadline: ${FormatDate(userCounty.end_of_application, false)})`
        : " — Deadline Not Specified"
    }${
      user?.county?.name ? ` for ${user.county.name}` : ""
    } & Upload Documents`
  )}
</h2>
           <p className="text-gray-600">
  {!userCounty?.is_open ? (
    // 🔴 County closed
    `Applications for ${user?.county?.name || "your county"} are now closed.${
      userCounty?.end_of_application
        ? ``
        : ""
    }`
  ) : !hasProfile ? (
    // 🟡 No profile yet
    "👤 Please complete your profile before applying."
  ) : application ? (
    // 🟢 Has an application
    application.status === "draft" ? (
      "📝 You have a draft application. Continue uploading your documents and submit before the deadline."
    ) : application.is_shortlisted ? (
      "🎉 Congratulations! Your application has been shortlisted."
    ) : application.is_not_shortlisted ? (
      "❌ Unfortunately, your application was not shortlisted."
    ) : (
      "✅ Your application has been submitted and is under review."
    )
  ) : (
    // 🟢 No application yet
    "Apply to available programs and submit your certificates for review."
  )}
</p>
          </div>
          <button
            onClick={handleApply}
            disabled={
              !hasProfile ||
              application?.status === "submitted" ||
              !userCounty?.is_open
            }
            className={`mt-6 w-full py-3 rounded-lg text-lg font-semibold transition-colors duration-200
    ${
      !hasProfile || application?.status === "submitted" || !userCounty?.is_open
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
    }
  `}
          >
            {!userCounty?.is_open
              ? "Applications Closed"
              : application
              ? application.status === "draft"
                ? "Continue Your Application"
                : "Application Submitted"
              : "Apply Now"}
          </button>
        </div>

        {/* Complaints / Help Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <InfoFill color="#9e590b" size={40} />

            <h2 className="text-2xl font-bold mb-2 mt-3">Complaints / Help</h2>
            <p className="text-gray-600">
              Need assistance or want to submit a complaint? We are here to help
              you!
            </p>
          </div>
          <button
            onClick={handleHelp}
            className="mt-6 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 text-lg font-bold transition"
          >
            Get Help
          </button>
        </div>
      </div>
    </div>
  );
}
