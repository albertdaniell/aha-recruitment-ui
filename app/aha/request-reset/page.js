"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ import Link

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [sendSms, setSendSms] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_REQUEST_RESET_CODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          send_sms: sendSms ? 1:0,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to send code");

      router.push(`/aha/confirm-reset?email=${encodeURIComponent(email)}`);
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
          <h2 className="text-2xl font-bold mb-6">Request Password Reset</h2>
          {message && <p className="mb-4 text-red-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Send via SMS as well</span>
            </label>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>

          {/* ✅ Back to login link */}
          <p className="mt-4 text-sm text-center">
            Remembered your password?{" "}
            <Link href="/aha/login" className="text-teal-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}