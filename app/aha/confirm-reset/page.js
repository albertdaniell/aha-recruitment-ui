"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
      const res = await fetch(process.env.NEXT_PUBLIC_RESET_PASSWORD_URL, {
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
    <div>
     

      {/* Right Form */}
      <div>
        <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                    <Link
                      href="/aha/login"
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      ← Back to Login
                    </Link>
                    <h2 className="text-2xl font-bold">Reset Password</h2>
                  </div>
          <p className="text-lg mb-6">Enter the code that was sent to your email below</p>
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