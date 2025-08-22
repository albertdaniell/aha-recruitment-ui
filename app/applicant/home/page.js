"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, InfoFill, Person } from "akar-icons";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null); // store user application

  const router = useRouter();

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
        const profileRes = await fetch(process.env.NEXT_PUBLIC_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasProfile(profileRes.ok);

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

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="">
      {/* Welcome Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#009639]">
          Welcome, {user.first_name} {user.last_name}!
        </h1>
        <p className="text-gray-600 mt-2">Email: {user.email}</p>
        <p className="text-gray-600 mt-2">
          Get started by updating your profile or applying to the program.
        </p>
        {application?.status === "submitted" &&
          !application?.is_shortlisted &&
          !application?.is_not_shortlisted && (
            <p className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-semibold">
              ✅ We have received your application! Thank you for submitting.
            </p>
          )}

        {application?.status === "submitted" && application?.is_shortlisted && (
          <p className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg font-semibold">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Profile Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <Person size={40} />
            <h2 className="text-2xl font-bold mb-2 mt-5">Update Profile</h2>
            <p className="text-gray-600">
              Keep your personal information up to date before making an
              application
            </p>
          </div>
          <button
            onClick={handleUpdateProfile}
            className="mt-6 bg-[#009639] text-white py-3 rounded-lg hover:bg-[#007a2f] text-lg font-bold transition"
          >
            Update Profile
          </button>
        </div>

        {/* Apply Now / Continue Application Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <Clipboard size={40} />
            <h2 className="text-2xl font-bold mb-2 mt-5">
              {application
                ? application.status === "draft"
                  ? "Continue Your Application- Deadline (25th Aug)"
                  : "Application Submitted"
                : `Apply Now ${user.county?.name ? `for ${user.county.name}`:""} & Upload Certificates`}
            </h2>
            <p className="text-gray-600">
              {hasProfile
                ? application
                  ? application.status === "draft"
                    ? "You have a draft application. Continue uploading your documents and submit."
                    : application.is_shortlisted
                    ? "🎉 Congratulations! Your application has been shortlisted."
                    : application.is_not_shortlisted
                    ? "❌ Unfortunately, your application was not shortlisted."
                    : "Your application has been submitted and is under review."
                  : "Apply to available programs and submit your certificates for review."
                : "Please update your profile before applying."}
            </p>
          </div>
          <button
            onClick={handleApply}
            disabled={
              !hasProfile || (application && application.status === "submitted")
            }
            className={`mt-6 py-3 rounded-lg text-lg font-bold transition ${
              !hasProfile || (application && application.status === "submitted")
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {application
              ? application.status === "draft"
                ? "Continue Application"
                : "Application Submitted"
              : "Apply Now"}
          </button>
        </div>

        {/* Complaints / Help Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <InfoFill size={40} />

            <h2 className="text-2xl font-bold mb-2 mt-5">Complaints / Help</h2>
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
