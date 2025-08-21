"use client"; // Ensure client-side rendering

import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPhoneAlt, FaIdCard, FaEnvelope, FaUserAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { searchEnumeratorQR_Code } from "@/app/app-redux/features/AppData/appSlice";
import Image from "next/image";

function QrDetails({ id_number }) {
  const dispatch = useDispatch();
  const appData = useSelector((state) => state.appData);
  const { shorlisted_enumerator_qr_code_details } = appData; // Ensure isLoading exists

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (id_number) {
      dispatch(searchEnumeratorQR_Code({ id_number }))
        .unwrap()
        .then((res) => {
          // Dispatch with id_number
          console.log(res);
          setProfileData(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, id_number]);

  useEffect(() => {
    // Update profile data when the data is available
    if (shorlisted_enumerator_qr_code_details?.data) {
      setProfileData(shorlisted_enumerator_qr_code_details.data);
    }
  }, [shorlisted_enumerator_qr_code_details]);

  if (shorlisted_enumerator_qr_code_details.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col justify-center items-center ">
        {!shorlisted_enumerator_qr_code_details.loading && (
          <>
            <FaUserAlt className="text-7xl text-gray-400" />
            <p className="text-2xl text-gray-700 mt-4">No profile available</p>
            <p className="text-gray-500">Please check back later.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center  bg-slate-50 p-6">
      {/* User Image */}
      <div className="w-80 h-80">
        <Image
          width={80}
          height={80}
          priority
          unoptimized
          src={
            profileData?.availability_object?.passport_photo_url ||
            "https://via.placeholder.com/150"
          }
          alt="User"
          className="rounded-lg object-cover w-full h-full"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback for broken image
        />
      </div>
      {/* User Details */}
      <div className="mt-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          {profileData.agripreneur_name || "No Name"}
        </h2>

        {/* Email Address */}
        <p className="text-gray-600 flex items-center justify-center mt-2">
          <FaEnvelope className="mr-2" />
          <a
            href={`mailto:${profileData.email || ""}`}
            className="text-blue-500 hover:underline"
          >
            {profileData.email || "No Email"}
          </a>
        </p>

        {/* Phone number with call feature */}
        <p className="text-gray-600 flex items-center justify-center mt-2">
          <FaPhoneAlt className="mr-2" />
          <a
            href={`tel:${profileData.system_phone || ""}`}
            className="text-blue-500 hover:underline"
          >
            {profileData.system_phone || "No Phone"}
          </a>
        </p>

        {/* ID Number */}
        <p className="text-gray-600 flex items-center justify-center mt-2">
          <FaIdCard className="mr-2" />
          ID Number: {profileData.id_number || "No ID Number"}
        </p>

        {/* Location Details */}
        <div className="mt-3 space-y-1">
          <p className="text-gray-500 flex items-center justify-center">
            <MdLocationOn className="mr-2" />
            County: {profileData.system_county || "No County"}
          </p>
          <p className="text-gray-500">
            Subcounty: {profileData.system_subcounty || "No Subcounty"}
          </p>
          <p className="text-gray-500">
            Ward: {profileData.system_ward || "No Ward"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default QrDetails;