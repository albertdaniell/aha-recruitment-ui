"use client";
import React from "react";

function TopStats({ county_stats,user_county }) {
  return (
    <div>
      {/* resident_of_ward */}
      <div className="grid">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4">
          <div className="shadow rounded px-3 py-4 bg-green-500 text-white">
            <p className="text-xl my-3">
              {county_stats.total_applicants.toLocaleString()} / {""}
              <span className="px-1">{county_stats.county_enumerators.toLocaleString()}</span>
              {""}
              <span className="text-xs text-gray-200">agripreneurs</span>
            </p>
            <p className="text-xs">Applications</p>
          </div>
          <div className="shadow rounded px-3 py-4 bg-blue-500 text-white">
            <p className="text-xl my-3">
              {/* county_stats.data.stats_ward */}
              {county_stats.stats_ward.length.toLocaleString()}
            </p>
            <p className="text-xs">{user_county === 'admin' ? "Counties":"County wards"}</p>
          </div>
          <div className="shadow rounded px-3 py-4 bg-pink-500 text-white">
            <p className="text-xl my-3">
              {county_stats.experience_in_agric_count.toLocaleString()}
            </p>
            <p className="text-white text-xs">Experience in agric applicants</p>
          </div>
          <div className="shadow rounded px-3 py-4 bg-purple-500 text-white">
            <p className="text-xl my-3">{county_stats.pwd_applicants.toLocaleString()}</p>
            <p className="text-white text-xs">PWD applicants</p>
          </div>
          <div className="shadow rounded px-3 py-4 bg-orange-500 text-white">
            <p className="text-xl my-3">{county_stats.resident_of_ward.toLocaleString()}</p>
            <p className="text-white text-xs">Ward residents</p>
          </div>
          {/* earnings_per_month_agregate_sum */}
          <div className="shadow rounded px-3 py-4 bg-gray-700 text-white">
            <p className="text-xl my-3">
              {county_stats.formal_employment_count}
            </p>
            <p className="text-white text-xs">Formal employment</p>
          </div>
          <div className="shadow rounded px-3 py-4 bg-yellow-500 text-white">
            <p className="text-xl my-3">
              Ksh.{county_stats.earnings_per_month_agregate_average.toLocaleString()}
            </p>
            <p className="text-white text-xs">AVG earning per month</p>
          </div>

          <div className="shadow rounded p-2 bg-[#2d9d9a] text-white">
            <p className="text-xl my-3">
              {county_stats.between_18_and_35_age_count.toLocaleString()}
            </p>
            <p className="text-white text-xs">Between 18 and 35</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default TopStats;
