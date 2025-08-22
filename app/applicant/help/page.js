"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ComplaintsPage() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  

  useEffect(() => {
    const fetchUserAndComplaints = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) {
        router.push("/aha/login");
        return;
      }
      setUser(loginData.user);

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

    fetchUserAndComplaints();
  }, [router]);

  const handlePostComplaint = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError(null);

    const loginData = JSON.parse(localStorage.getItem("login_response"));
    if (!loginData) {
      router.push("/aha/login");
      return;
    }
    const token = loginData.access;

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_COMPLAINT_CREATE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to post complaint");
      }

      const newComplaint = await res.json();
      setComplaints([newComplaint, ...complaints]);
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p className="p-8">Loading complaints...</p>;

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Complaints & Help</h1>

      {/* Post Complaint Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
        <p className="text-slate-500 mb-5 text-sm">Relies will be sent via email to {user?.email}</p>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handlePostComplaint} className="space-y-4">
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

      {/* List of Complaints */}
      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints submitted yet.</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">{c.subject}</h3>
                <span
                  className={`text-sm font-medium ${
                    c.resolved ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {c.resolved ? "Resolved" : "Pending"}
                </span>
              </div>
              <p className="text-gray-700">{c.message}</p>
              <p className="text-gray-400 text-sm mt-2">
                Submitted at: {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}