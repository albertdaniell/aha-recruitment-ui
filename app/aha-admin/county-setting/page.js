"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { APP_FETCH } from "@/app/constants/FetchService";

export default function CountyEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countyId = searchParams.get("id"); 
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_open: true,
    start_of_application: "",
    end_of_application: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null); // ✅ hold current/new logo
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Fetch user
  useEffect(() => {
    const fetchUserData = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) {
        router.push("/aha/login");
        return;
      }
      setUser(loginData.user);
      setLoading(false);
    };
    fetchUserData();
  }, [router]);

  // ✅ Fetch county details
  useEffect(() => {
    if (!user) return;
    const fetchCounty = async () => {
      try {
        const res = await APP_FETCH(
          `${process.env.NEXT_PUBLIC_COUNTY_LIST_URL}${user?.county?.id}/`
        );
        if (!res.ok) throw new Error("Failed to fetch county details");
        const data = await res.json();
        setFormData({
          name: data.name || "",
          code: data.code || "",
          is_open: data.is_open,
          start_of_application: data.start_of_application || "",
          end_of_application: data.end_of_application || "",
          logo: null, // new upload handled separately
        });
        setLogoPreview(data.logo || null); // ✅ show existing logo
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounty();
  }, [user]);

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file)); // ✅ show new file preview
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // ✅ Handle update
 const handleUpdate = async (e) => {
  console.log({user})
  e.preventDefault();
  setErrors({});
  // setLoading(true);

  try {
    const formDataObj = new FormData();

    // ✅ Only append fields that are set
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        formDataObj.append(key, formData[key]);
      }
    }
  const loginData = JSON.parse(localStorage.getItem("login_response"));
  const token = loginData.access;
    // ✅ Use fetch directly for multipart (bypass APP_FETCH JSON wrapper)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_COUNTY_LIST_URL}${user?.county?.id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ Don't set Content-Type, browser handles it with boundary
        },
        body: formDataObj,
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      setErrors(errData);
      throw new Error("Update failed");
    }

    alert("✅ County updated successfully");
    // router.push("/admin/counties");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to update county");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit County</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            County Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            County Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.code && <p className="text-red-500">{errors.code}</p>}
        </div>

        {/* Application Open */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_open"
            checked={formData.is_open}
            onChange={handleChange}
          />
          <label className="text-sm font-medium text-gray-700">
            Applications Open?
          </label>
        </div>

        {/* Application Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start of Application
            </label>
            <input
              type="date"
              name="start_of_application"
              value={formData.start_of_application}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End of Application
            </label>
            <input
              type="date"
              name="end_of_application"
              value={formData.end_of_application}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Logo Upload + Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {logoPreview && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Current Logo Preview:</p>
              <img
                src={logoPreview}
                alt="County Logo"
                className="h-16 w-auto border rounded mt-1"
              />
            </div>
          )}
          {errors.logo && <p className="text-red-500">{errors.logo}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update County"}
        </button>
      </form>
    </div>
  );
}