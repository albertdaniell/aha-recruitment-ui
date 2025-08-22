"use client";

import AppModal from "@/app/components/AppModal/AppModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    county: "",
    subcounty: "",
    ward: "",
    fpo: "",
  });

  // Data lists
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [fpos, setFpos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, SetShowSuccess] = useState(false);

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
    if (!formData.subcounty) {
      setWards([]);
      setFormData((prev) => ({ ...prev, ward: "", fpo: "" }));
      return;
    }
    const fetchWards = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WARD_LIST_URL}?subcounty_id=${formData.subcounty}`
        );
        if (!res.ok) throw new Error("Failed to fetch wards");
        const data = await res.json();
        setWards(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWards();
  }, [formData.subcounty]);

  // Fetch FPOs when ward changes
  useEffect(() => {
    if (!formData.ward) {
      setFpos([]);
      setFormData((prev) => ({ ...prev, fpo: "" }));
      return;
    }
    const fetchFpos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FPO_LIST_URL}?ward_id=${formData.ward}`
        );
        if (!res.ok) throw new Error("Failed to fetch fpos");
        const data = await res.json();
        setFpos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFpos();
  }, [formData.ward]);

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
    const phoneRegex = /^2547\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage("Phone number must be in format 2547XXXXXXXX");
      return false;
    }
    if (
      !formData.county ||
      !formData.subcounty ||
      !formData.ward ||
      !formData.fpo
    ) {
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

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        subcounty: "",
        ward: "",
        fpo: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppModal
        isOpen={showSuccess}
        setIsClose={() => {
          SetShowSuccess(false);
          router.push("/aha/login");
        }}
        // title={"Cannot submit"}
        body={<p>Account created successfully!</p>}
      />
      <div className="w-full max-w-md ">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Back to Home
          </Link>
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>

        {message && (
          <p
            className={`mb-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Names */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            />
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

          {/* Email + Phone */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:border-green-500"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number (e.g., 254712345678)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:border-green-500"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* County dropdown */}
            <select
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
            </select>
            {/* Subcounty dropdown */}
            <select
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
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ward dropdown */}
            <select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            >
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            {/* FPO dropdown */}
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

          {/* Passwords */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            />
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

          <button
            type="submit"
            className="w-full bg-[#009639] hover:bg-[#1a5a33f1] text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <button
            onClick={() => router.push("/aha/login")}
            className="text-teal-600 hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/aha/request-reset")}
            className="text-teal-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
