"use client";
import { searchEnumeratorQR_Code } from "@/app/app-redux/features/AppData/appSlice";
import {
  countWords,
  FormatDate,
  getCookie,
  isEmptyString,
} from "@/app/constants/utils";
import { CheckBoxFill, StopFill, ThumbsUp } from "akar-icons";
import { Button, Modal, Spinner } from "flowbite-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Form() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const appData = useSelector((state) => state.appData);
  const [is_available, set_is_available] = useState(null);
  const [ErrorMessage, SetErrorMessage] = useState(null);
  const [id_card_name, set_image_name] = useState("");
  const [openModal, SetShowModal] = useState(false);
  const [openModal3, SetShowModal3] = useState(false);
  const [embed_url, set_show_embed_url] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [openCancelModal, SetShowCancelModal] = useState(false);
  const [isPreview, SetIsPreview] = useState(null);
  const [reason, set_reason] = useState("");
  const [password_image, set_passport_iamge] = useState(null);
  const [openModal2, SetShowModal2] = useState(false);
  const [SuccessMsg, SetSuccessMsg] = useState(null);

  const [post_loading, set_post_loading] = useState(null);
  const [concent_accurate_information, set_concent_accurate_information] =
    useState(false);

  const handleCloseSuccess = () => {
    SetShowModal2(false);
    router.replace("/");
  };

  const cancelRegistration = (e) => {
    // alert(e.target.value)

    router.push(`/`);
  };

  const cancelConfirmation = (e) => {
    // alert(e.target.value)
    // setErrorMsg("Are you sure you want to cancel this registration?")
    SetShowCancelModal(true);
  };

  const handleisAvailable = (e) => {
    // alert(e.target.value)
    set_is_available(e);
  };

  const handkeConcentInforAccurate = (e) => {
    // alert(e.target.value)
    set_concent_accurate_information(e);
  };

  const id_number = searchParams.get("id_number");
  const [error_msg, set_error_msg] = useState(null);
  const [show_form, set_show_form] = useState(null);
  let { shorlisted_enumerator_qr_code_details } = appData;
  let { data: shorlisted_enumerator_qr_code_details_data } =
    shorlisted_enumerator_qr_code_details;

  let inputs_class = "px-3 py-2  my-2 mx-3 rounded border-1 border-gray-200";
  let inputs_class_muted =
    "px-3 py-2 text-gray-800 bg-white opacity-4  my-2 mx-3 rounded border-1 border-gray-200";

  let file_inputs_class = "px-3 py-1 bg-white my-2 mx-2 rounded overflow-auto";

  let label_class = "px-3 py-1  my-2 text-gray-700 font-medium";
  let input_div = "flex flex-col my-1";
  let radio_div = "flex flex-row gap-2 flex align-center my-1 px-3";

  useEffect(() => {
    // get offline data
    // getOfflineData("@OFFLINE").then((res)=>{
    //     SET_OFFLINE(res)
    // })

    dispatch(searchEnumeratorQR_Code({ id_number: id_number }))
      .then((res) => {
        set_show_form(true);
      })
      .catch((err) => {
        set_show_form(false);

        alert("Error!");
      });

    // if (shorlisted_enumerator_qr_code_details_data !== null) {
    //   set_show_form(true);
    // } else {
    //   set_show_form(false);
    // }

    // return () => {
    //   // dispatch(resetShortlistedData())
    // };
  }, [id_number]);

  return (
    <div>
      <Modal
        size="3xl"
        dismissible={true}
        show={openCancelModal}
        onClose={() => SetShowCancelModal(false)}
      >
        <Modal.Header>Cancel</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to go back to the previous page?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => SetShowCancelModal(false)}>
            No, stay on this page
          </Button>
          <Button color="red" onClick={() => cancelRegistration(false)}>
            Yes, go back
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="md"
        dismissible={false}
        show={openModal}
        onClose={() => SetShowModal(false)}
      >
        <Modal.Header>Message</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {ErrorMessage}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => SetShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {shorlisted_enumerator_qr_code_details.loading &&
        shorlisted_enumerator_qr_code_details === null && (
          <div className="my-3">
            <Spinner />
            <p>Please wait.</p>
            {/* {JSON.stringify(enumerator_details_data)} */}
          </div>
        )}
      {error_msg !== null && (
        <>
          <div className="bg-orange-100  text-sm my-3 md:mx-10 mx-2 p-5 border-l-4 border-l-orange-600">
            <p className="text-orange-800">{error_msg}</p>
          </div>

          <Link className="text-blue-500 my-5" href="/">
            Back to main page
          </Link>
        </>
      )}

      {shorlisted_enumerator_qr_code_details_data ? (
        <>
          {/* <p>details found</p> */}

          {/* {JSON.stringify(shorlisted_enumerator_qr_code_details_data.data.application)} */}
          {shorlisted_enumerator_qr_code_details_data?.data
            ?.has_availability && (
            <div className="bg-blue-200 p-3 text-blue-900 mt-3 rounded-sm">
              <h4>You are updating your availability</h4>
            </div>
          )}

          <div className="p-3 bg-slate-50 my-5 lg:mx-14 mx-2 rounded-sm border-t-4 border-t-green-500">
            <h1 className="text-md m-3 font-medium">Bio information</h1>
            <hr></hr>

            {/* availability_object  {JSON.stringify(shorlisted_enumerator_qr_code_details?.data?.data
                                    ?.availability_object?.passport_photo_url)} */}

            {shorlisted_enumerator_qr_code_details?.data?.data
              ?.availability_object?.passport_photo_url && (
              <div className="mx-3">
                <p className="text-slate-700 text-sm"> Passport image</p>

                {shorlisted_enumerator_qr_code_details?.data?.data
                  ?.availability_object?.passport_photo_url ? (
                  <>
                    <img
                      src={
                        shorlisted_enumerator_qr_code_details?.data?.data
                          ?.availability_object?.passport_photo_url
                      }
                      height={150}
                      width={150}
                      className="mt-3"
                    ></img>
                  </>
                ) : (
                  <>{/* <p className="my-3">No image uploaded</p> */}</>
                )}
                {/* {shorlisted_enumerator_qr_code_details?.data?.availability_object?.passport_photo_url} */}
              </div>
            )}

            {/* email */}
            {shorlisted_enumerator_qr_code_details_data?.data?.email && (
              <p className="text-sm mx-3 my-5 text-slate-700">
                Email address: {" "}
                {shorlisted_enumerator_qr_code_details_data?.data?.email}
              </p>
            )}

            <div className="my-1">
              <div className="grid lg:grid-cols-3  grid-cols-1 gap-2">
                <div className={input_div}>
                  <label className={label_class}>Name</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={
                      shorlisted_enumerator_qr_code_details_data?.data
                        ?.agripreneur_name
                    }
                  />
                </div>
                <div className={input_div}>
                  <label className={label_class}>Phone</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={
                      shorlisted_enumerator_qr_code_details_data?.data
                        ?.system_phone
                    }
                  />
                </div>

                <div className={input_div}>
                  <label className={label_class}>ID number</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={
                      shorlisted_enumerator_qr_code_details_data?.data
                        ?.id_number
                    }
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-3  grid-cols-1 gap-2">
                <div className={input_div}>
                  <label className={label_class}>County</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={
                      shorlisted_enumerator_qr_code_details_data?.data?.system_county
                    }
                  />
                </div>
                <div className={input_div}>
                  <label className={label_class}>Sub county</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={
                      shorlisted_enumerator_qr_code_details_data?.data
                        ?.system_subcounty
                    }
                  />
                </div>

                <div className={input_div}>
                  <label className={label_class}>Ward</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={
                      shorlisted_enumerator_qr_code_details_data?.data?.system_ward
                    }
                  />
                </div>
              </div>
            </div>

           
            <hr></hr>

           
          </div>
        </>
      ) : (
        <>
        {shorlisted_enumerator_qr_code_details.loading &&
        <>
            <p>Loading AGP details...</p>
        </>
        }
          {/* <p>This page is only accessible for authenticated agripreneurs</p> */}

          {/* <button
            onClick={cancelConfirmation}
            className="bg-red-400  hover:bg-red-500 px-5 py-2 rounded-md text-white my-5"
          >
            Back to the previous page
          </button> */}
        </>
      )}
    </div>
  );
}

export default Form;
