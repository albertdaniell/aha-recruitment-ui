"use client";
import {
  PreviewPassport,
  resetShortlistedData,
  searchShortlistedEnumerator,
  submitAvailability,
  submitAvailability_Update,
} from "@/app/app-redux/features/AppData/appSlice";
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
    router.replace("/confirm-availability");
  };

  const cancelRegistration = (e) => {
    // alert(e.target.value)

    router.push(`/confirm-availability`);
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
  let { shorlisted_enumerator_details, preview_passport_data } = appData;
  let { data: shorlisted_enumerator_details_data } =
    shorlisted_enumerator_details;

  let inputs_class = "px-3 py-2  my-2 mx-3 rounded border-1 border-gray-200";
  let inputs_class_muted =
    "px-3 py-2 text-gray-800 bg-white opacity-4  my-2 mx-3 rounded border-1 border-gray-200";

  let file_inputs_class = "px-3 py-1 bg-white my-2 mx-2 rounded overflow-auto";

  let label_class = "px-3 py-1  my-2 text-gray-700 font-medium";
  let input_div = "flex flex-col my-1";
  let radio_div = "flex flex-row gap-2 flex align-center my-1 px-3";

  const handleShowEmbedModal = (url, state) => {
    if (state) {
      SetShowModal3(true);
      set_show_embed_url(url);
    } else {
      SetShowModal3(false);
      set_show_embed_url(null);
    }
  };

  const handleIDCARDInputChange = (event) => {
    event.preventDefault();

    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      // Check file type
      if (!file.type.includes("jpeg") && !file.type.includes("png")) {
        SetShowModal(true);
        SetErrorMessage("Please select a JPEG or PNG file.");
        return;
      }

      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        // 2 MB in bytes
        SetShowModal(true);
        SetErrorMessage("File size exceeds the limit of 5 MB.");
        return;
      }

      // Check if the image's height and width are the same
      //   const img = new Image();
      const img = new window.Image(); // Use `window.Image` to ensure you're using the native Image constructor

      img.onload = function () {
        // if (img.width !== img.height) {
        //   SetShowModal(true);
        //   SetErrorMessage("Image height and width must be the same.");
        //   return;
        // }

        // If the dimensions are valid, proceed with further processing
        set_passport_iamge(file);

        let dataToPost = new FormData();
        dataToPost.append("photo", file);
        dispatch(PreviewPassport(dataToPost))
          .unwrap()
          .then((res) => {
            // console.log(res);
          })
          .catch((e) => {
            // console.log({ e });
          });

        set_image_name(file.name);
      };

      // Trigger the image load by setting the src
      img.src = URL.createObjectURL(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview URL

      console.log({ img });
    }
  };

  const ConfirmAvailabilityPreview = () => {
    if (is_available === null) {
      SetShowModal(true);
      SetErrorMessage("Kindly state if your are available or not.");
      return 0;
    }

    if (is_available) {
      if (!password_image) {
        SetShowModal(true);
        SetErrorMessage("Kindly attach a passport image.");
        return 0;
      }
    }

    if (is_available === false) {
      if (!reason && isEmptyString(reason)) {
        SetShowModal(true);
        SetErrorMessage("Kindly write a reason for your unavailability.");
        return 0;
      }
    }

    SetIsPreview(true);
  };

  const ConfirmAvailabilityPreview_Update = () => {
    if (is_available === null) {
      SetShowModal(true);
      SetErrorMessage("Kindly state if your are available or not.");
      return 0;
    }
    // alert(shorlisted_enumerator_details_data?.data?.availability_object
    //   ?.passport_photo_url)

    if (is_available) {
      if (
        !shorlisted_enumerator_details_data?.data?.availability_object
          ?.passport_photo_url &&
        !imagePreview
      ) {
        SetShowModal(true);
        SetErrorMessage("Kindly attach a passport image.");
        return 0;
      }
    }

    if (is_available === false) {
      if (!reason && isEmptyString(reason)) {
        SetShowModal(true);
        SetErrorMessage("Kindly write a reason for your unavailability.");
        return 0;
      }
    }

    SetIsPreview(true);
  };
  let sendConfirmation = () => {
    set_post_loading(true);
    let data = new FormData();

    // console.log(shorlisted_enumerator_details.data)
    data.append(
      "application",
      shorlisted_enumerator_details_data.data.application
    );
    data.append("is_available", is_available);

    if (is_available === true) {
      data.append("passport_photo", password_image);
    }
    if (is_available === false) {
      data.append("reason_for_not_available", reason);
    }

    dispatch(
      submitAvailability({
        dataPassed: data,
      })
    )
      .unwrap()
      .then((res) => {
        console.log(res);
        set_post_loading(false);

        if (res.status === 1) {
          SetShowModal2(true);
          SetSuccessMsg(res.message);
        } else {
          SetShowModal(true);
          SetSuccessMsg(res.message);
        }
      })
      .catch((err) => {
        set_post_loading(false);
        SetShowModal(true);
        SetSuccessMsg("Something went wrong posting your availability");
      });
  };

  let sendConfirmation_Update = () => {
    set_post_loading(true);
    let data = new FormData();

    // console.log(shorlisted_enumerator_details.data)
    data.append(
      "application",
      shorlisted_enumerator_details_data.data.application
    );
    data.append("is_available", is_available);

    if (password_image) {
      data.append("passport_photo", password_image);
    }
    if (is_available === false) {
      data.append("reason_for_not_available", reason);
    }

    dispatch(
      submitAvailability_Update({
        dataPassed: data,
        availability_object_id:
          shorlisted_enumerator_details_data?.data?.availability_object?.id,
      })
    )
      .unwrap()
      .then((res) => {
        console.log(res);
        set_post_loading(false);

        if (res.status === 1) {
          SetShowModal2(true);
          SetSuccessMsg(res.message);
        } else {
          SetShowModal(true);
          SetSuccessMsg(res.message);
        }
      })
      .catch((err) => {
        set_post_loading(false);
        SetShowModal(true);
        SetSuccessMsg("Something went wrong posting your availability");
      });
  };

  useEffect(() => {
    // get offline data
    // getOfflineData("@OFFLINE").then((res)=>{
    //     SET_OFFLINE(res)
    // })

    if (shorlisted_enumerator_details_data !== null) {
      set_show_form(true);
    } else {
      set_show_form(false);

      // router.replace("/confirm-availability");
      // let data = new FormData();
      // let csrf = getCookie("XSRF-TOKEN");
      // data.append("query", `${id_number}`);
      // dispatch(searchShortlistedEnumerator({ data, csrf }))
      //   .unwrap()
      //   .then((res) => {
      //     set_show_form(true);
      //   })
      //   .catch((e) => {
      //     console.log({ e });
      //   });
    }

    return () => {
      // dispatch(resetShortlistedData())
    };
  }, [id_number]);

  useEffect(() => {
    if (shorlisted_enumerator_details_data?.data) {
      set_is_available(
        shorlisted_enumerator_details_data?.data?.availability_object
          ?.is_available
      );
      set_reason(
        shorlisted_enumerator_details_data?.data?.availability_object
          ?.reason_for_not_available
      );
    }
  }, [shorlisted_enumerator_details.data]);
  return (
    <div>
      <Modal
        dismissible={false}
        show={openModal2}
        onClose={() => handleCloseSuccess()}
      >
        <Modal.Header>Success</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {SuccessMsg}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => handleCloseSuccess()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="4xl"
        dismissible={false}
        show={isPreview}
        onClose={() => {
          SetIsPreview(false);
        }}
        //   onClose={
        //     enumerator_apply_details.loading
        //       ? () => {}
        //       : () => SetIsPreview(false)
        //   }
      >
        <Modal.Header>Preview of your information</Modal.Header>
        <Modal.Body>
          <h2 className="mb-5 font-semibold text-green-600">
            This is the final step. Before submitting your availability, kindly
            confirm your information below. This is a one time process.
            {is_available ? (
              <>
                Make sure that all information given is correct including your
                passport image
              </>
            ) : (
              <>You have chose to opt out of the Agripreneur programme.</>
            )}
          </h2>
          <div>
            {/* <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
              <strong>Submitting as:</strong>{" "}
              {shorlisted_enumerator_details_data?.data?.agripreneur_name}
            </p> */}

            <p className="my-5">Availability</p>
            {is_available ? (
              <>
                <div className="flex flex-row gap-3">
                  <CheckBoxFill className="text-green-600"></CheckBoxFill> I{" "}
                  <p>
                    <span className="font-semibold">
                      {
                        shorlisted_enumerator_details_data?.data
                          ?.agripreneur_name
                      }
                    </span>
                    , confirm that i will be available to be part of the
                    Agripreneur programme.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row gap-3 my-5">
                  <StopFill className="text-red-400"></StopFill> I{" "}
                  <p>
                    <span className="font-semibold">
                      {
                        shorlisted_enumerator_details_data?.data
                          ?.agripreneur_name
                      }
                    </span>
                    , confirm that i will NOT be available to be part of the
                    Agripreneur programme.{" "}
                    {reason && (
                      <p>
                        Reason: <span className="text-slate-600">{reason}</span>
                      </p>
                    )}
                  </p>
                </div>

                {/* <p className="mt-5 mb-3">Reason for unavailability</p>
                
                <p className="text-slate-700 bg-slate-50 p-2 rounded-md text-sm mb-5">
                  {reason}
                </p> */}
              </>
            )}

            {imagePreview && is_available && (
              <>
                <p className="my-5">Passport image</p>
                <Image
                  height={150}
                  width={150}
                  className="my-5 rounded-md"
                  src={imagePreview}
                  alt="Image Preview"
                  //   style={{ width: 100, height: 100 }}
                />
              </>
            )}

            {!imagePreview && (
              <>
                {shorlisted_enumerator_details_data?.data?.availability_object
                  ?.passport_photo_url ? (
                  <>
                    <img
                      src={
                        shorlisted_enumerator_details_data?.data
                          ?.availability_object?.passport_photo_url
                      }
                      height={150}
                      width={150}
                      className="mt-3"
                    ></img>
                  </>
                ) : (
                  <>
                    <p className="my-3">No image uploaded</p>
                  </>
                )}
              </>
            )}
            <div className={input_div}>
              <div className="flex flex-row   gap-3 mb-5">
                {/* {JSON.stringify(concent_accurate_information)} */}
                <input
                  onChange={() =>
                    handkeConcentInforAccurate(
                      concent_accurate_information === null
                        ? true
                        : !concent_accurate_information
                    )
                  }
                  className="mt-1"
                  type="checkbox"
                  id="concent2"
                  name="concent2"
                  value="concent2"
                  checked={concent_accurate_information ? true : false}
                ></input>
                <div className="">
                  <label for="concent2">
                    I hereby declare that the information provided by me is true
                    and accurate to the best of my knowledge and belief.
                  </label>
                </div>
              </div>
            </div>
            {/* sendConfirmation */}

            {concent_accurate_information && (
              <div>
                {post_loading ? (
                  <>
                    <Spinner></Spinner>
                    <p className="text-slate-700 text-md">
                      Sending your response, please wait...
                    </p>
                  </>
                ) : (
                  <button
                    //   onClick={() => SetIsPreview(true)}
                    onClick={
                      shorlisted_enumerator_details_data?.data?.has_availability
                        ? () => sendConfirmation_Update()
                        : () => sendConfirmation()
                    }
                    className="bg-green-600 text-white px-5 py-2 rounded-md"
                  >
                    Submit
                  </button>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

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
              Are you sure you want to go back to the previous page? This will
              reset all the information you filled in.
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

      <Modal
        size="7xl"
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

      {shorlisted_enumerator_details.loading &&
        shorlisted_enumerator_details === null && (
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

      {shorlisted_enumerator_details_data !== null && show_form ? (
        <>
          {/* <p>details found</p> */}

          {/* {JSON.stringify(shorlisted_enumerator_details_data.data.application)} */}
          {shorlisted_enumerator_details_data?.data?.has_availability && (
            <div className="bg-blue-200 p-3 text-blue-900 mt-3 rounded-sm">
              <h4>You are updating your availability</h4>
            </div>
          )}

          <div className="p-3 bg-slate-50 my-5 lg:mx-14 mx-2 rounded-sm border-t-4 border-t-green-500">
            <h1 className="text-md m-3 font-medium">Bio information</h1>
            <hr></hr>

            <p className="text-sm mx-3 my-5 text-slate-700">
              Date you sent your application as an agripreneur:{" "}
              {FormatDate(shorlisted_enumerator_details_data?.data?.created_at)}
            </p>
            {/* email */}
            {shorlisted_enumerator_details_data?.data?.email && (
              <p className="text-sm mx-3 my-5 text-slate-700">
                Your email address
                {shorlisted_enumerator_details_data?.data?.email}
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
                      shorlisted_enumerator_details_data?.data?.agripreneur_name
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
                      shorlisted_enumerator_details_data?.data?.phone_number
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
                      shorlisted_enumerator_details_data?.data?.id_number
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
                      shorlisted_enumerator_details_data?.data?.county
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
                      shorlisted_enumerator_details_data?.data?.subcounty
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
                      shorlisted_enumerator_details_data?.data?.ward
                    }
                  />
                </div>
              </div>
            </div>

            <h1 className="text-md m-3 font-medium">Confirm availability</h1>
            <hr></hr>

            <div className="my-1">
              <div className={input_div}>
                <label className={label_class}>
                  Are you still available to participate in the Agripreneur
                  programme?
                  {/* <span className="italic">
                    <span className="text-green-700">
                    (agronomy, horticulture, livestock production/health, range
                    management, agricultural economics, agribusiness management,
                    agricultural engineering)
                    </span>
                  </span> */}
                </label>
                {/* <input className={inputs_class} type="radio"></input> */}
                {/* {JSON.stringify(is_available)} */}
                {/* {is_available ? "true":"false"} */}
                <div className={radio_div}>
                  <input
                    onChange={(e) => handleisAvailable(true)}
                    checked={is_available === true}
                    type="radio"
                    id="is_available_YES"
                    name="is_available"
                    value={true}
                    className="my-1"
                  />
                  <label for="is_available_YES">Yes I am</label>
                </div>

                <div className={radio_div}>
                  <input
                    onChange={(e) => handleisAvailable(false)}
                    checked={is_available === false}
                    type="radio"
                    id="is_available_NO"
                    name="is_available"
                    className="my-1"
                    value={false}
                  />
                  <label for="is_available_NO">No I am not</label>
                </div>

                {/* {JSON.stringify(is_available)} */}

                {is_available && (
                  <>
                    <div className={input_div}>
                      <label className={label_class}>
                        Attach passport photo (JPEG/ PNG) 5MB Maximum Size.
                        <br></br>
                        <span className="text-slate-500 text-sm">
                          The photograph should be in colour and the size of 2
                          inch x 2 inch (51 mm x 51 mm). The photo-print should
                          be clear and with continuous-tone quality. It should
                          have full face, front view, eyes open. Photo should
                          present full head from top of hair to bottom of chin.
                          Kindly make sure the photo you upload is a true
                          representation of yourself, capturing your head and
                          shoulders and with a clear background. Selfies are not
                          allowed.
                        </span>
                      </label>

                      <div className="mx-3 my-3">
                        <span>Example is below</span>

                        <Image
                          src={"/passport.png"}
                          height={100}
                          width={100}
                          className="mt-3"
                        ></Image>
                      </div>

                      {shorlisted_enumerator_details_data?.data
                        ?.has_availability && (
                        <div className="mx-3">
                          <p className="text-slate-700 text-sm">
                            {" "}
                            Previous passport image
                          </p>
                          {shorlisted_enumerator_details_data?.data
                            ?.availability_object?.passport_photo_url ? (
                            <>
                              <img
                                src={
                                  shorlisted_enumerator_details_data?.data
                                    ?.availability_object?.passport_photo_url
                                }
                                height={150}
                                width={150}
                                className="mt-3"
                              ></img>
                            </>
                          ) : (
                            <>
                              <p className="my-3">No image uploaded</p>
                            </>
                          )}
                          {/* {shorlisted_enumerator_details_data?.data?.availability_object?.passport_photo_url} */}
                        </div>
                      )}

                      <input
                        accept=".jpg,.jpeg,.png"
                        className={file_inputs_class}
                        onChange={handleIDCARDInputChange}
                        type="file"
                      ></input>

                      {/* {JSON.stringify(imagePreview)} */}

                      {imagePreview && (
                        <Image
                          height={200}
                          width={200}
                          className="my-5 mx-2"
                          src={imagePreview}
                          alt="Image Preview"
                          style={{ width: 200, height: 200 }}
                        />
                      )}

                      {/* <p className="p-3 text-sm">
                        {preview_passport_data.loading
                          ? "Uploading  to server..."
                          : null}
                        File:{" "}
                        {preview_passport_data.data !== null ? (
                          <>
                            <button
                              className="text-blue-500  px-1 py-2"
                         
                              onClick={() =>
                                handleShowEmbedModal(
                                  preview_passport_data.data.photo_url,
                                  true
                                )
                              }
                            >
                              View full preview here
                            </button>
                          </>
                        ) : (
                          "No preview"
                        )}
                      </p> */}
                    </div>
                  </>
                )}

                {is_available === false && (
                  <div className={input_div}>
                    <label className={label_class}>
                      What is your reason for your unavailability?
                    </label>

                    <textarea
                      rows={3}
                      onChange={(e) => set_reason(e.target.value)}
                      type="text"
                      placeholder=""
                      className={inputs_class}
                      defaultValue={reason}
                      // value={shorlisted_enumerator_details_data?.data
                      //   ?.availability_object?.reason_for_not_available}
                    ></textarea>

                    <p className="text-sm text-gray-500 px-3">
                      {" "}
                      {reason && `${countWords(reason)} words`}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex grid-cols-2 gap-5 my-5 mx-2">
              <div>
                {/* camce; */}
                <button
                  onClick={cancelConfirmation}
                  className="bg-red-300  hover:bg-red-500 px-5 py-2 rounded-md text-white"
                >
                  Back to the previous page
                </button>
              </div>
              <div>
                {shorlisted_enumerator_details_data?.data?.has_availability ? (
                  <>
                    <button
                      //   onClick={() => SetIsPreview(true)}
                      onClick={() => ConfirmAvailabilityPreview_Update()}
                      className="bg-blue-600 text-white px-5 py-2 rounded-md"
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      //   onClick={() => SetIsPreview(true)}
                      onClick={() => ConfirmAvailabilityPreview()}
                      className="bg-green-600 text-white px-5 py-2 rounded-md"
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>This page is only accessible for authenticated agripreneurs</p>

          <button
            onClick={cancelConfirmation}
            className="bg-red-400  hover:bg-red-500 px-5 py-2 rounded-md text-white my-5"
          >
            Back to the previous page
          </button>
        </>
      )}
    </div>
  );
}

export default Form;
