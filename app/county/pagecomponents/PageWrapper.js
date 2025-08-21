"use client";
import Main from "@/app/components/Main/Main";
import React, { useEffect, useState } from "react";
import TopStats from "./TopStats";
import { useDispatch, useSelector } from "react-redux";
import { getCountyStats } from "@/app/app-redux/features/AppData/appSlice";
import Link from "next/link";
import SideMenu from "./SideMenu";
import {
  FormatDate,
  make_WardApplicants_Enumerators,
  make_data_past_7_days_graph,
  make_gender_pie,
  sortedData,
} from "@/app/constants/utils";
import CsvDownloadButton from "react-json-to-csv";
import { Button, Modal, Spinner } from "flowbite-react";
import TopMobileNav from "./TopMobileNav";
import AppChart from "@/app/components/AppChart";

function PageWrapper({ children }) {
  const dispatch = useDispatch();

  const appData = useSelector((state) => state.appData);
  const { county_stats, loginUserState } = appData;
  const [openModal3, SetShowModal3] = useState(false);
  const [embed_url, set_show_embed_url] = useState(false);
  const [filter, set_filter] = useState("all");

  let user_county =
    loginUserState.data !== null ? loginUserState.data.county_string : null;

  const [application_selected, set_application_selected] = useState(null);
  const [showModal, SetShowModal] = useState(null);

  const handleSelectApplication = (data) => {
    set_application_selected(JSON.parse(data));

    SetShowModal(true);
  };

  const handleShowEmbedModal = (url, state) => {
    if (state) {
      SetShowModal3(true);
      set_show_embed_url(url);
    } else {
      SetShowModal3(false);
      set_show_embed_url(null);
    }
  };
  // console.log(county_stats.data);
  let graph_data_1 =
    county_stats.data !== null
      ? make_WardApplicants_Enumerators(
          county_stats.data.stats_ward,
          user_county
        )
      : null;

  let graph_data_2 =
    county_stats.data !== null ? make_gender_pie(county_stats.data) : null;
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

  let graph_data_3 =
    county_stats.data !== null
      ? make_data_past_7_days_graph(
          county_stats.data.data_past_7_days,
          user_county
        )
      : null;
  // useEffect(() => {
  //   // console.log(loginUserState)
  //   user_county !== null &&
  //     getData()
  // }, [user_county]);

  const handleSelectFilter = (val) => {
    if (val !== "null") {
      set_filter(val);
    }
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
    <Main>
      <div className="grid md:grid-cols-5">
      <div className=" text-white md:h-[100vh] md:block hidden">
          {/* Side menu county */}
          <SideMenu county_name={user_county} />
        </div>
        <div class="col-span-4 px-2 md:px-5 max-h-[100vh] overflow-auto">
          <div className="py-3 md:py-5 mb-5">
            {/* {JSON.stringify(county_stats)} */}

            <select
              onChange={(e) => handleSelectFilter(e.target.value)}
              className="rounded text-sm border-2 border-blue-500 text-blue-800 mb-3"
            >
              <option value="all" selected>
                All Agripreneurs
              </option>
              <option value="0">Pre Registered Agripreneurs</option>
              <option value="1">Self Registered Agripreneurs</option>
            </select>
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
                <div className="my-3"></div>
                <TopStats
                  user_county={user_county}
                  county_stats={county_stats.data}
                />
                <Modal
                  size="5xl"
                  dismissible={false}
                  show={openModal3}
                  onClose={() => handleShowEmbedModal(null, false)}
                >
                  <Modal.Header>Preview</Modal.Header>
                  <Modal.Body>
                    <div className="space-y-6">
                      <embed
                        style={{ minHeight: "100vh" }}
                        src={embed_url}
                        // src="https://apeoi.kalro.org/media/preview_cv/S8U2MG_booking_confirmation_guqOHUI.pdf"
                        width="100%"
                        height="100%"
                        type="application/pdf"
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      color="gray"
                      onClick={() => handleShowEmbedModal(null, false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* applications selected modal */}

                {application_selected !== null && (
                  <>
                    <Modal
                      dismissible
                      show={showModal}
                      onClose={() => SetShowModal(false)}
                    >
                      <Modal.Header>
                        <div className="flex flex-row gap-3 justify-center items-center">
                          {application_selected.gender === "Male" ? (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          ) : application_selected.gender === "Female" ? (
                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                          ) : (
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          )}

                          {application_selected.enumerator_name}
                        </div>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="space-y-6">
                          <div className="space-y-4">
                            {/* {JSON.stringify(application_selected)} */}
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Have a postgraduate certificate:{" "}
                              {
                                application_selected.have_post_secondary_certificate
                              }
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Age between 18 and 35 years:{" "}
                              {application_selected.between_18_and_35_age}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Resident of ward:{" "}
                              {application_selected.resident_of_ward}
                            </p>

                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Is digitally literate:{" "}
                              {application_selected.digitally_literate}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              is Person with disability:{" "}
                              {application_selected.pwd}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Have good communication skills:{" "}
                              {application_selected.good_communication_skills}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Have experience in the field of agriculture:{" "}
                              {application_selected.experience_in_agric_dev}
                            </p>

                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Committed to full time engagement:{" "}
                              {application_selected.full_time}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Gender: {application_selected.gender}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Contact Email: {application_selected.email}
                            </p>
                            <p className="leading-relaxed text-gray-500 text-sm dark:text-gray-400">
                              Date:{" "}
                              {FormatDate(application_selected.created_at)}
                            </p>
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          color="gray"
                          onClick={() => SetShowModal(false)}
                        >
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                )}

                <div className="grid lg:grid-cols-3 grid-cols-1 gap-3 my-3">
                  <div className="rounded shadow-sm bg-green-100">
                    <h3 className="p-2 text-sm">Applications by gender</h3>
                    <AppChart options={graph_data_2} />
                  </div>
                  <div className="col-span-2 rounded shadow-sm bg-green-100">
                    <h3 className="p-2 text-sm">
                      {user_county === "admin"
                        ? "Last 7 days applications"
                        : "Last 7 days applications"}
                    </h3>
                    {/* {JSON.stringify(graph_data_1)} */}
                    <AppChart options={graph_data_3} />
                  </div>
                </div>
                <div className="grid md:grid-cols-1 grid-cols-1 gap-3 my-3">
                  <div className="rounded shadow-sm bg-green-100">
                    <h3 className="p-2 text-sm">
                      {user_county === "admin"
                        ? "County Applications"
                        : " Ward Applications"}
                    </h3>
                    {/* {JSON.stringify(graph_data_1)} */}
                    <AppChart options={graph_data_1} />
                  </div>
                </div>
                {county_stats.loading && (
                  <>
                    <Spinner />

                    <p>Loading data...</p>
                  </>
                )}

                <div className="mt-5 rounded-lg p-0 shadow-lg overflow-hidden">
                  <div className="bg-green-100 text-gray-700 px-2 py-1 flex gap-3 justify-between">
                    <h2 className="text-xl my-2">Applications</h2>
                    <button
                      onClick={() => getData()}
                      className="text-blue-400 text-sm"
                    >
                      Reload
                    </button>
                  </div>

                  {/* stats */}
                  <div class="flex flex-col bg-white-50 ">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div class="overflow-hidden"></div>
                        <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                          <thead class="border-b border-neutral-200 font-medium dark:border-white/10">
                            <tr>
                              {user_county !== "admin" ? (
                                <>
                                  <th scope="col" class="px-6 py-4">
                                    Ward
                                  </th>
                                  <th scope="col" class="px-6 py-4">
                                    Subcounty
                                  </th>
                                </>
                              ) : (
                                <th scope="col" class="px-6 py-4">
                                  County
                                </th>
                              )}

                              <th scope="col" class="px-4 py-4">
                                Applications
                              </th>
                              <th scope="col" class="px-3 py-4">
                                Total Agripreneurs
                              </th>
                              <th scope="col" class="px-6 py-4">
                                Male
                              </th>
                              <th scope="col" class="px-6 py-4">
                                Female
                              </th>
                              <th scope="col" class="px-6 py-4">
                                Other gender
                              </th>
                              <th scope="col" class="px-6 py-4">
                                PWD
                              </th>
                            </tr>
                          </thead>
                          {sortedData(county_stats.data.stats_ward).map(
                            (apps) => {
                              return (
                                <tr
                                  class={`border-b border-neutral-200 dark:border-white/10 ${
                                    user_county === "admin" &&
                                    apps.data.stats_ === 0 &&
                                    "text-red-500"
                                  }
                                ${
                                  user_county !== "admin" &&
                                  apps.stats_ward === 0 &&
                                  "text-red-500"
                                }
                                `}
                                >
                                  {user_county !== "admin" ? (
                                    <>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.ward}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.subcounty}
                                      </td>
                                    </>
                                  ) : (
                                    <td class="whitespace-nowrap px-6 py-4">
                                      {apps.county}
                                    </td>
                                  )}

                                  {user_county === "admin" ? (
                                    <>
                                      <td class={`whitespace-nowrap px-4 py-4`}>
                                        {/* {JSON.stringify(apps)} */}
                                        {apps.data.stats_}
                                      </td>
                                      <td class="whitespace-nowrap px-3 py-3">
                                        {apps.data._enumerators}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.data._male_data}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.data._female_data}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.data._other_gender_data}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.data._pwd_applicants}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td
                                        class={`whitespace-nowrap px-6 py-4 ${
                                          apps.stats_ward === 0 &&
                                          "text-red-500"
                                        }`}
                                      >
                                        {/* {JSON.stringify(apps)} */}
                                        {apps.stats_ward}
                                      </td>

                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.ward_enumerators}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.ward_male_data}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.ward_female_data}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.ward_other_gender_data}
                                      </td>
                                      <td class="whitespace-nowrap px-6 py-4">
                                        {apps.ward_pwd_applicants}
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            }
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* {JSON.stringify(user_county)} */}

            {/* {JSON.stringify(county_stats)} */}
          </div>
        </div>
      </div>
    </Main>
  );
}

export default PageWrapper;
