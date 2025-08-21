"use client";
import { Main } from "next/document";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopMobileNav from "../pagecomponents/TopMobileNav";
import { Spinner, Table } from "flowbite-react";
import SideMenu from "../pagecomponents/SideMenu";
import { getCountyStats } from "@/app/app-redux/features/AppData/appSlice";
import { JsonToExcel } from "react-json-to-excel";
import { FormatDate } from "@/app/constants/utils";

function TableComponent() {
  const dispatch = useDispatch();
  const appData = useSelector((state) => state.appData);

  const {
    county_stats,
    loginUserState,
    COUNTIES,
    county_selected_stats,
    app_utils,
  } = appData;

  const [app_county_stats, set_app_county_stats] = useState(county_stats);
  const [app_county_stats_table_data, set_app_county_stats_table_data] =
    useState(county_stats);

  const [openModal3, SetShowModal3] = useState(false);
  const [embed_url, set_show_embed_url] = useState(false);
  const [loading_embed, set_is_loading_embed] = useState(false);
  const [showPersonalInfo, set_show_p_info] = useState(false);
  const [filter, set_filter] = useState("all");
  const [adminUnitsData, SetAdminUnits] = useState(null);

  const [county, set_county] = useState(null);
  const [subcounty, set_subcounty] = useState(null);
  const [ward, set_ward] = useState(null);
  const [countySelected, SetCountySelected] = useState(null);
  const [subCountySelected, SetSubCountySelected] = useState(null);
  const [wardSelected, SetWardSelected] = useState(null);
  const [recent_subcounties, set_recent_subcounties] = useState(null);
  const [recent_wards, set_recent_wards] = useState(null);
  let user_county =
    loginUserState.data !== null ? loginUserState.data.county_string : null;

  const getData = () => {
    dispatch(
      getCountyStats({
        county_of_data: user_county,
        county_admin: user_county === "admin" ? "MERU" : user_county,
        filter: filter,
        Token: loginUserState.data.token,
      })
    );
  };
  useEffect(() => {
    // Fetch data initially
    user_county !== null && getData();

    // Set up interval to fetch data every 5 minutes
    const intervalId = setInterval(
      user_county !== null && getData,
      1 * 60 * 1000
    );

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [user_county, filter]); // Empty dependency array to run effect only once on mount

  return (
    <>
      <div className="grid md:grid-cols-5">
      <div className=" text-white md:h-[100vh] md:block hidden">
          {/* Side menu county */}
          <SideMenu county_name={user_county} />
        </div>
        <div class="col-span-4 px-2 md:px-5 max-h-[100vh] overflow-auto">
          <div className="py-3 md:py-5 mb-5">
            {/* {JSON.stringify(county_stats)} */}

            <button
              onClick={getData}
              className="bg-green-200 text-sm rounded px-3 py-1 mx-2"
            >
              Reload
            </button>
            {county_stats.loading && (
              <>
                <>
                  <Spinner className="mx-2" />
                </>
              </>
            )}

            {county_stats.error && county_stats.data === null && (
              <>
                <div className="bg-white my-0 text-xl p-2">
                  <center>
                    <img
                      src="https://img.freepik.com/free-vector/my-password-concept-illustration_114360-4294.jpg"
                      height={400}
                      width={400}
                    ></img>
                  </center>
                  <p className="text-orange-800 my-5 text-center">
                    {county_stats.error}
                  </p>
                  <center>
                    <button
                      onClick={getData}
                      className="bg-green-200 text-sm rounded px-3 py-1"
                    >
                      Reload
                    </button>
                  </center>
                </div>
              </>
            )}

            {county_stats.data && (
              <>
                <TopMobileNav user_county={user_county}></TopMobileNav>

                {/* applications selected modal */}

                {county_stats.loading && (
                  <>
                    <Spinner />

                    <p>Loading data...</p>
                  </>
                )}

                <div className="mt-5 rounded-lg p-0 shadow-lg overflow-hidden">
                  <div className="bg-green-100 text-gray-700 px-2 py-1 flex gap-3 justify-between">
                    <h2 className="text-xl my-2">Agripreneurs</h2>
                    <button
                      onClick={() => set_show_p_info(!showPersonalInfo)}
                      className="text-blue-500 text-sm mx-2"
                    >
                      {showPersonalInfo
                        ? "Hide personal info"
                        : "Show personal info"}
                    </button>

                    {/* <button
                      //   onClick={() => getData()}
                      className="text-blue-400 text-sm"
                    >
                      Reload
                    </button> */}
                  </div>
                  <div className="m-2">
                    <JsonToExcel
                      title="Download as Excel"
                      data={county_stats.data.enumerators_applications_list}
                      fileName={`Agripreneurs_${user_county}_as_on_${FormatDate(
                        new Date()
                      )}`}
                      btnClassName="text-white rounded-md bg-blue-700 px-0 py-0 text-xs text-sm self-end justify-end"
                    />
                  </div>
                  {/* stats */}
                  <div class="flex flex-col bg-white-50 ">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div class="overflow-hidden"></div>
                        <Table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                          <thead class="border-b border-neutral-200 font-medium dark:border-white/10">
                            <tr>
                              <th scope="col" class="px-4 py-4">
                                Name
                              </th>
                              <th scope="col" class="px-4 py-4">
                                Status
                              </th>
                              <th scope="col" class="px-4 py-4">
                                County
                              </th>
                              <th scope="col" class="px-4 py-4">
                                Subcounty
                              </th>
                              <th scope="col" class="px-4 py-4">
                                Ward
                              </th>
                              <th scope="col" class="px-4 py-4">
                                Self registered
                              </th>
                              <th scope="col" class="px-3 py-4">
                                ID number
                              </th>

                              <th scope="col" class="px-6 py-4">
                                Phone
                              </th>
                              <th scope="col" class="px-6 py-4">
                                Has applied
                              </th>
                            </tr>
                          </thead>
                          {county_stats.data.enumerators_applications_list.map(
                            (apps) => {
                              return (
                                <tr
                                  class={`border-b border-neutral-200 dark:border-white/10
                                `}
                                >
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.name.toUpperCase()}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.has_application === "YES" ? <span className="bg-green-500 rounded-full p-1 text-xs text-white">Has applied</span>:
                                    <span className="bg-red-500 rounded-full p-1 text-xs text-white">Has not applied</span>
                                    }
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.count}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.subcounty}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.ward}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.newly_registered}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {showPersonalInfo ? apps.id_number : "***"}{" "}
                                    {}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {showPersonalInfo ? apps.phone : "***"} {}
                                    {/* {apps.phone} */}
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    {apps.has_application}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TableComponent;
