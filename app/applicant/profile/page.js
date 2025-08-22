"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateProfilePage() {
  const [profile, setProfile] = useState({
    bio: "",
    location: "",
    date_of_birth: "",
    gender: "",
    county: "",
    is_pwd: false,
    disability_type: "",
    disability_certificate: null,
    profile_picture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [counties, setCounties] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  // ✅ PWD Disability Categories
  const disabilityTypes = [
    "Physical Disability",
    "Visual Disability (Blind/Low Vision)",
    "Hearing Disability (Deaf/Hard of Hearing)",
    "Speech and Language Disability",
    "Intellectual Disability",
    "Mental/Psychosocial Disability",
    "Autism Spectrum Disorder (ASD)",
    "Multiple Disabilities",
    "Other",

  ];

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
        // Fetch profile
        const profileRes = await fetch(process.env.NEXT_PUBLIC_PROFILE_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.status === 404) {
          setHasProfile(false);
        } else if (!profileRes.ok) {
          throw new Error("Failed to fetch profile");
        } else {
          const data = await profileRes.json();
          setHasProfile(true);
          setProfile({
            bio: data.bio || "",
            location: data.location || "",
            date_of_birth: data.date_of_birth || "",
            gender: data.gender || "",
            county: data.county || "",
            is_pwd: data.is_pwd || false,
            disability_type: data.disability_type || "",
            disability_certificate: null,
            profile_picture: null,
          });
          if (data.profile_picture) setPreview(data.profile_picture);
        }

        // Fetch counties
        const countiesRes = await fetch(
          process.env.NEXT_PUBLIC_COUNTY_LIST_URL,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!countiesRes.ok) throw new Error("Failed to fetch counties");
        const countiesData = await countiesRes.json();
        setCounties(countiesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files) {
      const file = files[0];
      setProfile({ ...profile, [name]: file });
      if (name === "profile_picture") {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setProfile({
        ...profile,
        [name]: type === "checkbox" ? checked : value,
      });
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
      formData.append("date_of_birth", profile.date_of_birth);
      formData.append("gender", profile.gender);
      formData.append("county", profile.county);
      formData.append("is_pwd", profile.is_pwd);
      if (profile.is_pwd) {
        formData.append("disability_type", profile.disability_type);
        if (profile.disability_certificate) {
          formData.append(
            "disability_certificate",
            profile.disability_certificate
          );
        }
      }
      if (profile.profile_picture) {
        formData.append("profile_picture", profile.profile_picture);
      }

      const res = await fetch(process.env.NEXT_PUBLIC_PROFILE_URL, {
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
    <div>
      <h1 className="text-4xl font-bold mb-6">Update Profile</h1>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className=" gap-6"
      >
        {/* LEFT SIDE */}
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Gender */}

 <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* Date of Birth */}
          <div>
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium">Physical Address</label>
            <input
              type="text"
              name="location"
              placeholder="Enter your physical address e.g Nairobi"
              value={profile.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
            </div>

         

          

          {/* PWD Section */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_pwd"
              checked={profile.is_pwd}
              onChange={handleChange}
            />
            <label className="font-medium">Are you a PWD?</label>
          </div>

          {profile.is_pwd && (
            <>
              {/* Disability Type */}
              <div>
                <label className="block mb-1 font-medium">
                  Disability Type
                </label>
                <select
                  name="disability_type"
                  value={profile.disability_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Disability Type</option>
                  {disabilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Disability Certificate */}
              <div>
                <label className="block mb-1 font-medium">
                  Upload Disability Certificate
                </label>
                <input
                  type="file"
                  name="disability_certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="w-full file:py-2 file:px-4 file:border-0 file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 rounded"
                />
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          

          {/* Bio */}
          <div className="mt-5">
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              name="bio"
              placeholder="Write a short bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Profile Picture */}
          <div className="">
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
        </div>

        {/* Submit button full width */}
        <div className="md:col-span-2 mt-5">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#009639] text-white py-3 rounded hover:bg-[#007a2f] text-lg font-bold transition"
          >
            {saving
              ? "Saving..."
              : hasProfile
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}