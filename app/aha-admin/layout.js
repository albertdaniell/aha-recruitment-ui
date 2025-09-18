"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircleX, ThreeLineHorizontal } from "akar-icons";
import { FormatDate } from "../constants/utils";
import AppModal from "../components/AppModal/AppModal";
import { APP_FETCH } from "../constants/FetchService";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const [userCounty, setUserCounty] = useState(null); // store user application
  const [counties, setCounties] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading2(true);
    setErrors({});
    try {
      let formData = {
        has_agreed_to_terms: true,
      };
      const payload = { ...formData };

      const res = await APP_FETCH(
        `${process.env.NEXT_PUBLIC_USER_UPDATE_URL}`,
        "PATCH",
        JSON.stringify(payload),
        "application/json"
      );

      if (!res.ok) {
        const errData = await res.json();
        setErrors(errData);
        setModalBody("❌ Failed to update profile. Please check the errors.");
        setShowModal(true);
        throw new Error("Update failed");
      }

      setModalBody(
        "✅ Profile updated successfully! You will be required to login again to refresh your changes."
      );
      setLoading2(false);

      setShowModal(true);

      handleLogout();
    } catch (err) {
      setLoading2(false);
      console.error(err);
    } finally {
      setLoading2(false);
    }
  };

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
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (loginData && loginData.user) {
      setUser(loginData.user);
      // 🚨 If role is NOT REVIEWER, redirect away
      let role = loginData.user.role;
      if (role === "REVIEWER" || role === "ADMIN") {
        console.log({ role });
        // router.push("/aha/login"); // or maybe "/not-authorized"
      }
    } else {
      router.push("/aha/login");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (counties && user) {
      let county = counties?.find((c) => c?.id === user.county?.id);
      setUserCounty(county);
    }
  }, [user, counties]);

  let links_1 = [
    { name: "Home", href: "/aha-admin/home" },
    { name: "Applications", href: "/aha-admin/applications" },
    { name: "Shortlisted", href: "/aha-admin/shortlisted" },
    { name: "County Settings", href: "/aha-admin/county-setting" },
    // { name: "Advertisement", href: "/applicant/advertisement" },
    { name: "Website Home", href: "/" },

    // { name: "Users", href: "/aha-admin/users" },
  ];

  const links_2 = [
    { name: "Home", href: "/aha-admin/home" },
    { name: "Applications", href: "/aha-admin/applications" },
    { name: "Shortlisted", href: "/aha-admin/shortlisted" },
    // { name: "Advertisement", href: "/applicant/advertisement" },
    { name: "Website Home", href: "/" },

    // { name: "Users", href: "/aha-admin/users" },
  ];
  const links_3 = [
    { name: "Home", href: "/aha-admin/home" },
    { name: "Applications", href: "/aha-admin/applications" },
    { name: "Shortlisted", href: "/aha-admin/shortlisted" },
    // { name: "Advertisement", href: "/applicant/advertisement" },
    { name: "Website Home", href: "/" },

    // { name: "Users", href: "/aha-admin/users" },
  ];

  const sidebarLinks =
    user?.role === "REVIEWER"
      ? user?.role === "ADMIN"
        ? links_3
        : links_1
      : links_2;

  const handleLogout = () => {
    localStorage.removeItem("login_response");
    router.push("/aha/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (
    !user ||
    (user.role !== "REVIEWER" &&
      user.role !== "ADMIN" &&
      user.role !== "FPO" &&
      user.role !== "SUPERADMIN")
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-xl font-semibold">
          Access Denied — Reviewer role required.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ✅ Success/Error Modal */}
      <AppModal
        isOpen={showModal}
        setIsClose={() => {
          setShowModal(false);
          handleLogout();
        }}
        body={<p>{modalBody}</p>}
      />

      {user?.has_agreed_to_terms ? (
        <>
          {/* Mobile Menu Button */}
          <div className="md:hidden absolute top-4 left-4 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-white rounded shadow"
            >
              {sidebarOpen ? (
                <CircleX size={24} color="red" />
              ) : (
                <ThreeLineHorizontal color="green" size={24} />
              )}
            </button>
          </div>

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-teal-900 shadow-md p-6 flex flex-col justify-between transform transition-transform duration-300 z-40
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
          >
            <div className="mt-14 md:mt-0">
              <h2 className="text-xl font-bold mb-4 text-white">Dashboard</h2>
              <nav className="flex flex-col space-y-1">
                {(user?.role === "REVIEWER" || user?.role === "FPO") && (
                  <div className="inline-flex items-center gap-3 px-2 py-3 border-green-500 border rounded-lg  bg-white mb-5">
                    <img
                      src={userCounty?.logo || "/cog.png"}
                      alt={userCounty?.name}
                      className="w-9 h-9 object-contain rounded-md"
                    />
                    <div className="min-w-0">
                      <h2 className="font-semibold truncate text-slate-600 text-xs">
                        {userCounty?.name} County
                      </h2>
                      <p className="text-slate-500 text-xs">
                        Ends:{" "}
                        {FormatDate(userCounty?.end_of_application, false) ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                )}

                {sidebarLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded  hover:text-teal-600 hover:bg-gray-50 ${
                        isActive
                          ? "bg-white text-slate-700 font-semibold"
                          : "text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                {/* {sidebarLinks.map((link) => {
              const isActive = pathname?.includes(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded  hover:text-teal-600 hover:bg-gray-50 ${
                    isActive ? "bg-white text-slate-700 font-semibold" : "text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })} */}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 md:px-14 px-4 md:py-8 py-4 md:ml-64 mt-14 md:mt-0 overflow-auto">
            {children}
          </main>
        </>
      ) : (
        <>
          <AppModal
            setIsClose={() => {}}
            showClose={false}
            className1="fixed inset-0 flex items-center  justify-center z-50"
            className2="bg-white rounded-lg shadow-lg max-w-4xl w-full z-10 p-6 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-in"
            title="User Data Privacy & Security Disclaimer"
            isOpen={true}
            body={
              <>
                <div className="bg-white shadow-md  p-6  overflow-auto max-h-[400px] text-gray-800">
                  <p className="mb-4">
                    {user?.first_name} {user?.last_name}, as a registered user
                    of this system (including{" "}
                    <strong>FPOs, Admins, and Superadmins</strong>), you are
                    entrusted with handling sensitive personal data of
                    applicants and other system users. In line with the{" "}
                    <strong>Data Protection Act, 2019</strong> and other
                    applicable regulations, you are required to observe the
                    highest standards of confidentiality, integrity, and
                    accountability when managing this data.
                  </p>

                  <p className="mb-2 font-semibold">
                    By accessing and using this system, you agree to the
                    following:
                  </p>

                  <ol className="list-decimal list-inside space-y-3">
                    <li>
                      <span className="font-semibold">
                        Responsibility for Data
                      </span>
                      <ul className="list-disc list-inside ml-5 text-gray-700">
                        <li>
                          You are fully responsible for the accuracy, security,
                          and lawful use of any data you access, manage, or
                          submit under your account.
                        </li>
                        <li>
                          Any misuse, unauthorized disclosure, or negligence in
                          handling personal data will be attributed to your
                          account.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">
                        Confidentiality of Credentials
                      </span>
                      <ul className="list-disc list-inside ml-5 text-gray-700">
                        <li>
                          Your login credentials are strictly personal and must
                          not be shared with anyone.
                        </li>
                        <li>
                          Any activity carried out under your credentials will
                          be assumed to have been performed by you.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">
                        System Access from Public Devices
                      </span>
                      <ul className="list-disc list-inside ml-5 text-gray-700">
                        <li>
                          If using a public or shared computer, always log out
                          immediately after use.
                        </li>
                        <li>
                          Do not save your login credentials or allow browsers
                          to remember passwords on such devices.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">
                        Compliance with Data Privacy Laws
                      </span>
                      <ul className="list-disc list-inside ml-5 text-gray-700">
                        <li>
                          You are required to handle all personal data in
                          compliance with the{" "}
                          <strong>Data Protection Act, 2019</strong>, including
                          principles of lawfulness, fairness, purpose
                          limitation, data minimization, accuracy, storage
                          limitation, integrity, and accountability.
                        </li>
                        <li>
                          Unauthorized access, alteration, transfer, or sharing
                          of personal data is strictly prohibited and may result
                          in legal and administrative consequences.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">
                        Reporting Obligations
                      </span>
                      <ul className="list-disc list-inside ml-5 text-gray-700">
                        <li>
                          In the event of any suspected data breach, misuse, or
                          unauthorized access, you must immediately report the
                          incident to the system administrators for timely
                          investigation and mitigation.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <p className="mt-6 font-medium">
                  By continuing to use this platform, you acknowledge and accept
                  these responsibilities. This action will logout you out and
                  expect you to logback in so as to refresh your changes.
                </p>

                <div className="flex flex-row gap-3">
                  <button
                  disabled={loading2}
                  type="button"
                  onClick={(e) => {
                    handleUpdate(e);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition mt-3"
                >
                  {loading2 ? "Please wait ...." : "Agree to terms"}
                </button>

                <button
                  disabled={loading2}
                  type="button"
                  onClick={() => {
                    handleLogout();
                  }}
                  className="px-4 py-2 bg-red-300 text-red-600 rounded hover:bg-red-300 transition mt-3"
                >
                  Exit
                </button>
                </div>
              </>
            }
          ></AppModal>
        </>
      )}
    </div>
  );
}
