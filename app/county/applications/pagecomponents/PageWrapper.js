"use client";
import Main from "@/app/components/Main/Main";
import React, { useEffect, useState } from "react";
import TopStats from "../../pagecomponents/TopStats";
import { useDispatch, useSelector } from "react-redux";
import {
  ToggleChangeCountyStats,
  getCountyStats,
  getUtils,sendNotification
} from "@/app/app-redux/features/AppData/appSlice";
import Link from "next/link";
import SideMenu from "../../pagecomponents/SideMenu";
import {
  FormatDate,
  JsonToformData,
  countWords,
  generateCountySubCountyWard,
  getFileSize,
  getFileTypeFromUrl,
  sortedApplicationsData,
  sortedData,
} from "@/app/constants/utils";
import CsvDownloadButton from "react-json-to-csv";
import { Button, Modal, Spinner,Table, Tabs } from "flowbite-react";
import TopMobileNav from "../../pagecomponents/TopMobileNav";
import AdminSelectorGroup from "@/app/components/Search/AdminSelectorGroup";
import { JsonToExcel } from "react-json-to-excel";
import { Check } from "akar-icons";

// import TopMobileNav from "./TopMobileNav"

function PageWrapper({ children }) {
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

  const handleCountySelect = async (data) => {
    data = JSON.parse(data);
    // Set_subcounty_selected(null);
    set_recent_wards(null);
    set_subcounty(null);
    set_ward(null);
    set_recent_subcounties(null);

    // removeValueFromOffline("@ward_selected");
    // console.log({data})
    // return 0
    // console.log(data);
    setTimeout(async () => {
      // console.log(adminUnitsData.subcounties.)
      // return 0

      let subcounties = adminUnitsData.subcounties.filter((d) => {
        return d.County === data.County;
      });
      set_county(data.County);

      set_recent_subcounties(subcounties);
      //   console.log(subcounties)
      SetCountySelected(data);
      SetSubCountySelected(null);
      //   set_recent_wards(null);
    }, 100);
  };

  const handleSubCountySelect = (data) => {
    SetSubCountySelected(null);
    set_subcounty(null);
    set_ward(null);
    data = JSON.parse(data);
    set_recent_wards(null);

    setTimeout(async () => {
      let wards = adminUnitsData.wards
        .filter((d) => {
          return d.Subcounty === data.Subcounty;
        })
        .filter((d) => {
          return d.County === county;
        });

      let filtered = county_stats.data.data.filter((cs_data) => {
        return cs_data.enumerator_sucounty === data.Subcounty;
      });

      set_app_county_stats_table_data(filtered);
      // console.log(wards)
      set_subcounty(data.Subcounty);

      set_recent_wards(wards);

      SetSubCountySelected(data.id);
    }, 100);
  };

  const handleWardSelect = (data) => {
    data = JSON.parse(data);

    setTimeout(() => {
      set_ward(data.Ward);
      // console.log(
      //   county_stats.data.data.map((res) => {
      //     return res;
      //   })
      // );
      // console.log(app_county_stats)

      let filtered = county_stats.data.data.filter((cs_data) => {
        return (
          cs_data.enumerator_sucounty === subcounty &&
          cs_data.enumerator_ward === data.Ward
        );
      });

      set_app_county_stats_table_data(filtered);

      // let new_array = app_county_stats.data.map((acs)=>{
      //   return {
      //     ...acs.data,
      //   }
      // })

      // console.log(filtered);
      // set_app_county_stats(prevDataArray => (
      //   prevDataArray.data.map(item => {
      //       return {
      //         ...item,
      //         data: {
      //           ...item.data,
      //           ...filtered // Merge updated nested data with existing nested data
      //         }
      //       };
      //     return item; // Return unchanged item if id doesn't match
      //   })
      // ));

      // set_app_county_stats((prevDataArray) =>
      //   prevDataArray.map((item) => {
      //     return { ...item, data: filtered }; // Merge updated data with existing item
      //     return item; // Return unchanged item if id doesn't match
      //   })
      // );

      // set_app_county_stats(
      //   county_stats.data.map((cs)=>{
      //     return ({
      //       ...cs,
      //       data: cs.data.filter((cs_data)=>{
      //         return cs_data.enumerator_sucounty === subcounty &&
      //         cs_data.enumerator_ward === data.Ward
      //       })
      //     })
      //   })
      // )
      SetWardSelected(data.id);
    }, 100);
  };

  const handleSelectWard = () => {};

  // showPersonalInfo

  let user_county =
    loginUserState.data !== null ? loginUserState.data.county_string : null;

  const [application_selected, set_application_selected] = useState(null);
  const [showModal, SetShowModal] = useState(null);

  const handleSelectFilter = (val) => {
    if (val !== "null") {
      set_filter(val);
    }
  };
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

  const getData = () => {
    SetSubCountySelected(null);
    set_subcounty(null);
    set_ward(null);

    user_county !== null &&
      dispatch(
        getCountyStats({
          county_of_data: user_county,
          county_admin:
            user_county === "admin" ? county_selected_stats : user_county,
          filter: filter,

          Token: loginUserState.data.token,
        })
      );
  };

  // useEffect(() => {
  //   user_county !== null &&
  //     dispatch(
  //       getCountyStats({
  //         county_of_data: user_county,
  //         Token: loginUserState.data.token,
  //       })
  //     );
  // }, [user_county]);

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

  useEffect(() => {
    // console.log(loginUserState)
    getData();
  }, [user_county, county_selected_stats, filter]);

  useEffect(() => {
    // generate county,subcounty,ward

    if (app_utils.data) {
      let admin_data_set = generateCountySubCountyWard(app_utils.data);
      // get the current

      SetAdminUnits(admin_data_set);

      // console.log(current_county)
    }
  }, [app_utils]);

  let [availability_confimed_serialied,set_availability_confimed_serialied] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  

  // Calculate total pages
  const totalPages = Math.ceil(availability_confimed_serialied?.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = availability_confimed_serialied?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(()=>{
    if(county_stats?.data?.availability_confimed_serialied){
      set_availability_confimed_serialied(county_stats?.data?.availability_confimed_serialied)
     

    }
  },[county_stats])

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (adminUnitsData && user_county !== "admin") {
      let current_county = adminUnitsData.counties.filter((data) => {
        return data.County === user_county;
      })[0];
      // console.log(current_county);

      setTimeout(() => {
        handleCountySelect(JSON.stringify(current_county));
      }, 1000);
    } else {
      // console.log({ adminUnitsData });
    }
  }, [adminUnitsData, filter]);

  useEffect(() => {
    if (county_stats.data) {
      set_app_county_stats(county_stats);
      set_app_county_stats_table_data(county_stats.data.data);
    }
  }, [county_stats]);

  useEffect(() => {
    dispatch(getUtils(true))
      .unwrap()
      .then((res) => {})
      .catch((e) => {});
  }, []);

  let items = [
    {
      id:1,
      title:"Applications",
      content:<>
        <div>
    
          <div className="py-3">
           

            
            {app_county_stats.data && (
              <>
                <TopMobileNav user_county={user_county} />
                {/* <TopStats app_county_stats={app_county_stats.data} /> */}
                <Modal
                  size="7xl"
                  dismissible={false}
                  show={openModal3}
                  onClose={() => handleShowEmbedModal(null, false)}
                >
                  <Modal.Header>Preview</Modal.Header>
                  <Modal.Body>
                    {loading_embed && <Spinner></Spinner>}

                    <div className="space-y-6">
                      <embed
                        onLoadStart={() => set_is_loading_embed(true)}
                        onLoad={() => set_is_loading_embed(false)}
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
                    <div className="flex flex-wrap gap-3 justify-around  w-[100%]">
                      <div className="flex-1">
                        <Button
                          color="gray"
                          onClick={() => handleShowEmbedModal(null, false)}
                        >
                          Close
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Link
                          className="text-blue-400 my-2 text-xs text-right"
                          target="_blank"
                          href={embed_url}
                        >
                          {embed_url}
                        </Link>
                        <br></br>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>

                {/* applications selected modal */}

                {application_selected !== null && (
                  <>
                    <Modal
                      size="7xl"
                      dismissible={false}
                      show={showModal}
                      onClose={() => {
                        SetShowModal(false), set_show_p_info(false);
                      }}
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
                          {application_selected.newly_registered === "Yes" ? (
                            <span className="bg-orange-400 p-[2px] rounded-sm text-xs text-white">
                              New
                            </span>
                          ) : (
                            ""
                          )}{" "}
                          {application_selected.enumerator_name} ID number:{" "}
                          {showPersonalInfo ? (
                            <span className="text-sm">
                              {application_selected.enumerator_id_number} |{" "}
                              {application_selected.enumerator_phone_number}
                              <button
                                onClick={() =>
                                  set_show_p_info(!showPersonalInfo)
                                }
                                className="text-blue-500 text-sm mx-2"
                              >
                                Hide personal info
                              </button>
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  set_show_p_info(!showPersonalInfo)
                                }
                                className="text-blue-500 text-sm"
                              >
                                {!showPersonalInfo
                                  ? "Show personal info"
                                  : "Hide personal info"}
                              </button>
                            </>
                          )}
                        </div>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="space-y-6">
                          <div className="space-y-4">
                            {/* {JSON.stringify(application_selected)} */}
                            <div className="flex flex-wrap gap-3 divide-x-2">
                              {application_selected.cv_url === null ||
                              application_selected.cv_url === "null" ? (
                                "Not provided"
                              ) : (
                                <>
                                  {/* {apps.cv_url} */}
                                  <button
                                    // target="_blank"
                                    // href={apps.pwd_cert_url}
                                    className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                    onClick={() =>
                                      handleShowEmbedModal(
                                        application_selected.cv_url,
                                        true
                                      )
                                    }
                                  >
                                    View CV (
                                    {getFileTypeFromUrl(
                                      application_selected.cv_url
                                    )}
                                    )
                                  </button>

                                  {application_selected.post_secondary_certificate_url ===
                                    null ||
                                  application_selected.post_secondary_certificate_url ===
                                    "null" ? (
                                    <div className="text-white bg-gray-700 px-2 py-1 rounded-sm text-xs">
                                      No post sec cert
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        // target="_blank"
                                        // href={apps.pwd_cert_url}
                                        className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                        onClick={() =>
                                          handleShowEmbedModal(
                                            application_selected.post_secondary_certificate_url,
                                            true
                                          )
                                        }
                                      >
                                        View Post Secondary (
                                        {getFileTypeFromUrl(
                                          application_selected.post_secondary_certificate_url
                                        )}
                                        )
                                      </button>
                                    </>
                                  )}

                                  {application_selected.id_card_url === null ||
                                  application_selected.id_card_url ===
                                    "null" ? (
                                    <div className="text-white bg-gray-700 px-2 py-1 rounded-sm text-xs">
                                      No ID card
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        // target="_blank"
                                        // href={apps.pwd_cert_url}
                                        className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                        onClick={() =>
                                          handleShowEmbedModal(
                                            application_selected.id_card_url,
                                            true
                                          )
                                        }
                                      >
                                        View ID Card(
                                        {getFileTypeFromUrl(
                                          application_selected.id_card_url
                                        )}
                                        )
                                      </button>
                                    </>
                                  )}

                                  {application_selected.pwd_cert_url === null ||
                                  application_selected.pwd_cert_url ===
                                    "null" ? (
                                    <div className="text-white bg-gray-700 px-2 py-1 rounded-sm text-xs">
                                      No PWD Cert
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        // target="_blank"
                                        // href={apps.pwd_cert_url}
                                        className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                        onClick={() =>
                                          handleShowEmbedModal(
                                            application_selected.pwd_cert_url,
                                            true
                                          )
                                        }
                                      >
                                        View PWD Cert (
                                        {getFileTypeFromUrl(
                                          application_selected.pwd_cert_url
                                        )}
                                        )
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
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
                              Experienced in agriculture:{" "}
                              {application_selected.experience_in_agric_dev}
                            </p>
                            {application_selected.experience_crops_livestock_description && (
                              <p className="text-base leading-relaxed text-green-700 dark:text-gray-400">
                                <span className="text-gray-800">
                                  Experienced in agriculture (
                                  {countWords(
                                    application_selected.experience_crops_livestock_description
                                  )}{" "}
                                  words)
                                </span>
                                <br></br>
                                {
                                  application_selected.experience_crops_livestock_description
                                }
                              </p>
                            )}

                            <p className="text-base leading-relaxed text-green-700 dark:text-gray-400">
                              <span className="text-gray-800">
                                Aspiration (
                                {countWords(
                                  application_selected.aspiration_as_an_agriculture_entrepreneur
                                )}{" "}
                                words)
                              </span>
                              <br></br>
                              {
                                application_selected.aspiration_as_an_agriculture_entrepreneur
                              }
                            </p>

                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Resident of ward:{" "}
                              {application_selected.resident_of_ward}
                            </p>

                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Is digitally literate:{" "}
                              {application_selected.digitally_literate}
                            </p>
                            {application_selected.android_model && (
                              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                                Phone type:
                                {application_selected.android_model}
                              </p>
                            )}

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
                              Has motorcycle: {application_selected.have_boda}
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                              Contact Email: {application_selected.email}
                            </p>
                            <p className="leading-relaxed text-gray-500 text-xs dark:text-gray-400">
                              Date applied:{" "}
                              {FormatDate(application_selected.created_at)}
                            </p>
                            <p className="leading-relaxed text-gray-500 text-xs dark:text-gray-400">
                              Date updated:{" "}
                              {FormatDate(application_selected.updated_at)}
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
                        <JsonToExcel
                          title="Download as Excel"
                          data={[application_selected]}
                          fileName={`${
                            application_selected.enumerator_name
                          }_${user_county}_as_on_${FormatDate(new Date())}`}
                          btnClassName="text-white rounded-md bg-blue-700 px-0 py-0 text-xs text-sm self-end justify-end"
                        />
                        {/* <CsvDownloadButton
                          filename={`${
                            application_selected.enumerator_name
                          }_${user_county}_as_on_${FormatDate(new Date())}`}
                          className="text-white rounded-md bg-blue-700 px-3 py-3 text-sm self-end justify-end"
                          delimiter=","
                          data={[application_selected]}
                        /> */}
                      </Modal.Footer>
                    </Modal>
                  </>
                )}


 <div className=" text-gray-700 py-5 flex justify-between">
                    <h2 className="text-xl">
                      Applications (
                      {app_county_stats.data !== null &&
                        app_county_stats_table_data.length}
                      )
                    </h2>
                    <button
                      onClick={() => set_show_p_info(!showPersonalInfo)}
                      className="text-blue-500 text-sm"
                    >
                      {!showPersonalInfo
                        ? "Show personal info"
                        : "Hide personal info"}
                    </button>
                  </div>
                  <JsonToExcel
                              title="Download as Excel"
                              data={app_county_stats_table_data}
                              fileName={`Applicants_${user_county}${
                                ward !== null ? `_${ward}_` : "_"
                              }as_on_${FormatDate(new Date())}`}
                              btnClassName="text-white rounded-md bg-blue-700 px-0 py-0  text-[8px] text-sm self-end justify-end"
                            />
                <div className="my-2 overflow-auto max-h-[65vh] rounded-md shadow-sm border-[1px] border-slate-300">
                  {/* applications */}
                 
                  {/* <hr></hr> */}
                  <div
                    class={`flex flex-col bg-white-50 rounded-lg p-3 shadow-lg md:max-h-[75vh] overflow-auto`}
                  >
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div class="overflow-hidden">
                          {/* {JSON.stringify(app_utils)} */}
                          {/* <ExportJsonCsv headers={headers} items={data}>Export</ExportJsonCsv> */}

                          <div className="px-3">
                            
                            {/* <CsvDownloadButton
                            filename={`Applicants_${user_county}${ward !==null ?`_${ward}_`:"_"}as_on_${FormatDate(
                              new Date()
                            )}`}
                            className="text-white rounded-md bg-blue-700 px-3 py-2 text-sm self-end justify-end"
                            delimiter=","
                            data={app_county_stats_table_data}
                          /> */}
                          </div>
                          {user_county !== "admin" && (
                            <div className="my-4">
                              {adminUnitsData && (
                                <AdminSelectorGroup
                                  showCounty={false}
                                  handleWardSelect={handleWardSelect}
                                  handleSubCountySelect={handleSubCountySelect}
                                  handleCountySelect={handleCountySelect}
                                  counties_data={adminUnitsData.counties}
                                  recent_wards={recent_wards}
                                  recent_subcounties={recent_subcounties}
                                  county_selected={countySelected}
                                  subcounty_selected={subCountySelected}
                                  ward_selected={wardSelected}
                                />
                              )}
                              <hr></hr>
                            </div>
                          )}

                          <Table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                            <Table.Head class="border-b border-neutral-200 font-medium dark:border-white/10">
                              
                                <Table.HeadCell scope="col" class="px-3 py-2">
                                  #
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Name
                                </Table.HeadCell>
                                {/* enumerator_sucounty */}
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Sub county
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Ward
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Phone
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Nat. ID
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  CV
                                </Table.HeadCell>
                                {/* experience_in_agric_dev */}
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Experienced in agric
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  PWD
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  PWD Cert
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Available Full time
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Post Sec
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Post Sec Cert
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Date applied
                                </Table.HeadCell>
                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Date updated
                                </Table.HeadCell>
                                {user_county === "NAKURU"  && (
                                    <Table.HeadCell scope="col" class="px-3 py-4">
                                      Score
                                    </Table.HeadCell>
                                  )}

                                <Table.HeadCell scope="col" class="px-3 py-4">
                                  Action
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                              {/* aa  {JSON.stringify(app_county_stats_table_data)} */}
                              {/* qq {app_county_stats_table_data} */}
                              {/* {sortedApplicationsData(
                                app_county_stats.data.data
                              ).map((apps, index) => { */}
                              {Array.isArray(app_county_stats_table_data) &&
                                app_county_stats_table_data.map(
                                  (apps, index) => {
                                    return (
                                      <Table.Row class="border-b border-neutral-200 dark:border-white/10">
                                        <Table.Cell class="whitespace-nowrap px-3 py-2 font-bold">
                                          {index + 1}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4 uppercase">
                                          <button
                                            className="text-blue-500 uppercase"
                                            onClick={() =>
                                              handleSelectApplication(
                                                JSON.stringify(apps)
                                              )
                                            }
                                          >
                                            {apps.enumerator_name}{" "}
                                            {apps.newly_registered === "Yes" ? (
                                              <span className="bg-orange-400 p-[2px] rounded-sm text-xs text-white">
                                                New
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </button>
                                        </Table.Cell>
                                        {/* enumerator_sucounty */}
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {apps.enumerator_sucounty}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {apps.enumerator_ward}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {showPersonalInfo
                                            ? apps.enumerator_phone_number
                                            : "***"}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4 uppercase">
                                          {showPersonalInfo
                                            ? apps.enumerator_id_number
                                            : "***"}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {/* {apps.pwd_cert_url !== null && apps.pwd_cert_url !== "null"? "haha":"NO"} */}
                                          {apps.cv_url === null ||
                                          apps.cv_url === "null" ? (
                                            "Not provided"
                                          ) : (
                                            <>
                                              {/* {apps.cv_url} */}
                                              <button
                                                // target="_blank"
                                                // href={apps.pwd_cert_url}
                                                className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                                onClick={() =>
                                                  handleShowEmbedModal(
                                                    apps.cv_url,
                                                    true
                                                  )
                                                }
                                              >
                                                View CV (
                                                {getFileTypeFromUrl(
                                                  apps.cv_url
                                                )}
                                                )
                                              </button>
                                            </>
                                          )}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {apps.experience_in_agric_dev}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {apps.pwd}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {/* {apps.pwd_cert_url !== null && apps.pwd_cert_url !== "null"? "haha":"NO"} */}
                                          {apps.pwd_cert_url === null ||
                                          apps.pwd_cert_url === "null" ? (
                                            "Not provided"
                                          ) : (
                                            <>
                                              <button
                                                // target="_blank"
                                                // href={apps.pwd_cert_url}
                                                className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                                onClick={() =>
                                                  handleShowEmbedModal(
                                                    apps.pwd_cert_url,
                                                    true
                                                  )
                                                }
                                              >
                                                View (
                                                {getFileTypeFromUrl(
                                                  apps.pwd_cert_url
                                                )}
                                                )
                                              </button>
                                            </>
                                          )}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {apps.full_time}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          {apps.have_post_secondary_certificate}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4">
                                          <Table.Cell class="whitespace-nowrap px-3 py-4">
                                            {/* {apps.pwd_cert_url !== null && apps.pwd_cert_url !== "null"? "haha":"NO"} */}
                                            {apps.post_secondary_certificate_url ===
                                              null ||
                                            apps.post_secondary_certificate_url ===
                                              "null" ? (
                                              "Not provided"
                                            ) : (
                                              <>
                                                <button
                                                  // target="_blank"
                                                  // href={apps.pwd_cert_url}
                                                  className="text-white bg-purple-500 px-2 py-1 rounded-sm text-xs"
                                                  onClick={() =>
                                                    handleShowEmbedModal(
                                                      apps.post_secondary_certificate_url,
                                                      true
                                                    )
                                                  }
                                                >
                                                  View (
                                                  {getFileTypeFromUrl(
                                                    apps.post_secondary_certificate_url
                                                  )}
                                                  )
                                                </button>
                                              </>
                                            )}
                                          </Table.Cell>
                                          {/* {apps.post_secondary_certificate_url !==
                                      null ? (
                                        "None"
                                      ) : (
                                        <>
                                          <Link
                                            target="_blank"
                                            href={
                                              apps.post_secondary_certificate_url
                                            }
                                            className="text-blue-400"
                                          >
                                            View Cert
                                          </Link>
                                        </>
                                      )} */}
                                        </Table.Cell>

                                        <Table.Cell class="whitespace-nowrap px-3 py-4 text-xs">
                                          {FormatDate(apps.created_at)}
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-nowrap px-3 py-4 text-xs">
                                          {FormatDate(apps.updated_at)}
                                        </Table.Cell>
                                        {apps.hasOwnProperty("score") && (
                                          <Table.Cell class="whitespace-nowrap px-3 py-4 font-semibold">
                                            {apps.score}
                                          </Table.Cell>
                                        )}

                                        <Table.Cell>
                                          <button
                                            onClick={() =>
                                              handleSelectApplication(
                                                JSON.stringify(apps)
                                              )
                                            }
                                            className="text-white bg-green-500 px-3 py-1 rounded-sm text-xs"

                                            // className="bg-green-400 text-white  px-3 py-2 text-sm rounded-sm my-5"
                                          >
                                            View
                                          </button>
                                        </Table.Cell>
                                      </Table.Row>
                                    );
                                  }
                                )}
                            </Table.Body>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* {JSON.stringify(user_county)} */}

            {/* {JSON.stringify(app_county_stats)} */}
          </div>
      </div>
      </>
    },
    {
      id:2,
      title:"Confirmations/ Passport photos",
      content:<>
       <>
      <Modal
        dismissible={false}
        show={openModal}
        onClose={() => handleModal(null, !object)}
        size={"5xl"}
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
                className="h-full w-full object-cover rounded-md"
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

      <div>
       
        <div class="col-span-4 px-2 md:px-5 max-h-[100vh] overflow-auto">
          <div className=" md:py-5 mb-5">
            {/* {JSON.stringify(county_stats)} */}

            <button
              onClick={getData}
              className="bg-green-200 text-sm rounded px-3 py-1"
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
                <div className="bg-white my-0 text-xl">
                  <center>
                    <img
                      src="https://img.freepik.com/free-vector/my-password-concept-illustration_114360-4294.jpg"
                      height={400}
                      width={400}
                    ></img>
                  </center>
                  <p className="text-orange-800 text-center">
                    {county_stats.error}
                  </p>
                  <center>
                    <button
                      onClick={getData}
                      className="bg-green-200 text-sm rounded px-3"
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

                <div className="mt-0 rounded-lg p-0 overflow-hidden">
                  <div className=" text-gray-700 py-1 flex gap-3 justify-between">
                    <id>
                    <h2 className="text-xl my-2">Confirmations</h2>
                    <p className="text-slate-500">Showing {currentItems?.length} of {availability_confimed_serialied?.length}</p>
                    </id>
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
                  <div className="mb-2">
                    <JsonToExcel
                      title="Download as Excel"
                      data={availability_confimed_serialied}
                      fileName={`confirmations_${user_county}_as_on_${FormatDate(
                        new Date()
                      )}`}
                      btnClassName="text-white rounded-md bg-blue-700 px-0 py-0 text-xs text-sm self-end justify-end"
                    />
                  </div>
                  {/* stats */}
                  <div class="flex flex-col bg-white-50 max-h-[60vh]">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div class="inline-block min-w-full  sm:px-6 lg:px-8">
                        <div class="overflow-hidden"></div>
                        <div className="grid md:grid-cols-3 gap-3 grid-cols-1">
                          {!county_stats.loading && currentItems?.map(
                            (apps, index) => {
                              return (
                                <div
                                onClick={() =>
                                  handleModal(
                                    JSON.stringify(apps),
                                    true
                                  )
                                }
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
                                    {apps.is_available &&
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
                                    }
                                  
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className={`text-white min-h-[20px] min-w-[20px] px-3 py-2 rounded-lg  text-sm ${
              currentPage === index + 1 ? "bg-[#0e4741]" : "bg-[#009688]"
            }  hover:bg-[#45827c] my-1 mx-1`}
            key={index + 1}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
      </>
    }
  ]
  return (
    <Main>
    <div className="grid md:grid-cols-5">
      <div className=" text-white md:h-[100vh] md:block hidden">
          {/* Side menu county */}
          <SideMenu county_name={user_county} />
        </div>

        <div class="col-span-4 px-2 overflow-auto py-5">
        <select
              onChange={(e) => handleSelectFilter(e.target.value)}
              className="rounded text-sm border-2 border-blue-500 text-blue-800 mb-3"
            >
              <option value="null" selected>
                Filter
              </option>
              <option value="all" selected>
                All Agripreneurs
              </option>
              <option value="0">Pre Registered Agripreneurs</option>
              <option value="1">Self Registered Agripreneurs</option>
            </select>
            {app_county_stats.loading && (
              <>
                <Spinner className="mx-2" />
              </>
            )}
            {user_county === "admin" && (
              <div className="flex flex-wrap gap-1 self-end content-center justify-end">
                <span className="mx-2 text-sm text-gray-600">
                  Filter County
                </span>
                <select
                  onChange={(e) =>
                    dispatch(ToggleChangeCountyStats(e.target.value))
                  }
                  // onChange={(e) => handleSelectFilter(e.target.value)}
                  className="rounded text-sm border-2 border-green-500 text-green-800 mb-3"
                >
                  {COUNTIES.map((county) => {
                    return (
                      <option
                        selected={
                          county_selected_stats == county ? true : false
                        }
                        className={`p-1 ${
                          county_selected_stats === county
                            ? "bg-green-400 "
                            : "bg-gray-300 "
                        } text-sm rounded-md`}
                      >
                        {county}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {app_county_stats.error && app_county_stats.data === null && (
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
                    {app_county_stats.error}
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

        <Tabs aria-label="Tabs with underline" variant="underline">
          {items.map((item=>{
            return(
              <Tabs.Item active title={item.title} key={item.id}>
                {item.content}
             
            </Tabs.Item> 
            )
          }))}
    
    
    </Tabs>
        </div>

      </div>
       

      {/* {JSON.stringify(subcounty)} */}
    
    </Main>
  );
}

export default PageWrapper;
