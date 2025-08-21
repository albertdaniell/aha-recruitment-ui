"use client";
import { Main } from "next/document";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopMobileNav from "../pagecomponents/TopMobileNav";
import { Button, Modal, Spinner } from "flowbite-react";
import SideMenu from "../pagecomponents/SideMenu";
import {
  getCountyStats,
  sendNotification,
} from "@/app/app-redux/features/AppData/appSlice";
import { JsonToExcel } from "react-json-to-excel";
import { FormatDate, JsonToformData } from "@/app/constants/utils";
import { Check } from "akar-icons";

function Confirmations() {
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

  let [openModal, SetOpenModal] = useState(null);
  let [object, set_object] = useState(null);
  let [messageToSend, Set_messageToSend] = useState(null);
  let [loading_sms, set_loading_sms] = useState(null);

  let handleModal = (object, state) => {
    let data = JSON.parse(object);
    set_object(data);

    if (state) {
      SetOpenModal(state);
      let message = `${data.agripreneur_name}, Kindly update your passport image on https://apeoi.kalro.org/confirm-availability`;
      Set_messageToSend(message);
    } else {
      SetOpenModal(state);
    }
  };

  let handleSendNotification = () => {
    set_loading_sms(true);
    dispatch(
      sendNotification(
        JsonToformData({
          message: messageToSend,
          availability_object_id: object.id,
          phone: object.system_phone,
        })
      )
    )
      .unwrap()
      .then((res) => {
        set_loading_sms(false);

        set_object(null);
        Set_messageToSend(null);
        SetOpenModal(false);
        alert("Success");
      })
      .catch((err) => {
        set_loading_sms(false);

        alert("Error!");
        set_object(null);
        Set_messageToSend(null);
        SetOpenModal(false);
      });
  };
  return (
    <>
      <Modal
        dismissible={false}
        show={openModal}
        onClose={() => handleModal(null, !object)}
      >
        <Modal.Header>{object?.agripreneur_name}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
              Notify {object?.agripreneur_name} to update their passport image
            </p>

            {/* {JSON.stringify(object)} */}

            {object?.admin_sent_correction && (
              <span className="leading-relaxed text-gray-500 dark:text-gray-400 text-xs">
                The agripreneur was already notified to update their details
              </span>
            )}

            {object?.passport_photo_url ? (
              <img
                src={object?.passport_photo_url}
                className="h-40 w-40 object-cover rounded-full"
              ></img>
            ) : (
              <p className="text-orange-600">No image</p>
            )}

            <textarea
              disabled={loading_sms}
              onChange={(e) => Set_messageToSend(e.target.value)}
              className="p-4 my-2 border-slate-400 rounded-xl w-[100%] text-blue-800"
              placeholder="Enter the OTP sent to your phone number here"
              defaultValue={messageToSend}
            ></textarea>

            {loading_sms ? (
              <Spinner></Spinner>
            ) : (
              <Button color="blue" onClick={() => handleSendNotification()}>
                Send notification
              </Button>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => handleModal(null, !object)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="grid md:grid-cols-5">
        <div className=" text-white md:h-[100vh] md:block hidden p-3">
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

                <div className="mt-5 rounded-lg p-0 overflow-hidden">
                  <div className=" text-gray-700 px-2 py-1 flex gap-3 justify-between">
                    <h2 className="text-xl my-2">Confirmations</h2>
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
                      data={county_stats.data.availability_confimed_serialied}
                      fileName={`confirmations_${user_county}_as_on_${FormatDate(
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
                        <div className="grid md:grid-cols-2 gap-3 grid-cols-1">
                          {county_stats.data.availability_confimed_serialied.map(
                            (apps, index) => {
                              return (
                                <div
                                  key={index}
                                  className="rounded-xl shadow-sm hover:shadow-xl flex bg-slate-50 overflow-hidden border-[1px] border-slate-100"
                                >
                                  <div className="w-[30%] h-[100%]">
                                    {apps.is_available ? (
                                      <img
                                        src={apps.passport_photo_url}
                                        className="h-40 w-40 object-cover"
                                      ></img>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="p-2">
                                    <p className="font-medium">
                                      {apps.agripreneur_name}
                                    </p>

                                    <p className="text-slate-500 text-sm">
                                      {FormatDate(apps.created_at)}
                                    </p>

                                    {showPersonalInfo ? (
                                      <p className="mt-4">
                                        {apps.system_phone}
                                      </p>
                                    ) : (
                                      <p className="text-slate-600 mt-4 text-xs">
                                        Phone number hidden
                                      </p>
                                    )}

                                    {apps.is_available ? (
                                      <>
                                        <div className="text-green-500 mt-4 text-sm flex flex-row gap-2   min-w-2">
                                          <Check /> is available
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="text-red-500 mt-4 text-sm flex flex-row gap-2  min-w-2">
                                          NOT available
                                        </div>
                                      </>
                                    )}
                                    <div className="flex gap-3 my-3">
                                      <div>
                                        <button
                                          onClick={() =>
                                            handleModal(
                                              JSON.stringify(apps),
                                              true
                                            )
                                          }
                                          className="text-xs border-[1px] border-blue-400 rounded-sm p-1 text-blue-600 bg-blue-100"
                                        >
                                          Notify to update passport image
                                        </button>
                                      </div>

                                      <div></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
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

export default Confirmations;
