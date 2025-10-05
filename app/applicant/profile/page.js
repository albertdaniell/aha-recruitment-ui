"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppModal from "@/app/components/AppModal/AppModal";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import Link from "next/link";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  let [showModal, setShowModal] = useState(null);
  let [modalMsg, setModalMsg] = useState(null);
  let [updateHasError, Set_updateHasError] = useState(null);


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

  const openPdfModal = (url) => {
    setPdfUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

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
          console.log({ data });
          console.log(typeof data?.disability_certificate);
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
            disability_certificate2: data?.disability_certificate,
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
    console.log({e})
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
        Set_updateHasError(false)

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
            // typeof(profile?.disability_certificate) === "string" ? null:profile?.disability_certificate
            profile.disability_certificate
          );
        }
      }
      if (profile.profile_picture) {
        formData.append("profile_picture", profile.profile_picture);
      }
      if (profile.disability_certificate) {
        formData.append(
          "disability_certificate",
          profile.disability_certificate
        );
      }

      const res = await fetch(process.env.NEXT_PUBLIC_PROFILE_URL, {
        method: hasProfile ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        Set_updateHasError(true)
        const data = await res.json();
        // if(data?.date_of_birth){
        //   throw new Error 
        // }
        throw new Error(data.detail || "Failed to save profile");
      }
      let msg = hasProfile
        ? "Profile updated successfully!"
        : "Profile created successfully!";
      setShowModal(true);

      setModalMsg(msg);
      setMessage(msg);
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
<p className="text-slate-500 text-sm mb-5">
  If you wish to update other information, please <Link className="font-bold text-blue-500 underline hover:text-blue-800" href={"/applicant/user"}>click here</Link> to update your account.
            </p>
      <AppModal
        isOpen={showModal}
        setIsClose={() => {
          setShowModal(false);
          setModalMsg(null);
        }}
        title={"Message"}
        body={<p>{modalMsg}</p>}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-xl shadow-lg overflow-hidden relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold bg-red-500  rounded-full h-6 w-6"
            >
              ✕
            </button>
            {/* PDF iframe */}
            <iframe src={pdfUrl} title="PDF Viewer" className="w-full h-full" />
          </div>
        </div>
      )}
      <div className="shadow rounded-lg p-5 bg-white">

        <form onSubmit={handleSubmit} className=" gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Gender */}

              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  required
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
                {/* <DatePicker
                // format="YY-MM-dd"
                  required
                  className={"w-full p-2 border rounded"}
                  onChange={(e) => {
                    handleChange({
                       target: { value: e, name: "date_of_birth"  },
                    });
                  }}
                  value={profile.date_of_birth}
                /> */}

                <input
  required
  type="date"
  name="date_of_birth"
  value={profile.date_of_birth}
  onChange={handleChange}
  max={new Date().toISOString().split("T")[0]} // ✅ Prevents future dates
  className="w-full p-2 border rounded"
/>
              </div>

              {/* Address */}
              <div>
                <label className="block mb-1 font-medium">
                  Physical Address
                </label>
                <input
                  required
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
            <div className="flex items-center space-x-2 pt-5">
              <input
                //   required
                type="checkbox"
                name="is_pwd"
                checked={profile.is_pwd}
                onChange={handleChange}
              />
              <label className="font-medium">Are you a PWD?</label>
            </div>

            {profile.is_pwd && (
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Disability Type */}
                <div className="bg-slate-100 p-5">
                  <label className="block mb-1 font-medium">
                    Disability Type
                  </label>
                  <select
                    required={profile.is_pwd ? true : false}
                    name="disability_type"
                    value={profile.disability_type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="" disabled>
                      Select Disability Type
                    </option>
                    {disabilityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload Disability Certificate */}
                <div className="bg-slate-100 p-5">
                  <label className="block mb-1 font-medium">
                    Upload Disability Certificate
                  </label>

                  {profile?.disability_certificate2 && (
                    <div className="">
                      {/* <p className="text-gray-600">Current: {application[field].split("/").pop()}</p> */}

                      {/* View Button */}
                      <button
                      type="button"
                        onClick={(e) =>
                        {
                          // e.preventDefault()
                          openPdfModal(profile?.disability_certificate2)
                        }
                        }
                        className="py-2  text-blue-600  transition text-sm"
                      >
                        View Current Certificate
                      </button>
                    </div>
                  )}

                  <input
                    required={
                      profile.is_pwd
                        ? profile?.disability_certificate2
                          ? false
                          : true
                        : false
                    }
                    type="file"
                    name="disability_certificate"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    className="w-full file:py-2 file:px-4 file:border-0 file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            {/* Bio */}
            <div className="mt-5">
              <label className="block mb-1 font-medium">Bio</label>
              <textarea
                required
                name="bio"
                placeholder="Write a short bio"
                value={profile.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Profile Picture */}
            <div className="">
              <label className="block mb-1 font-medium">Passport Photo</label>
              {preview && (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="mb-2 w-32 h-32 object-cover rounded-full"
                />
              )}
              <input
                required={preview ? false : true}
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleChange}
                className="w-full file:py-2 file:px-4 file:border-0 file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100 rounded"
              />
            </div>
          </div>
        {message && <div className={`${updateHasError ? "bg-red-100":"bg-blue-100"} p-5 mt-4`}>

        <p className={` ${updateHasError ? "text-red-500":"text-blue-500"} `} >{message}</p>
        </div>}


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
    </div>
  );
}
