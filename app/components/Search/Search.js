"use client";
import {
  getUtils,
  resetShortlistedData,
  searchEnumerator,
} from "@/app/app-redux/features/AppData/appSlice";
import { StoreofflineLocalStorage } from "@/app/constants/OfflineStorage";
import { getCookie, isEmptyString } from "@/app/constants/utils";
import { Button, Modal, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logos from "./Logos";
import RegisterForm from "./RegisterForm";
import { ChatBubble, ChatError, Info, Paper, Pencil, Person } from "akar-icons";
import Link from "next/link";
let data = new FormData();
function Search() {
  const dispatch = useDispatch();
  const appData = useSelector((state) => state.appData);
  const { enumerator_details } = appData;

  const router = useRouter();
  // let showForm = true;
  const [id_number_search, set_id_number_search] = useState(undefined);
  const [error_msg, set_error_msg] = useState(null);
  const [not_found, set_not_found] = useState(null);
  const [show_register, set_show_register] = useState(null);
  const [showForm, set_showForm] = useState(false);
  let [showSuccessModal, SetShowSuccessModal] = useState(false);
  const [user, set_user] = useState(null);
  const [show_update_application, set_show_update_application] = useState(null);
  const [show_update_details, set_sshow_update_details] = useState(null);

  // set_show_update_application

  const { app_utils } = appData;

  const handleIDNumberChange = (e) => {
    let { value } = e.target;
    set_id_number_search(value);
  };

  const handleSearch = (e) => {
    set_sshow_update_details(false);
    set_show_update_application(false);

    dispatch(resetShortlistedData());
    set_not_found(false);
    // dispatch to get user
    set_error_msg(null);
    e.preventDefault();
    if (id_number_search === undefined || isEmptyString(id_number_search)) {
      set_error_msg("Kindly fill in the information above");

      return 0;
    }
    let data = new FormData();
    let csrf = getCookie("XSRF-TOKEN");
    data.append("username", `${id_number_search}`);
    data.append("password", "dan@1995");

    dispatch(searchEnumerator({ data, csrf }))
      .unwrap()
      .then((res) => {
        // console.log(res)
        
        set_user(res.user);
        if (res.user.has_application) {
          if (res?.user?.has_account) {
            set_show_update_application(false);
            set_sshow_update_details(true);
  
            set_error_msg(res.user.has_application_msg);
            return 0;
          }
          
          set_show_update_application(true);

          set_error_msg(res.user.has_application_msg);
          return 0;

        }
       
        // clear id_number_search

        SetShowSuccessModal(true);

        // router.push(`/apply?id_number=${id_number_search}`);
      })
      .catch((e) => {
        // alert("eagripreneur not found");
        // console.log({ e });

        

        if (e.hasOwnProperty("non_field_errors")) {
          set_not_found(true);

          set_error_msg("Agripreneur with the provided details not found");
        } else {
          if(e?.not_found){
            set_not_found(true);
          }
          if (e?.message) {
            set_error_msg(e?.message);
            return 0;
          }
          set_error_msg("Something went wrong, try again later.");
        }

        // console.log("Error!");
      });
  };

  let TITLE_PAGE = [
    "Agripreneur Expression of Interest Form",
    "Weka nambari yako ya kitambulisho",
  ];

  let TITLE_ENTER_NAT_ID = [
    "Enter Your National Identification Number or Phone Number",
    "Weka nambari yako ya kitambulisho",
  ];

  let PHONE_FORMAT_INSTR = ["Format for phone number is 0711000000", "-"];
  let SUBMIT_BTN_TEXT = ["Submit", "Submit"];

  useEffect(() => {
    dispatch(getUtils());
  }, []);

  useEffect(() => {
    if (app_utils?.data) {
      if (app_utils.data.counties?.length != 0) {
        set_showForm(true);
        // console.log(app_utils)
      } else {
        // console.log(app_utils)
      }
    }
  }, [app_utils]);

  const proceedToApply = () => {
    SetShowSuccessModal(false);
    router.push(`/apply?id_number=${id_number_search}`);

    setTimeout(() => {
      set_id_number_search("");
    }, 1000);

    setTimeout(() => {
      set_id_number_search(null);
    }, 1500);
  };

  return (
    <>
      <Modal
        show={showSuccessModal}
        onClose={() => SetShowSuccessModal(false)}
        size="xl"
      >
        <Modal.Header>Message</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Greetings {user?.name}, welcome to the Agripreneur Expression of
              Interest Form.
              <br></br>
              <br></br>
              <p>
                While making an application kindly remember to attach
                Agriculture related certificate as it is an added advantage.
                Click the button below to redirect to the application form
              </p>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {showSuccessModal ? (
            <div className="flex flex-wrap gap-3  w-full justify-between">
            <Button color="blue" onClick={proceedToApply} className="gap-3">
              <Pencil className="mr-2" /> Proceed to apply
            </Button>

            <Button color="green" 
            onClick={() => set_show_register(true)}
            // onClick={proceedToApply}
             className="gap-3">
              <Person className="mr-2" /> Edit details
            </Button>
            
            </div>
          ) : (
            <Button
              color="gray"
              onClick={() => SetShowSuccessModal(false)}
              className="gap-3"
            >
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        size="5xl"
        dismissible={false}
        show={show_register}
        onClose={() => set_show_register(false)}
      >
        <Modal.Header>
          <span className="lg:text-md flex gap-2 flex-wrap">
            <Paper /> Register As An Agripreneur
          </span>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm editObject={enumerator_details?.data?.user} user_id_number={id_number_search} />
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => set_show_register(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <form onSubmit={handleSearch}>
        <div className="inset-0 blur-box4 z-0"></div>

        <div className="w-100 min-h-[100vh] flex flex-col items-center  lg:p-0 overflow-auto  z-10 relative">
          <div className=" border-2 lg:border-gray-50 border-gray-50 shadow-sm self-center w-[100%] lg:h-[100vh] lg:rounded-lg md:overflow-auto">
            <div className="flex justify-between md:hidden p-3">
              <img src="/emblem.png" className="w-[50px] h-[50px] my-5"></img>

              <img src="/cog.png" className="w-[50px] h-[50px] my-5"></img>
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 overflow-auto">
              <div className="md:h-[100vh] md:col-span-0 md:p-0  h-[0vh]  col-span-1 bg-white bg-[url('/ai_image2.png')] bg-no-repeat bg-cover md:bg-top bg-left-top md:block hidden">
                <div className="h-[100%] w-[100%] bg-[#0a855a13]"></div>
              </div>

              <div className="lg:h-[100vh] md:col-span-0 md:p-0  h-[26vh]  col-span-1 bg-white bg-[url('/ai_image4.jpeg')] bg-no-repeat bg-cover md:bg-top bg-left-top md:hidden block overflow-auto">
                <div className="h-[100%] w-[100%] bg-[#0a855a14]"></div>
              </div>

              <div className="md:col-span-2 flex flex-col lg:p-10 md:p-10 p-3 overflow-visible b justify-between">
                <div className="md:flex hidden   justify-between">
                  <img src="/emblem.png" className="w-[100px] h-[100px]"></img>

                  <img src="/cog.png" className="w-[100px] h-[100px]"></img>
                </div>
                <div>
                  <h1 className="lg:text-3xl md:text-2xl text-2xl  text-[#057a55] font-semibold text-left mb-3">
                    {TITLE_PAGE[0]}
                  </h1>
                  <hr></hr>
                  <h2 className="xl:text-sm md:text-sm text-sm md:mb-0  mb-8 mt-4">
                    The Government of Kenya, with the support of the World Bank
                    through the NAVCDP and FSRP projects, is rolling out a
                    business acceleration model in 46 counties. This program
                    will equip individuals, especially youth, with correct
                    skills to become agricultural entrepreneurs or
                    "agripreneurs."These agripreneurs will serve as catalysts
                    for change, bringing innovative technologies, resources, and
                    market connections to farmers. Agripreneurs will operate as
                    independent businesses, providing services and products to
                    farmers for a fee or other forms of remuneration, making the
                    model sustainable and scalable. Recognizing the value of
                    experience, the government is prioritizing youth who
                    participated in last year's national farmer registration
                    exercise.
                  </h2>
                </div>
                {/* {JSON.stringify(app_utils.data)} */}
                {showForm ? (
                  <>
                    <div className="my-6 flex flex-col">
                      <h2 className="lg:text-md md:text-md text-sm my-3 text-gray-600">
                        {TITLE_ENTER_NAT_ID[0]}
                      </h2>
                      {/* <p className="text-sm my-3 italic text-gray-500">
                {PHONE_FORMAT_INSTR[0]}
              </p> */}
                      {/* <h2 className="text-2xl my-5 text-gray-600">Weka nambari yako ya kitambulisho</h2> */}
                      <input
                        disabled={enumerator_details.loading}
                        defaultValue={id_number_search}
                        onChange={(e) => handleIDNumberChange(e)}
                        className="p-4 bg-gray-100 my-2 rounded-xl"
                        placeholder="12345678 or 0711000000"
                      ></input>

                      {error_msg !== null && (
                        <div className="bg-orange-100 my-0 text-xs p-2 border-l-4 border-l-orange-600">
                          <div className="flex gap-3">
                            <div className="p-1">
                              <p className="text-orange-800 my-1 text-sm flex flex-col gap-1">
                                <Info />
                              </p>
                            </div>
                            <div className="p-1">
                              <p className="text-orange-800 my-1 text-sm flex flex-col gap-1">
                                <span>{error_msg}</span>
                              </p>
                              {show_update_application && (
                                <div className="flex flex-row gap-2">
                                  <button
                                    onClick={() => {
                                      router.push(
                                        `/apply?id_number=${id_number_search}`
                                      );
                                    }}
                                    type="button"
                                    className="text-purple-700 my-1 py-2 border-2 border-purple-400 rounded-md px-3"
                                  >
                                    Click here to update application
                                  </button>

                                   <button
                                    onClick={() => set_show_register(true)}
                                    type="button"
                                    className="text-purple-700 my-1 py-2 border-2 border-purple-400 rounded-md px-3"
                                  >
                                    Click here to update details
                                  </button>
                                </div>
                              )}

                              {show_update_details && (
                                <>
                                  <button
                                    // onClick={() => {
                                    //   router.push(`/apply?id_number=${id_number_search}`);
                                    // }}
                                    onClick={() => set_show_register(true)}
                                    type="button"
                                    className="text-purple-700 my-1 py-2 border-2 border-purple-400 rounded-md px-3"
                                  >
                                    Click here to update your details
                                  </button>
                                </>
                              )}

                              {not_found && (
                                <>
                                  <button
                                    onClick={() => set_show_register(true)}
                                    type="button"
                                    className="text-purple-700 my-1 py-2 border-2 border-purple-400 rounded-md px-3"
                                  >
                                    Click here to register
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {/* {id_number_search} */}

                      <div className="flex flex-row justify-between flex-wrap">
                        <div className=" w-[50%]">
                          {" "}
                          {enumerator_details.loading ? (
                            <div className="my-3">
                              <Spinner />
                              <p className="text-sm my-2 text-orange-500">
                                Searching for your details, Please wait.
                              </p>
                            </div>
                          ) : (
                            <button
                              // onClick={handleSearch}
                              type="submit"
                              className="my-2  bg-[#53a840] px-10 py-3 text-white rounded-md shadow-lg hover:bg-[#448b34]"
                            >
                              {SUBMIT_BTN_TEXT[0]}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* <>
            <div className="w-10 h-1 p-1 rounded-2xl bg-slate-300 self-center"></div>
          </> */}
                    </div>
                  </>
                ) : (
                  <>
                    {app_utils.loading ? (
                      <>
                        <Spinner />
                      </>
                    ) : (
                      <div className="bg-orange-100 my-0 text-xs p-2 border-l-4 border-l-orange-600">
                        <div className="flex gap-3">
                          <div className="p-1">
                            <p className="text-orange-800 my-1 text-sm flex flex-col gap-1">
                              <Info />
                            </p>
                          </div>
                          <div className="p-1">
                            <p className="text-orange-800 my-1 text-sm flex flex-col gap-1">
                              <span>
                                Greetings, applications to this portal are
                                closed for now.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="bg-blue-100 my-0 text-xs p-2 border-l-4 border-l-blue-600">
                  <div className="flex gap-3 md:flex-grow">
                    <div className="p-1">
                      <p className="text-blue-800 my-1 text-sm flex flex-col gap-1">
                        <Info />
                      </p>
                    </div>
                    <div className="p-1">
                      <div className="text-blue-800 my-1 text-sm flex flex-col gap-1">
                        <span className="text-md font-semibold">
                          Public Notice
                        </span>{" "}
                        <p className="text-sm">
                          The application period for Cohort 2 Agripreneurs will
                          be extended and conducted on a county-by-county basis.
                          {/* This information will be communicated through all
                          public channels */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between flex-wrap mt-5">
                  <div className="">
                    <Link
                      href={"/feedback"}
                      className="text-orange-500 text-sm flex flex-row gap-1"
                    >
                      <ChatBubble /> Help center
                    </Link>
                  </div>

                  <div className="">
                    <Link
                      href={"/confirm-availability"}
                      className="my-2  text-sm  p-3 text-white bg-blue-500  rounded-md  hover:bg-blue-600 hover:text-white"
                    >
                      Confirm Availability
                    </Link>
                  </div>
                </div>

                <div>
                  <Logos />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Search;
