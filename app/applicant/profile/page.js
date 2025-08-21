"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateProfilePage() {
  const [profile, setProfile] = useState({
    bio: "",
    location: "",
    profile_picture: null,
  });
  const [preview, setPreview] = useState(null); // preview URL
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      let login_response = localStorage.getItem("login_response");
      if (!login_response) {
        router.push("/aha/login");
        return;
      }
      login_response = JSON.parse(login_response);
      const token = login_response?.access;

      try {
        const res = await fetch("http://localhost:8000/api/profile/", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setHasProfile(false);
          setProfile({ bio: "", location: "", profile_picture: null });
        } else if (!res.ok) {
          throw new Error("Failed to fetch profile");
        } else {
          const data = await res.json();
          setHasProfile(true);
          setProfile({
            bio: data.bio || "",
            location: data.location || "",
            profile_picture: null,
          });
          // Show existing profile picture
          if (data.profile_picture) setPreview(data.profile_picture);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setProfile({ ...profile, [name]: file });
      setPreview(URL.createObjectURL(file)); // show selected image preview
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let login_response = localStorage.getItem("login_response");
    if (!login_response) {
      router.push("/aha/login");
      return;
    }
    login_response = JSON.parse(login_response);
    const token = login_response?.access;

    try {
      const formData = new FormData();
      formData.append("bio", profile.bio);
      formData.append("location", profile.location);
      if (profile.profile_picture) {
        formData.append("profile_picture", profile.profile_picture);
      }

      const res = await fetch("http://localhost:8000/api/profile/", {
        method: hasProfile ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save profile");
      }

      setMessage(
        hasProfile
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      );
      setHasProfile(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8">Loading profile...</p>;

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-6">Update Profile</h1>
      
      {message && <p className="mb-4 text-red-600">{message}</p>}
     <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block mb-1 font-medium">Location</label>
    <input
      type="text"
      name="location"
      placeholder="Enter your location"
      value={profile.location}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Bio</label>
    <textarea
      name="bio"
      placeholder="Write a short bio"
      value={profile.bio}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Profile Picture</label>
    {preview && (
      <img
        src={preview}
        alt="Profile Preview"
        className="mb-2 w-32 h-32 object-cover rounded-full"
      />
    )}
    <input
      type="file"
      name="profile_picture"
      accept="image/*"
      onChange={handleChange}
      className="w-full file:py-2 file:px-4 file:border-0 file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 rounded"
    />
  </div>

  <button
    type="submit"
    disabled={saving}
    className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 text-lg font-bold transition"
  >
    {saving
      ? "Saving..."
      : hasProfile
      ? "Update Profile"
      : "Create Profile"}
  </button>
</form>
    </div>
  );
}