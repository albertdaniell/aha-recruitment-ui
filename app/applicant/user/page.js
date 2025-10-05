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
    sublocation: "",
    is_agripreneur: "no",
  });

  const [wards, setWards] = useState([]);
  const [fpos, setFpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState("");
  const [sublocations, setSublocations] = useState([]);
  let [showPasswordFields, SetshowPasswordFields] = useState(null);
  const [userCounty, setUserCounty] = useState(null); // store user application
  const [counties, setCounties] = useState(null);
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [subcounties, setSubcounties] = useState([]);

  useEffect(() => {
    if (counties && user) {
      let county = counties?.find((c) => c?.id === user.county?.id);
      setUserCounty(county);
    }
  }, [user, counties]);

  useEffect(()=>{
      if(counties && userCounty){
        let app_counties = counties
        app_counties = app_counties?.filter((county)=>{
          return county?.project === userCounty?.project
        })
        setCounties(app_counties)
      }
  
    },counties,userCounty)

  useEffect(() => {
    const fetchUserData = async () => {
      const loginData = JSON.parse(localStorage.getItem("login_response"));
      if (!loginData) {
        router.push("/aha/login");
        return;
      }
      setUser(loginData.user);

      const token = loginData.access;

      try {
        // Check profile
        let profileRes = await fetch(process.env.NEXT_PUBLIC_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        profileRes = await profileRes.json();

        if (profileRes.is_updated) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

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
        console.log({ data });
        setFormData((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          county: data.county || "",
          subcounty: data.subcounty || "",
          ward: data.ward || "",
          sublocation: data.sublocation || "",
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

  useEffect(() => {
    console.log({ formData });
    if (!formData?.ward) {
      setSublocations([]);
      // setFormData((prev) => ({ ...prev, sublocation: "" }));
      return;
    }
    const fetchSublocations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUBLOCATIONS_LIST_URL}?ward=${formData?.ward}`
        );
        if (!res.ok) throw new Error("Failed to fetch fpos");
        const data = await res.json();

        setSublocations(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSublocations();
  }, [formData?.ward]);

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

      setModalBody(
        "✅ Profile updated successfully! You will be required to login again to refresh your changes."
      );
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
      <h1 className="text-4xl font-bold mb-2">Update Account</h1>
       <p className="text-slate-500 text-sm mb-5">
              Updating your account will log you out to refresh your details
            </p>

      <form
        onSubmit={handleUpdate}
        className="space-y-4 shadow rounded-lg p-5 bg-white"
      >
        {showPasswordFields && (
          <>
            {/* Passwords btn */}
            <button
              onClick={(e) => {
                e.preventDefault();
                SetshowPasswordFields(!showPasswordFields);
              }}
              className="text-blue-500 underline"
            >
              Show my details
            </button>

           
          </>
        )}

        {showPasswordFields ? (
          <>
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
                  <p className="text-red-500 text-sm">
                    {errors.previous_password}
                  </p>
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
          </>
        ) : (
          <>
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
                className="w-full p-2 border border-slate-300 rounded bg-slate-200 text-slate-500 cursor-not-allowed"
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
                  {counties?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.county && (
                  <p className="text-red-500 text-sm">{errors.county}</p>
                )}
              </div>

              {userCounty?.project === "NAVDCP" ? (
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
                  {errors.fpo && (
                    <p className="text-red-500 text-sm">{errors.fpo}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-slate-900 text-sm">Subcounty</label>
                  <select
                    name="subcounty"
                    value={formData?.subcounty}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:border-green-500"
                    required
                  >
                    <option value="">Select SubCounty</option>
                    {subcounties?.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Ward */}
            <div>
              <label
                htmlFor="ward"
                className="block text-sm font-medium text-slate-700"
              >
                Ward
              </label>
              {/* {formData?.ward || ""} */}
              <select
                id="ward"
                name="ward"
                value={formData?.ward || ""}
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
              {errors.ward && (
                <p className="text-red-500 text-sm">{errors.ward}</p>
              )}
            </div>

            {userCounty?.project === "NAVCDP" ? 
              <div>
                <label
                  htmlFor="ward"
                  className="block text-sm font-medium text-slate-700"
                >
                  Sublocation
                </label>
                <select
                  name="sublocation"
                  value={formData?.sublocation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-green-500"
                  //   required
                >
                  <option value="">Select Sublocation</option>
                  {sublocations?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            :
             <div>
                    <label className="text-slate-900 text-sm">
                      Are you an agripreneur
                    </label>
                    {/* Sublocation dropdown */}
                    <select
                    
                      name="sublocation"
                      value={formData.is_agripreneur}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:border-green-500"
                      //   required
                    >
                      <option value="">Select</option>
                      {[{"name":"Yes",id:"yes"},{"name":"No",id:"no"}]?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
            }
          </>
        )}

        {!showPasswordFields && (
          <>
            {/* Passwords btn */}
            <button
              onClick={(e) => {
                e.preventDefault();
                SetshowPasswordFields(!showPasswordFields);
              }}
              className="text-blue-500 underline"
            >
              Change password
            </button>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#009639] hover:bg-[#1a5a33f1] text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Account"}
        </button>
      </form>

      {/* ✅ Success/Error Modal */}
      <AppModal
        isOpen={showModal}
        setIsClose={() => {
          setShowModal(false);
          handleLogout();
        }}
        body={<p>{modalBody}</p>}
      />
    </div>
  );
}
