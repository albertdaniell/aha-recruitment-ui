"use client";

import AppModal from "@/app/components/AppModal/AppModal";
import { FormatDate } from "@/app/constants/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    confirm_email_: "",
    phone: "",
    password: "",
    password2: "",
    county: "",
    // subcounty: "",
    ward: "",
    fpo: "",
    sublocation: "",
  });

  // Data lists
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [fpos, setFpos] = useState([]);
  const [sublocations, setSublocations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, SetShowSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countySelectionOpen, setCountySelectionOpen] = useState(true);

  const filteredCounties = counties?.filter((county) =>
    county.name.toLowerCase().includes(search.toLowerCase())
  );

  let setSelectedCountyFn = (county) => {
    setSelectedCounty(county);
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

  // Fetch subcounties when county changes
  useEffect(() => {
    if (!formData.county) {
      setSubcounties([]);
      setFormData((prev) => ({ ...prev, subcounty: "", ward: "", fpo: "" }));
      return;
    }
    const fetchSubcounties = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUBCOUNTY_LIST_URL}?county_id=${formData.county}`
        );
        if (!res.ok) throw new Error("Failed to fetch subcounties");
        const data = await res.json();
        setSubcounties(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubcounties();
  }, [formData.county]);

  // Fetch wards when subcounty changes
  useEffect(() => {
    console.log({ selectedCounty });
    if (!selectedCounty?.id) {
      setWards([]);
      setFpos([]);
      setSublocations([]);
      setFormData((prev) => ({ ...prev, ward: "", fpo: "" }));
      return;
    }
    const fetchWards = async () => {
      try {
        // let wards_ = fpos?.filter((fpo)=>{
        //     return parseInt(fpo.id) === parseInt(formData?.fpo)
        // })
        // console.log({wards_})
        // console.log(fpos)
        // console.log(formData?.fpo)
        // if(wards_){
        // setWards(wards_?.wards);

        // }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WARD_LIST_URL}?county=${selectedCounty?.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch wards");
        const data = await res.json();
        setWards(data);
      } catch (err) {
        console.error(err);
      }
    };
    selectedCounty && fetchWards();
  }, [selectedCounty]);

  useEffect(() => {
    console.log({ selectedCounty });
    setFormData((prev) => ({ ...prev, ward: "" }));
    setWards([]);

    if (!formData?.fpo) {
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: "", fpo: "" }));
      return;
    }
    const fetchWards = async () => {
      try {
        let wards_ = fpos?.filter((fpo) => {
          return parseInt(fpo.id) === parseInt(formData?.fpo);
        });
        console.log({ wards_ });
        // console.log(fpos)
        // console.log(formData?.fpo)
        if (wards_) {
          console.log(wards_[0]?.wards);

          setWards(wards_[0]?.wards);
        }
        // const res = await fetch(
        //   `${process.env.NEXT_PUBLIC_WARD_LIST_URL}?county=${selectedCounty?.id}`
        // );
        // if (!res.ok) throw new Error("Failed to fetch wards");
        // const data = await res.json();
        // setWards(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWards();
  }, [formData?.fpo]);

  // Fetch FPOs when ward changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, fpo: "", sublocation: "", ward: "" }));
    setFpos([]);
    setSublocations([]);
    setWards([]);
    if (!selectedCounty?.id) {
      setFpos([]);
      setSublocations([]);
      setWards([]);
      setFormData((prev) => ({ ...prev, fpo: "", sublocation: "", ward: "" }));
      return;
    }
    const fetchFpos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FPO_LIST_URL}?county=${selectedCounty?.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch fpos");
        const data = await res.json();

        // ✅ Deduplicate FPOs by `id` (and fallback to name if needed)
        const uniqueFpos = Object.values(
          data.reduce((acc, fpo) => {
            const key = `${fpo.id}-${fpo.name}`;
            if (!acc[key]) {
              acc[key] = fpo;
            }
            return acc;
          }, {})
        );

        setFpos(uniqueFpos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFpos();
  }, [selectedCounty?.id]);

  useEffect(() => {
    console.log({ formData });
    if (!formData?.ward) {
      setSublocations([]);
      setFormData((prev) => ({ ...prev, sublocation: "" }));
      return;
    }
    const fetchSublocations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUBLOCATIONS_LIST_URL}?ward=${formData?.ward}`
        );
        if (!res.ok) throw new Error("Failed to fetch fpos");
        const data = await res.json();

        setSublocations(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSublocations();
  }, [formData?.ward]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password !== formData.password2) {
      setMessage("Passwords do not match");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Invalid email format");
      return false;
    }
    if (!emailRegex.test(formData.confirm_email_)) {
      setMessage("Invalid email format");
      return false;
    }

    if (formData?.email !== formData?.confirm_email_) {
      setMessage("Emails do not match");
      return false;
    }
    const phoneRegex = /^2547\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage("Phone number must be in format 2547XXXXXXXX");
      return false;
    }
    if (!selectedCounty || !formData.fpo) {
      setMessage("Please select county, subcounty, ward and FPO");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;
    setLoading(true);

    let dataToPost = { ...formData };
    dataToPost.county = selectedCounty?.id;

    if (dataToPost.ward) {
      // dataToPost.subcounty = selectedCounty?.id;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToPost),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");

      setMessage("✅ Account created successfully!");
      SetShowSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
        county: "",
        // subcounty: "",
        ward: "",
        fpo: "",
        sublocation: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {countySelectionOpen ? (
        <>
          <div className="bg-slate-100 p-2 max-h-[450px] overflow-auto mt-5">
            <h1 className="text-xl font-bold mb-2">Select Your County</h1>

            {/* Search */}
            <input
              type="text"
              placeholder="Search county..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 mb-6 border border-green-400 focus:border-green-400 rounded-lg"
            />

            {/* Counties List */}
            <div className="grid xl:grid-cols-3 grid-cols-2 gap-3">
              {filteredCounties.map((county) => {
                const isDisabled = !county.is_open;

                return (
                  <div
                    key={county.id}
                    onClick={() => !isDisabled && setSelectedCountyFn(county)}
                    className={`border rounded-xl p-4 shadow-sm transition 
          ${
            isDisabled
              ? "bg-slate-200 cursor-not-allowed opacity-70 border-slate-300 text-slate-600"
              : "cursor-pointer hover:bg-gray-50 bg-white"
          } 
          ${
            selectedCounty?.id === county.id && !isDisabled
              ? "border-green-500 bg-green-50"
              : ""
          }`}
                  >
                    <div className="sm:flex items-center gap-4">
                      <img
                        src={county.logo || "/cog.png"}
                        alt={county.name}
                        className="sm:w-12 sm:h-12 w-8 h-8 object-contain rounded-md"
                      />
                      <div className="min-w-0">
                        <h2 className="md:text-md font-semibold break-words whitespace-normal">
                          {county.name}
                        </h2>
                      </div>
                    </div>

                    <p className="md:text-sm text-xs text-gray-600 mt-2">
                      {isDisabled
                        ? "Applications not open"
                        : `Ends: ${
                            FormatDate(county.end_of_application, false) ||
                            "Not specified"
                          }`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Continue Button */}
          {selectedCounty && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setCountySelectionOpen(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Continue with {selectedCounty.name}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <AppModal
            isOpen={showSuccess}
            setIsClose={() => {
              SetShowSuccess(false);
              router.push("/aha/login");
            }}
            // title={"Cannot submit"}
            body={<p>Account created successfully!</p>}
          />
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                ← Back to Home
              </Link>
              <h2 className="text-2xl font-bold">Create Account</h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off" // Prevent browser autofill
              onPaste={(e) => e.preventDefault()} // Prevent paste in all fields
              onCopy={(e) => e.preventDefault()} // Optional: prevent copy
              onCut={(e) => e.preventDefault()} // Optional: prevent cut
            >
              {/* Names */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-900 text-sm">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-900 text-sm">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-900 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="my-email" // Non-standard value to trick autofill
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    // autoComplete="off"
                    onPaste={(e) => e.preventDefault()} // 👈 Prevent paste
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-900 text-sm">
                    Confirm Email
                  </label>
                  <input
                    type="email"
                    name="confirm_email_"
                    placeholder="Confirm Email"
                    value={formData.confirm_email_}
                    onChange={handleChange}
                    autoComplete="new-email" // Non-standard value to trick autofill
                    onPaste={(e) => e.preventDefault()} // 👈 Prevent paste
                    className="w-full p-2 border border-slate-600 rounded focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-900 text-sm">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number (e.g., 254712345678)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-green-500"
                  required
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                {/* County dropdown */}
                <div>
                  <label className="text-slate-900 text-sm">County</label>
                  <div className="w-full border border-slate-500 rounded focus:border-green-500">
                    <div className="flex items-center gap-4 px-2 py-1">
                      <img
                        src={selectedCounty.logo || "/cog.png"}
                        alt={selectedCounty?.name}
                        className="w-8 h-8 object-contain rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold truncate text-slate-600">
                          {selectedCounty.name} County
                        </h2>
                      </div>
                      <button
                        onClick={() => setCountySelectionOpen(true)}
                        className="text-blue-500 shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* <select
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-green-500"
                  required
                >
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county.id} value={county.id}>
                      {county.name}
                    </option>
                  ))}
                </select> */}
                {/* Subcounty dropdown */}
                {/* <select
                  name="subcounty"
                  value={formData.subcounty}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-green-500"
                  required
                >
                  <option value="">Select SubCounty</option>
                  {subcounties.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select> */}

                {/* FPO dropdown */}
                <div>
                  <label className="text-slate-900 text-sm">FPO</label>
                  <select
                    name="fpo"
                    value={formData.fpo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  >
                    <option value="">Select FPO</option>
                    {fpos.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* {JSON.stringify(wards)} */}

              <div className="grid lg:grid-cols-2 gap-4">
                <div className=" grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-900 text-sm">Ward</label>
                    {/* Ward dropdown */}
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:border-green-500"
                      //   required
                    >
                      <option value="">Select Ward</option>
                      {wards?.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className=" grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-900 text-sm">
                      Sublocation
                    </label>
                    {/* Sublocation dropdown */}
                    <select
                      name="sublocation"
                      value={formData.sublocation}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:border-green-500"
                      //   required
                    >
                      <option value="">Select Sublocation</option>
                      {sublocations?.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-900 text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-900 text-sm">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password2"
                    placeholder="Confirm Password"
                    value={formData.password2}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  />
                </div>
              </div>


           {message && (
  <p
    className={`mb-4 ${
      message.startsWith("✅") ? "text-green-600" : "text-red-600"
    }`}
  >
    {message.replace(/^detail:\s*/, "")}
  </p>
)}


              <button
                type="submit"
                className="w-full bg-[#009639] hover:bg-[#1a5a33f1] text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </>
      )}
      <div className="mt-4 flex shrink justify-between text-sm">
        <button
          onClick={() => router.push("/aha/login")}
          className="text-teal-600 underline"
        >
          Go to Login if you have an account
        </button>
        <button
          onClick={() => router.push("/aha/request-reset")}
          className="text-teal-600 underline"
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}
