"use client";
import { APP_FETCH } from "@/app/constants/FetchService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppModal from "@/app/components/AppModal/AppModal";

export default function ProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    county: "",
    subcounty: "",
    ward: "",
    fpo: "",
    previous_password: "",
    password: "",
    password2: "",
  });

  const [counties, setCounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [fpos, setFpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState("");

   const handleLogout = () => {
    localStorage.removeItem("login_response");
    router.push("/aha/login");
  };
  // ✅ Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await APP_FETCH(
          `${process.env.NEXT_PUBLIC_USER_ME_URL}`,
          "GET"
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          county: data.county || "",
          subcounty: data.subcounty || "",
          ward: data.ward || "",
          fpo: data.fpo || "",
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch counties
  useEffect(() => {
    const fetchCounties = async () => {
      const res = await APP_FETCH(`${process.env.NEXT_PUBLIC_COUNTY_LIST_URL}`);
      const data = await res.json();
      setCounties(data);
    };
    fetchCounties();
  }, []);

  // ✅ Fetch wards when county changes
  useEffect(() => {
    if (!formData.county) return;
    const fetchWards = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WARD_LIST_URL}?county=${formData.county}`
      );
      const data = await res.json();
      setWards(data);
    };
    fetchWards();
  }, [formData.county]);

  // ✅ Fetch FPOs when county changes
  useEffect(() => {
    if (!formData.county) return;
    const fetchFpos = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FPO_LIST_URL}?county=${formData.county}`
      );
      const data = await res.json();
      const unique = [...new Map(data.map((item) => [item.id, item])).values()];
      setFpos(unique);
    };
    fetchFpos();
  }, [formData.county]);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const payload = { ...formData };

      const res = await APP_FETCH(
        `${process.env.NEXT_PUBLIC_USER_UPDATE_URL}`,
        "PATCH",
        JSON.stringify(payload),
        "application/json"
      );

      if (!res.ok) {
        const errData = await res.json();
        setErrors(errData);
        setModalBody("❌ Failed to update profile. Please check the errors.");
        setShowModal(true);
        throw new Error("Update failed");
      }

      setModalBody("✅ Profile updated successfully! You will be required to login again to refresh your changes.");
      setShowModal(true);

      setFormData((prev) => ({
        ...prev,
        previous_password: "",
        password: "",
        password2: "",
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Update Account</h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-4 shadow rounded-lg p-5 bg-white"
      >
        {/* Names */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-slate-700"
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            disabled
            type="email"
            name="email"
            value={formData.email}
            className="w-full p-2 border rounded bg-slate-300 cursor-not-allowed"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-slate-700"
          >
            Phone
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:border-green-500"
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* County + FPO */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="county"
              className="block text-sm font-medium text-slate-700"
            >
              County
            </label>
            <select
              id="county"
              name="county"
              value={formData.county || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            >
              <option value="">Select County</option>
              {counties.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.county && (
              <p className="text-red-500 text-sm">{errors.county}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fpo"
              className="block text-sm font-medium text-slate-700"
            >
              FPO
            </label>
            <select
              id="fpo"
              name="fpo"
              value={formData.fpo || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
              required
            >
              <option value="">Select FPO</option>
              {fpos.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            {errors.fpo && <p className="text-red-500 text-sm">{errors.fpo}</p>}
          </div>
        </div>

        {/* Ward */}
        <div>
          <label
            htmlFor="ward"
            className="block text-sm font-medium text-slate-700"
          >
            Ward
          </label>
          <select
            id="ward"
            name="ward"
            value={formData.ward || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:border-green-500"
          >
            <option value="">Select Ward</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
        </div>

        {/* Passwords */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="previous_password"
              className="block text-sm font-medium text-slate-700"
            >
              Previous Password
            </label>
            <input
              id="previous_password"
              type="password"
              name="previous_password"
              value={formData.previous_password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
            />
            {errors.previous_password && (
              <p className="text-red-500 text-sm">{errors.previous_password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <input
              id="password2"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-green-500"
            />
            {errors.password2 && (
              <p className="text-red-500 text-sm">{errors.password2}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#009639] hover:bg-[#1a5a33f1] text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* ✅ Success/Error Modal */}
      <AppModal
        isOpen={showModal}
        setIsClose={() => {
          setShowModal(false);
           handleLogout()
        }}
        body={<p>{modalBody}</p>}
      />
    </div>
  );
}
