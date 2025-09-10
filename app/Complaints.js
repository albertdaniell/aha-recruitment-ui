"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComplaintsPage() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // ✅ new state
  const router = useRouter();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (!loginData) {
      setLoading(false);
      return;
    }
    setUser(loginData.user);

    const fetchComplaints = async () => {
      try {
        const token = loginData.access;
        const res = await fetch(process.env.NEXT_PUBLIC_COMPLAINT_LIST_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setComplaints(data);
        } else {
          throw new Error("Failed to fetch complaints");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handlePostComplaint = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError(null);
    setSuccess(null); // clear old success messages

    const loginData = JSON.parse(localStorage.getItem("login_response"));
    const token = loginData?.access;

    try {
      const body = { subject, message };
      if (!token) body.email = email;

      const res = await fetch(process.env.NEXT_PUBLIC_COMPLAINT_CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to post complaint");
      }

      const newComplaint = await res.json();
      setComplaints([newComplaint, ...complaints]);
      setSubject("");
      setMessage("");
      if (!token) setEmail("");

      setSuccess("✅ Complaint submitted successfully!"); // ✅ show success
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Complaints & Help</h1>

      {/* Post Complaint Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
        {user ? (
          <p className="text-slate-500 mb-5 text-sm">
            Replies will be sent via email to {user?.email}
          </p>
        ) : (
          <p className="text-slate-500 mb-5 text-sm">
            You’re not logged in. Please provide your email for follow-up.
          </p>
        )}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}
        <form onSubmit={handlePostComplaint} className="space-y-4">
          {!user && (
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          )}
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={posting}
            className={`w-full py-3 rounded text-white font-bold ${
              posting ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {posting ? "Posting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}