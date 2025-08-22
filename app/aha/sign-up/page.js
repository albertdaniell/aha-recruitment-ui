"use client";

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
    county: "", // ✅ added county
  });

  const [counties, setCounties] = useState([]); // ✅ state for fetched counties
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    if (!formData.county) {
      setMessage("Please select a county");
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
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
        county: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:flex">
      {/* Left Image */}
      <div
        className="w-1/2 bg-cover bg-center md:flex hidden"
        style={{ backgroundImage: "url('/cow.jpg')" }}
      ></div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md ">
          <div className="flex justify-between">
            <img src="/emblem.png" className="w-[50px] h-[50px]" />
            <img src="/cog.png" className="w-[50px] h-[50px]" />
          </div>

          <h3 className="mt-5">
            Ward Veterinary Surgeons and Veterinary Para Professionals for
            County FMD & PPR Vaccination Campaign Application form
          </h3>
          <h3 className="mt-5">
            By having an account you can track your application
          </h3>

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
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
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
    </div>
  );
}
