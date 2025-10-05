"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeClosed, EyeClosedIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { EyeOpen } from "akar-icons";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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

      localStorage.setItem("login_response", JSON.stringify(data));

      const role = data?.user?.role?.toUpperCase();
      if (["REVIEWER", "ADMIN", "FPO"].includes(role)) {
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

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Back to Home
          </Link>

          <h2 className="text-2xl font-bold">Login</h2>
        </div>

        {message && <p className="mb-4 text-red-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-slate-900 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email you used to register"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label className="text-slate-900 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password ***"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 text-sm"
              >
                {
                  showPassword ? 
                  <EyeOffIcon>
                  </EyeOffIcon>:
                  <EyeIcon/>
                }
                {/* {showPassword ? "🙈" : "👁️"} */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#009639] hover:bg-[#1a5a33f1] text-white py-2 rounded"
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
  );
}