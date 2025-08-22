"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Check localStorage on mount
  useEffect(() => {
    const loginData = localStorage.getItem("login_response");
    if (loginData) {
      const parsed = JSON.parse(loginData);
      if (
        parsed?.user?.role?.toUpperCase() === "REVIEWER" ||
        parsed?.user?.role?.toUpperCase() === "ADMIN"
      ) {
        router.push("/aha-admin/home");
      } else {
        router.push("/applicant/home");
      }
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      // Store login response in localStorage
      localStorage.setItem("login_response", JSON.stringify(data));

      // Redirect by role
      const role = data?.user?.role?.toUpperCase();
      if (role === "REVIEWER" || role === "ADMIN") {
        router.push("/aha-admin/home");
      } else {
        router.push("/applicant/home");
      }
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
            Ward Veterinary Surgeons and Veterinary Para Professionals for
            County FMD & PPR Vaccination Campaign Application form
          </h3>
          <h3 className="mt-5">
            By having an account you can be able to track your application
          </h3>
          <div className="flex items-center justify-between mb-6">
            {/* Left: Back to Home */}
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              ← Back to Home
            </Link>

            {/* Right: Login title */}
            <h2 className="text-2xl font-bold">Login</h2>
          </div>
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
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Extra links */}
          <div className="mt-4 flex justify-between text-sm">
            <button
              onClick={() => router.push("/aha/sign-up")}
              className="text-teal-600 hover:underline"
            >
              Create account
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
