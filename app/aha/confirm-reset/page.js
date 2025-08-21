"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmResetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: emailFromQuery,
    code: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (emailFromQuery) {
      setFormData((prev) => ({ ...prev, email: emailFromQuery }));
    }
  }, [emailFromQuery]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.new_password !== formData.confirm_password) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          new_password: formData.new_password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to reset password");

      // Navigate to login page on success
      router.push("/aha/login");
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
        className="w-1/2 bg-cover bg-center md:flex hidden"
        style={{ backgroundImage: "url('/goat.jpg')" }}
      ></div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
            <div className="flex  justify-between">
            <img src="/emblem.png" className="w-[100px] h-[100px]" />
            <img src="/cog.png" className="w-[100px] h-[100px]" />
          </div>
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          {message && <p className="mb-4 text-red-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              readOnly={!!emailFromQuery}
            />
            <input
              type="text"
              name="code"
              placeholder="Reset Code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm New Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}