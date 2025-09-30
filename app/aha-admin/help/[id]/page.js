"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RepliesPage({ params }) {
  const router = useRouter();
  const complaintId = params?.id;
  console.log({params})

  const [user, setUser] = useState(null);
  const [replies, setReplies] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch replies (with complaint details)
  useEffect(() => {
    const fetchReplies = async () => {
        // console.log("-------")
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      console.log({loginData})
      if (!loginData) {
        router.push("/aha/login");
        return;
      }
      setUser(loginData.user);
      const token = loginData.access;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_COMPLAINT_REPLIES_URL}${complaintId}/replies/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log({res})

        if (!res.ok) throw new Error("Failed to fetch replies");

        const data = await res.json();
        setReplies(data);

        // Extract complaint details from first reply (all have it)
        if (data.length > 0) {
          setComplaint(data[0].complaint);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      fetchReplies();
    }
  }, [complaintId, router]);

  const handlePostReply = async (e) => {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_COMPLAINT_REPLY_CREATE_URL}${complaintId}/replies/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaint: parseInt(complaintId),
            message,
            role: "user",
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to post reply");
      }

      const newReply = await res.json();
      setReplies((prev) => [...prev, newReply]);
      setMessage("");

      // Set complaint if not already set
      if (!complaint && newReply.complaint) {
        setComplaint(newReply.complaint);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p className="p-8">Loading complaint...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Complaint Replies</h1>

      {/* Complaint Details */}
      {complaint && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{complaint.subject}</h2>
          <p className="text-gray-700">{complaint.message}</p>
          <p className="text-gray-400 text-sm mt-2">
            Submitted at: {new Date(complaint.created_at).toLocaleString()}
          </p>
        </div>
      )}

      {/* Replies */}
      <div className="space-y-3">
        {replies.length === 0 ? (
          <p className="text-gray-600">No replies yet.</p>
        ) : (
          replies.map((r) => (
            <div
              key={r.id}
              className={`p-3 rounded-lg ${
                r.role === "admin"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-100 text-gray-900"
              }`}
            >
              <p>{r.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {r.role} • {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Reply Form */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Add a Reply</h3>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handlePostReply} className="space-y-3">
          <textarea
            placeholder="Type your reply..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={posting}
            className={`w-full py-2 rounded text-white font-bold ${
              posting ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {posting ? "Posting..." : "Reply"}
          </button>
        </form>
      </div>
    </div>
  );
}