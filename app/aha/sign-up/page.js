"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // ✅ password match
    if (formData.password !== formData.password2) {
      setMessage("Passwords do not match");
      return false;
    }

    // ✅ email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Invalid email format");
      return false;
    }

    // ✅ phone format: 2547XXXXXXXX (12 digits)
    const phoneRegex = /^2547\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage("Phone number must be in format 2547XXXXXXXX");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return; // ❌ stop if invalid

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/register/", {
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
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div
        className="w-1/2 bg-cover bg-center  md:flex hidden"
        style={{ backgroundImage: "url('/cow.jpg')" }}
      ></div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
           <div className="flex  justify-between">
            <img src="/emblem.png" className="w-[100px] h-[100px]" />
            <img src="/cog.png" className="w-[100px] h-[100px]" />
          </div>
          <h3 className="mt-5">
            Ward Veterinary Surgeons and Veterinary Para Professionals for County FMD & PPR Vaccination Campaign Application form
          </h3>
          <h3 className="mt-5">
            By having an account you can be able to track your application
          </h3>
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
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
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number (e.g., 254712345678)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

           {/* Extra links */}
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