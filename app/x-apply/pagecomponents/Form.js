"use client";
import {
  PreviewCV,
  PreviewIdCard,
  PreviewPostEductation,
  PreviewPwdCert,
  applyEnumerator,
  searchEnumerator,
  updateApplication,
} from "@/app/app-redux/features/AppData/appSlice";
import {
  getOfflineData,
  removeValueFromOffline,
} from "@/app/constants/OfflineStorage";
import { Button, Modal, Spinner } from "flowbite-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Suspense } from "react";
import { getCookie, isEmail, isEmptyString } from "@/app/constants/utils";
import Link from "next/link";
import { countWords } from "@/app/constants/utils";
import { File } from "akar-icons";
function Form() {
  // android_model = models.TextField(null=True,blank=True)
  // android_specifications = models.TextField(null=True,blank=True)
  // have_boda = models.BooleanField(default=False)
  // current_hustle = models.TextField(null=True,blank=True)
  // earnings_per_month = models.IntegerField(null=True,blank=True,default=0)
  // concent_this_is_not_a_job = models.CharField(default=1,max_length=length,null=True,blank=True)
  // concent_accurate_information = models.CharField(default=1,max_length=length,null=True,blank=True)
  // experience_crops_livestock = models.BooleanField(default=False)
  // experience_crops_livestock_description = models.TextField(null=True,blank=True)
  // aspiration_as_an_agriculture_entrepreneur = models.TextField(null=True,blank=True)
  let [applicationObject, setapplicationObject] = useState(null);
  const [has_post_cert, set_has_post_cert] = useState(null);
  const [is_more_than_35, set_is_more_than_35] = useState(null);
  const [ward_resident, set_ward_resident] = useState(null);
  const [digitally_literate, set_digitally_literate] = useState(null);
  const [good_communication, set_good_communication] = useState(null);
  const [experience_agric, set_experience_agric] = useState(null);
  const [engaged_fulltime, set_engaged_fulltime] = useState(null);
  const [gender, set_gender] = useState(null);
  const [is_pwd, set_is_pwd] = useState(null);
  const [OFFLINE, SET_OFFLINE] = useState(null);
  const [years_of_experience, set_years_of_experience] = useState(null);
  const [email, set_email] = useState(null);
  const [showResponses, SetShowResponses] = useState(null);

  const [
    experience_crops_livestock_description,
    set_experience_crops_livestock_description,
  ] = useState(null);
  const [have_boda, set_have_boda] = useState(null);
  const [experience_crops_livestock, set_experience_crops_livestock] =
    useState(null);
  const [android_model, set_android_model] = useState(null);
  const [android_specifications, set_android_specifications] = useState(null);
  const [current_hustle, set_current_hustle] = useState(null);
  const [earnings_per_month, set_earnings_per_month] = useState(null);

  const [concent_this_is_not_a_job, set_concent_this_is_not_a_job] =
    useState(false);
  const [concent_data_collected, set_concent_data_collected] = useState(true);
  const [concent_accurate_information, set_concent_accurate_information] =
    useState(false);
  const [
    aspiration_as_an_agriculture_entrepreneur,
    set_aspiration_as_an_agriculture_entrepreneur,
  ] = useState(null);

  const [SecondaryCert, setSecondaryCert] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [SecondaryCertfileName, setSecondaryCertFileName] = useState("");

  const [openModal, SetShowModal] = useState(false);
  const [openModal2, SetShowModal2] = useState(false);
  const [openModal3, SetShowModal3] = useState(false);
  const [embed_url, set_show_embed_url] = useState(false);

  const [openCancelModal, SetShowCancelModal] = useState(false);

  const [ErrorMessage, SetErrorMessage] = useState(null);
  const [SuccessMsg, SetSuccessMsg] = useState(null);

  const [id_card, set_id_card] = useState(null);
  const [id_card_name, set_id_card_name] = useState("");

  const [cv, set_cv] = useState(null);
  const [cv_name, set_cv_name] = useState("");

  const [pwd_cert, set_pwd_cert] = useState(null);
  const [pwd_cert_name, set_pwd_cert_name] = useState("");

  const appData = useSelector((state) => state.appData);

  const [isPreview, SetIsPreview] = useState(null);
  const [error_msg, set_error_msg] = useState(null);
  const [show_form, set_show_form] = useState(null);

  let {
    enumerator_details,
    enumerator_apply_details,
    preview_cv_data,
    preview_post_educ_data,
    preview_id_data,
    preview_pwd_data,
  } = appData;
  let { data: enumerator_details_data } = enumerator_details;

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id_number = searchParams.get("id_number");
  const handleShowEmbedModal = (url, state) => {
    if (state) {
      SetShowModal3(true);
      set_show_embed_url(url);
    } else {
      SetShowModal3(false);
      set_show_embed_url(null);
    }
  };
  const handleCloseSuccess = () => {
    SetShowModal2(false);
    router.replace("/");
  };

  const handkeConcentInforAccurate = (e) => {
    // alert(e.target.value)
    set_concent_accurate_information(e);
  };
  const handleConcentIsNotJob = (e) => {
    // alert(e.target.value)
    set_concent_this_is_not_a_job(e);
  };

  const handleConcentDataProtection = (e) => {
    // alert(e.target.value)
    set_concent_data_collected(e);
  };

  const handleChangeYearsOfExperience = (e) => {
    // alert(e.target.value)
    set_years_of_experience(e.target.value);
  };

  const handleEmailChange = (e) => {
    // alert(e.target.value)
    set_email(e.target.value);
  };

  const handleHasPostCert = (e) => {
    // alert(e.target.value)
    set_has_post_cert(e);
  };

  const handleIsMoreThan35 = (e) => {
    // alert(e.target.value)
    set_is_more_than_35(e);
  };

  const handleIsWardResident = (e) => {
    // alert(e.target.value)
    set_ward_resident(e);
  };

  const handleHasHustle = (e) => {
    // alert(e.target.value)
    set_current_hustle(e);
  };

  const handleIsDigitallyLiterate = (e) => {
    // alert(e.target.value)
    set_digitally_literate(e);
  };

  const handlePWD = (e) => {
    // alert(e.target.value)
    set_is_pwd(e);
  };

  const handleGoodCommunication = (e) => {
    // alert(e.target.value)
    set_good_communication(e);
  };
  const handleExperienceAgric = (e) => {
    // alert(e.target.value)
    set_experience_agric(e);
  };

  const handleSetFullTime = (e) => {
    // alert(e.target.value)
    set_engaged_fulltime(e);
  };

  const handleSetgender = (e) => {
    // alert(e.target.value)
    set_gender(e);
  };

  const cancelRegistration = (e) => {
    // alert(e.target.value)

    router.push(`/`);
  };

  const cancelRegistrationConfirmation = (e) => {
    // alert(e.target.value)
    // setErrorMsg("Are you sure you want to cancel this registration?")
    SetShowCancelModal(true);
  };

  const ApplyEnumerarator = () => {
    let data = new FormData();
    // console.log({concent_accurate_information})
    // console.log({concent_this_is_not_a_job})

    if (!concent_accurate_information) {
      SetErrorMessage("Consent box 1 is not checked!");
      SetShowModal(true);

      return 0;
    }
    if (!concent_this_is_not_a_job) {
      SetErrorMessage("Consent box 2 is not checked!");
      SetShowModal(true);

      return 0;
    }

    if (typeof cv !== "string") {
      data.append("cv", cv);
    } else {
    }

    data.append("formal_informal_employment", current_hustle);
    if (current_hustle === true) {
      data.append("earnings_per_month", earnings_per_month);
    }

    console.log(typeof pwd_cert);

    if (has_post_cert === true) {
      if (typeof SecondaryCert !== "string") {
        data.append("post_secondary_certificate", SecondaryCert);
      } else {
        console.log("sec cert is string");
      }
    }
    if (is_more_than_35 === true) {
      if (typeof id_card !== "string" && id_card) {
        data.append("id_card", id_card);
      } else {
      }
      // data.append("id_card", id_card);
    }
    data.append("id_number", enumerator_details_data.user.id_number);

    data.append(
      "have_post_secondary_certificate",
      has_post_cert === null ? false : has_post_cert
    );
    data.append(
      "experience_in_agric_dev",
      experience_agric === null ? true : experience_agric
    );

    data.append(
      "experience_crops_livestock",
      experience_agric === null ? true : experience_agric
    );

    if (experience_agric === true) {
      //   data.append("experience_in_agric_dev_years", years_of_experience);
    }

    if (is_pwd === true) {
      if (typeof pwd_cert !== "string") {
        data.append("pwd_cert", pwd_cert);
      } else {
        console.log("pwd_cert  is string");
      }
    }

    data.append("full_time", engaged_fulltime ? 1 : 0);
    data.append(
      "resident_of_ward",
      ward_resident === null ? false : ward_resident
    );
    data.append(
      "digitally_literate",
      digitally_literate === null ? false : digitally_literate
    );
    data.append(
      "between_18_and_35_age",
      is_more_than_35 === null ? false : is_more_than_35
    );
    data.append("have_boda", have_boda === null ? false : have_boda);
    data.append("pwd", is_pwd === null ? false : is_pwd);
    data.append(
      "good_communication_skills",
      good_communication === null ? false : good_communication
    );

    data.append(
      "concent_accurate_information",
      concent_accurate_information === true ? 1 : 0
    );

    data.append(
      "concent_this_is_not_a_job",
      concent_this_is_not_a_job === true ? 1 : 0
    );

    data.append("gender", gender);
    data.append("email", email);
    if (experience_agric === true) {
      data.append(
        "experience_crops_livestock_description",
        experience_crops_livestock_description
      );
    }

    if (digitally_literate) {
      data.append("android_model", android_model);
    }

    data.append(
      "aspiration_as_an_agriculture_entrepreneur",
      aspiration_as_an_agriculture_entrepreneur
    );

    SetErrorMessage("Submitting your form. Please do not close this window");
    SetShowModal(true);

    if (applicationObject) {
      // update

      dispatch(
        updateApplication({
          id: applicationObject.id,
          dataPassed: data,
          Token: enumerator_details_data.user.token,
        })
      )
        .unwrap()
        .then((res) => {
          if (res.status === 1) {
            SetShowModal2(true);
            SetSuccessMsg(res?.message);
          } else {
            SetShowModal2(true);
            SetSuccessMsg(res?.message);
          }
        })
        .catch((e) => {
          // console.log({e})
          SetShowModal(true);

          if (e?.message) {
            SetErrorMessage(e.message);
            return 0;
          }

          if (Array.isArray(e)) {
            SetErrorMessage("Make sure you have filled in all fields");
          } else {
            // console.log(e)
            // Error: ${JSON.stringify(e)}
            SetErrorMessage(
              `Something went wrong,try again another time. If you are using your mobile phone, make sure you have stable internet connection. You can try the same using a laptop or access a cyber cafe.`
            );
          }

          // console.log({ e });
        });
      return 0;
    }

    dispatch(
      applyEnumerator({
        dataPassed: data,
        Token: enumerator_details_data.user.token,
      })
    )
      .unwrap()
      .then((res) => {
        if (res.status === 1) {
          SetShowModal2(true);
          SetSuccessMsg(
            "Your application has been sent successfully! Similar details have been sent to your email"
          );
        } else {
          SetShowModal2(true);
          SetSuccessMsg(res.message);
        }
      })
      .catch((e) => {
        // console.log({e})
        SetShowModal(true);
        if (e?.message) {
          SetErrorMessage(e.message);
          return 0;
        }

        if (Array.isArray(e)) {
          SetErrorMessage("Make sure you have filled in all fields");
        } else {
          // Error: ${JSON.stringify(e)}
          SetErrorMessage(
            `Something went wrong, try again another time. If you are using your mobile phone, make sure you have stable internet connection. You can try the same using a laptop or access a cyber cafe.`
          );
        }

        // console.log({ e });
      });
  };

  const ApplyEnumeraratorPreview = () => {
    // SetShowModal(false)

    // console.log({ experience_agric });
    if (email === null || !isEmail(email) || isEmptyString(email)) {
      SetErrorMessage("Email cannot be empty or invalid!");
      SetShowModal(true);

      return 0;
    }
    if (cv === null) {
      SetErrorMessage("CV not attached!");
      SetShowModal(true);

      return 0;
    }

    if (has_post_cert === null) {
      SetShowModal(true);

      SetErrorMessage("Post Secondary certificate has to be selected!");

      return 0;
    }

    if (has_post_cert && SecondaryCert === null) {
      SetShowModal(true);
      SetErrorMessage("Post Secondary certificate has to be included!");
      return 0;
    }

    if (is_more_than_35 === null) {
      SetShowModal(true);

      SetErrorMessage(
        "Question : Are you between the age of 18 and 35 years is empty"
      );
      return 0;
    }

    if (!applicationObject) {
      if (is_more_than_35 && id_card === null) {
        SetShowModal(true);
        SetErrorMessage(
          "ID card has to be included if your are 35 years and above!"
        );

        return 0;
      }
    }

    if (ward_resident === null) {
      SetErrorMessage(`
       Question:  Are you a resident of ${
         enumerator_details_data !== null
           ? `${enumerator_details_data.user.ward} ward in ${enumerator_details_data.user.county} county`
           : "---"
       }
        is empty`);
      SetShowModal(true);

      return 0;
    }

    if (digitally_literate === null) {
      SetShowModal(true);

      SetErrorMessage(
        "Question: Are you digitally literate and in possession of a smartphone cannot be empty"
      );

      return 0;
    }

    if (digitally_literate && android_model == null) {
      SetShowModal(true);

      SetErrorMessage("Kindly enter the make of your android smartphone");

      return 0;
    }

    // console.log({android_model})
    if (digitally_literate && isEmptyString(android_model)) {
      SetShowModal(true);

      SetErrorMessage("Kindly enter the make of your android smartphone");

      return 0;
    }

    if (is_pwd === null) {
      SetErrorMessage("Question: PWD cannot be empty!");

      SetShowModal(true);

      return 0;
    }

    if (is_pwd && pwd_cert === null) {
      SetShowModal(true);

      SetErrorMessage("Kindly attach certificate for Person With Disability");

      return 0;
    }

    if (good_communication === null) {
      SetErrorMessage("Question: Good communication skills cannot be empty!");

      SetShowModal(true);

      return 0;
    }

    if (experience_agric === null) {
      SetShowModal(true);

      SetErrorMessage(
        "Question: Do you have experience in the field of agricultural development cannot be empty"
      );

      return 0;
    }

    if (experience_agric && experience_crops_livestock_description === null) {
      SetShowModal(true);
      // console.log({experience_crops_livestock_description})
      SetErrorMessage("Write your experience in crops and livestock");
      return 0;
    }

    if (
      experience_agric &&
      isEmptyString(experience_crops_livestock_description)
    ) {
      SetShowModal(true);
      // console.log({experience_crops_livestock_description})
      SetErrorMessage("Write your experience in crops and livestock");
      return 0;
    }

    // if (years_of_experience > 20) {
    //   SetShowModal(true);

    //   SetErrorMessage("Years of experience cannot be more than 20");

    //   return 0;
    // }

    if (engaged_fulltime === null) {
      SetErrorMessage(
        "Question: Are you commitment to be engaged on a full-time basis cannot be empty!"
      );

      SetShowModal(true);

      return 0;
    }
    if (gender === null) {
      SetErrorMessage("Gender cannot  be empty!");

      SetShowModal(true);

      return 0;
    }
    if (current_hustle === null) {
      SetErrorMessage(
        "Question: Are you currently engaged in formal or informal employment cannot be empty!"
      );

      SetShowModal(true);

      return 0;
    }

    if (current_hustle && earnings_per_month === null) {
      SetErrorMessage("Question: Earnings from employment cannot be empty!");

      SetShowModal(true);

      return 0;
    }

    if (current_hustle && isEmptyString(earnings_per_month)) {
      SetErrorMessage("Question: Earnings from employment cannot be empty!");

      SetShowModal(true);

      return 0;
    }

    if (have_boda === null) {
      SetErrorMessage("Question: have motorcycle cannot be empty!");

      SetShowModal(true);

      return 0;
    }

    if (isEmptyString(aspiration_as_an_agriculture_entrepreneur)) {
      SetShowModal(true);
      // console.log({experience_crops_livestock_description})
      SetErrorMessage("Write your aspiration as an agriculture entrepreneur");
      return 0;
    }

    // if(!)

    if (concent_data_collected === null || concent_data_collected === false) {
      SetErrorMessage("Consent box is not checked");
      SetShowModal(true);

      return 0;
    }

    //  Are you a resident of{" "}
    //  {enumerator_details_data !== null
    //    ? `${enumerator_details_data.user.ward} ward in ${enumerator_details_data.user.county} county`
    //    : "---"}
    //  ?

    SetIsPreview(true);
    // console.log({ enumerator_details_data });
  };

  const handleInputChange = (event) => {
    // console.log(event.target.files);
    event.preventDefault();

    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      // Check file type
      if (!file.type.includes("pdf")) {
        SetShowModal(true);

        SetErrorMessage("Please select a PDF file.");
        return;
      }
      // Check file size
      if (file.size > 3 * 1024 * 1024) {
        // 2 MB in bytes
        SetShowModal(true);

        SetErrorMessage("File size exceeds the limit of 3 MB.");
        return;
      }
      // File is valid, you can handle it further
    }

    // setSecondaryCert(URL.createObjectURL(event.target.files[0]));
    setSecondaryCert(file);

    let dataToPost = new FormData();
    dataToPost.append("post_secondary_certificate", file);
    dispatch(PreviewPostEductation(dataToPost))
      .unwrap()
      .then((res) => {
        // console.log(res);
      })
      .catch((e) => {
        // console.log({ e });
      });

    setSecondaryCertFileName(file.name);
    // setErrorMsg("");
  };

  const handleIDCARDInputChange = (event) => {
    // console.log(event.target.files);
    event.preventDefault();

    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      // Check file type
      if (
        !file.type.includes("pdf") &&
        !file.type.includes("jpeg") &&
        !file.type.includes("png")
      ) {
        SetShowModal(true);

        SetErrorMessage("Please select a PDF, jpeg/png file.");
        return;
      }
      // Check file size
      if (file.size > 2 * 1024 * 1024) {
        // 2 MB in bytes
        SetShowModal(true);

        SetErrorMessage("File size exceeds the limit of 2 MB.");
        return;
      }
      // File is valid, you can handle it further
    }

    // setSecondaryCert(URL.createObjectURL(event.target.files[0]));
    set_id_card(file);

    let dataToPost = new FormData();
    dataToPost.append("id_card", file);
    dispatch(PreviewIdCard(dataToPost))
      .unwrap()
      .then((res) => {
        // console.log(res);
      })
      .catch((e) => {
        // console.log({ e });
      });

    set_id_card_name(file.name);
    // setErrorMsg("");
  };

  const HandleCVChange = (event) => {
    // console.log(event.target.files);
    event.preventDefault();

    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      // Check file type
      if (!file.type.includes("pdf")) {
        SetShowModal(true);

        SetErrorMessage("Please select a PDF file.");
        return;
      }
      // Check file size
      if (file.size > 2 * 1024 * 1024) {
        // 2 MB in bytes
        SetShowModal(true);

        SetErrorMessage("File size exceeds the limit of 2 MB.");
        return;
      }
      // File is valid, you can handle it further
    }

    // setSecondaryCert(URL.createObjectURL(event.target.files[0]));
    set_cv(file);
    // console.log("dispatching")
    let dataToPost = new FormData();
    dataToPost.append("cv_file", file);
    dispatch(PreviewCV(dataToPost))
      .unwrap()
      .then((res) => {
        // console.log(res);
      })
      .catch((e) => {
        // console.log({ e });
      });

    set_cv_name(file.name);
    // setErrorMsg("");
  };

  const handlePWD_Cert_InputChange = (event) => {
    // console.log(event.target.files);
    event.preventDefault();

    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      // Check file type
      if (!file.type.includes("pdf")) {
        SetShowModal(true);

        SetErrorMessage("Please select a PDF file.");
        return;
      }
      // Check file size
      if (file.size > 2 * 1024 * 1024) {
        // 2 MB in bytes
        SetShowModal(true);

        SetErrorMessage("File size exceeds the limit of 2 MB.");
        return;
      }
      // File is valid, you can handle it further
    }

    // setSecondaryCert(URL.createObjectURL(event.target.files[0]));
    set_pwd_cert(file);
    let dataToPost = new FormData();
    dataToPost.append("pwd_cert", file);
    dispatch(PreviewPwdCert(dataToPost))
      .unwrap()
      .then((res) => {
        // console.log(res);
      })
      .catch((e) => {
        // console.log({ e });
      });

    set_pwd_cert_name(file.name);
    // setErrorMsg("");
  };

  useEffect(() => {
    // get offline data
    // getOfflineData("@OFFLINE").then((res)=>{
    //     SET_OFFLINE(res)
    // })

    if (enumerator_details_data !== null) {
      set_show_form(true);
    }

    let data = new FormData();
    let csrf = getCookie("XSRF-TOKEN");
    data.append("username", `${id_number}`);
    data.append("password", "dan@1995");
    dispatch(searchEnumerator({ data, csrf }))
      .unwrap()
      .then((res) => {
        if (res.user.has_application) {
          set_error_msg(res.user.has_application_msg);
          setapplicationObject(res?.user?.application_object);
          // updateFormData(res?.user?.
          //   application_object
          //   )
          set_show_form(true);
          return 0;
        }
        set_show_form(true);
        // alert("User has been found")
      })
      .catch((e) => {
        if (e?.message) {
          set_error_msg(e?.message);
          return 0;
        }
        // console.log({ e });
      });
  }, [id_number]);

  useEffect(() => {
    if (applicationObject) {
      updateFormData();
    }
  }, [applicationObject]);

  let updateFormData = () => {
    // console.log({applicationObject})

    set_email(applicationObject.email);
    set_has_post_cert(applicationObject.have_post_secondary_certificate);
    set_ward_resident(applicationObject.resident_of_ward);
    set_is_more_than_35(applicationObject.between_18_and_35_age);
    set_digitally_literate(applicationObject.digitally_literate);
    set_good_communication(applicationObject.good_communication_skills);
    set_experience_agric(applicationObject.experience_in_agric_dev);
    set_engaged_fulltime(applicationObject.full_time === "1" ? true : false);
    if (applicationObject.gender === "1") {
      set_gender(1);
    }
    if (applicationObject.gender === "2") {
      set_gender(2);
    }
    if (applicationObject.gender === "3") {
      set_gender(3);
    }
    // set_gender(applicationObject.gender === "1" ? true : false);
    set_is_pwd(applicationObject.pwd);
    set_experience_crops_livestock_description(
      applicationObject.experience_crops_livestock_description
    );
    set_have_boda(applicationObject.have_boda);
    set_android_model(applicationObject.android_model);
    set_android_specifications(applicationObject.android_specifications);
    set_current_hustle(applicationObject.earnings_per_month ? true : false);
    set_earnings_per_month(applicationObject.earnings_per_month);
    set_concent_this_is_not_a_job(
      applicationObject.concent_this_is_not_a_job === "1" ? true : false
    );
    // set_concent_data_collected(
    //   applicationObject.concent_data_collected === "1" ? true : false
    // );

    set_concent_accurate_information(
      applicationObject.concent_accurate_information
    );
    set_aspiration_as_an_agriculture_entrepreneur(
      applicationObject.aspiration_as_an_agriculture_entrepreneur
    );

    setSecondaryCert(applicationObject.post_secondary_certificate);
    set_pwd_cert(applicationObject.pwd_cert);
    set_cv(applicationObject.cv);
  };

  let inputs_class = "px-3 py-2  my-2 mx-3 rounded border-1 border-gray-200";
  let inputs_class_muted =
    "px-3 py-2 text-gray-800 bg-white opacity-4  my-2 mx-3 rounded border-1 border-gray-200";

  let file_inputs_class = "px-3 py-1 bg-white my-2 mx-2 rounded overflow-auto";

  let label_class = "px-3 py-1  my-2 text-gray-700 font-medium";
  let input_div = "flex flex-col my-1";
  let radio_div = "flex flex-row gap-2 flex align-center my-1 px-3";

  return (
    <Suspense>
      {enumerator_details.loading && enumerator_details_data === null && (
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
            {applicationObject?.extra_message && (
              <>
                <p className="text-orange-800">
                  {applicationObject?.extra_message}
                </p>
                {applicationObject?.update_count && <>
                  <p className="text-green-500 mt-4 font-medium">
                    You have {3- applicationObject?.update_count}  chance(s) to change your application details
                </p>
                </>}
              </>
            )}
          </div>

          {/* {JSON.stringify(applicationObject)} */}

          <Link className="text-blue-500 my-5 px-10" href="/">
            Back to main page
          </Link>
        </>
      )}
      {enumerator_details_data !== null && show_form ? (
        <>
          <div className="p-3 bg-slate-50 my-5 lg:mx-14 mx-2 rounded-sm border-t-4 border-t-green-500">
            <h1 className="text-md m-3 font-medium">Bio information</h1>
            <hr></hr>
            {/* {JSON.stringify(enumerator_details_data.user.name)} */}

            <div className="my-1">
              <div className="grid lg:grid-cols-3  grid-cols-1 gap-2">
                <div className={input_div}>
                  <label className={label_class}>Name</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={enumerator_details_data.user.name}
                  />
                </div>
                <div className={input_div}>
                  <label className={label_class}>Phone</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={enumerator_details_data.user.mobile_number}
                  />
                </div>

                <div className={input_div}>
                  <label className={label_class}>ID number</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={enumerator_details_data.user.id_number}
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
                    defaultValue={enumerator_details_data.user.county}
                  />
                </div>
                <div className={input_div}>
                  <label className={label_class}>Sub county</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={enumerator_details_data.user.subcounty}
                  />
                </div>

                <div className={input_div}>
                  <label className={label_class}>Ward</label>
                  <input
                    type="text"
                    className={inputs_class_muted}
                    disabled
                    defaultValue={enumerator_details_data.user.ward}
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-2  grid-cols-1 gap-2"></div>
            </div>

            <h1 className="text-md m-3 font-medium my-5">
              Fill in the form below
            </h1>
            <hr></hr>

            <div className={input_div}>
              <label className={label_class}>Your email address</label>
              <p className="text-xs text-gray-600 px-3">
                Enter an accurate address
              </p>
              <input
                value={email}
                onChange={(e) => handleEmailChange(e)}
                type="email"
                placeholder="agripreneur@mail.com"
                className={inputs_class}
              />
            </div>

            {applicationObject?.cv_url && (
              <>
                <button
                  className="text-blue-500 px-3  flex flex-wrap gap-1 mt-5 text-sm"
                  // href={preview_cv_data.data.cv_file_url}
                  // target="_blank"
                  onClick={() =>
                    handleShowEmbedModal(applicationObject.cv_url, true)
                  }
                >
                  <File /> View previous cv file here
                </button>
              </>
            )}

            <div className={input_div}>
              <label className={label_class}>
                Attach your cv (Only PDF) 2MB Maximum Size
              </label>

              <input
                accept=".pdf"
                className={file_inputs_class}
                onChange={HandleCVChange}
                type="file"
              ></input>

              <p className="p-3 text-sm">
                {preview_cv_data.loading ? "Uploading CV to server..." : null}
                CV file:{" "}
                {preview_cv_data.data !== null ? (
                  <button
                    className="text-blue-500  px-1 py-2"
                    // href={preview_cv_data.data.cv_file_url}
                    // target="_blank"
                    onClick={() =>
                      handleShowEmbedModal(
                        preview_cv_data.data.cv_file_url,
                        true
                      )
                    }
                  >
                    View preview here
                  </button>
                ) : (
                  "No preview"
                )}
              </p>
            </div>

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

            <Modal
              size="3xl"
              dismissible={true}
              show={openCancelModal}
              onClose={() => SetShowCancelModal(false)}
            >
              <Modal.Header>Cancel Application</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Are you sure you want to cancel this application? This will
                    reset all the information you filled in.
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button color="gray" onClick={() => SetShowCancelModal(false)}>
                  No, Stay on this page
                </Button>
                <Button color="red" onClick={() => cancelRegistration(false)}>
                  Yes, Cancel application
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
              size="7xl"
              dismissible={false}
              show={isPreview}
              onClose={
                enumerator_apply_details.loading
                  ? () => {}
                  : () => SetIsPreview(false)
              }
            >
              <Modal.Header>Preview of your information</Modal.Header>
              <Modal.Body>
                <h2 className="mb-5 font-semibold text-green-600">
                  This is the final step. Before submitting your application,
                  kindly confirm your information below. Make sure that all
                  information given is correct including your email address{" "}
                  <span className="text-gray-600">{email}</span> that will be
                  used for communication.
                </h2>

                <button
                  onClick={() => SetShowResponses(!showResponses)}
                  className="text-white bg-blue-500 px-2 py-1 text-sm my-3 rounded-sm"
                >
                  {showResponses
                    ? "Hide my responses"
                    : "Click here to show my responses"}
                </button>
                {showResponses && (
                  <>
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Submitting as:</strong>{" "}
                        {enumerator_details_data.user.name}
                      </p>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Contact Email:</strong> {email}
                      </p>
                      {applicationObject?.cv_url && (
                        <>
                          <button
                            className="text-blue-500  flex flex-wrap gap-1 mt-5 pt-2 text-sm"
                            // href={preview_cv_data.data.cv_file_url}
                            // target="_blank"
                            onClick={() =>
                              handleShowEmbedModal(
                                applicationObject.cv_url,
                                true
                              )
                            }
                          >
                            <File /> View previous cv file here
                          </button>
                        </>
                      )}
                      <p className="px-3 text-sm">
                        CV file:{" "}
                        {preview_cv_data.data !== null ? (
                          <button
                            className="text-blue-500"
                            // href={preview_cv_data.data.cv_file_url}
                            // target="_blank"
                            onClick={() =>
                              handleShowEmbedModal(
                                preview_cv_data.data.cv_file_url,
                                true
                              )
                            }
                          >
                            View preview here
                          </button>
                        ) : (
                          "No preview"
                        )}
                      </p>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400 pt-3">
                        <strong>Have a postgraduate certificate:</strong>{" "}
                        {has_post_cert ? "Yes" : "No"}
                      </p>
                      {applicationObject?.post_secondary_certificate_url && (
                        <>
                          <button
                            className="text-blue-500   flex flex-wrap gap-1 mt-5 text-sm"
                            // href={preview_cv_data.data.cv_file_url}
                            // target="_blank"
                            onClick={() =>
                              handleShowEmbedModal(
                                applicationObject.post_secondary_certificate_url,
                                true
                              )
                            }
                          >
                            <File /> View previous post secondary certificate
                          </button>
                        </>
                      )}
                      {has_post_cert && (
                        <p className="px-3 text-sm">
                          File:{" "}
                          {preview_post_educ_data.data !== null ? (
                            <button
                              className="text-blue-500"
                              // href={preview_cv_data.data.cv_file_url}
                              // target="_blank"
                              onClick={() =>
                                handleShowEmbedModal(
                                  preview_post_educ_data.data
                                    .post_secondary_certificate_url,
                                  true
                                )
                              }
                            >
                              View preview here
                            </button>
                          ) : (
                            "No preview"
                          )}
                        </p>
                      )}
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400 pt-2">
                        <strong>Age between 18 and 35 years:</strong>{" "}
                        {is_more_than_35 ? "Yes" : "No"}
                      </p>
                      {applicationObject?.id_card_url && (
                        <>
                          <button
                            className="text-blue-500   flex flex-wrap gap-1 mt-5 text-sm"
                            // href={preview_cv_data.data.cv_file_url}
                            // target="_blank"
                            onClick={() =>
                              handleShowEmbedModal(
                                applicationObject.id_card_url,
                                true
                              )
                            }
                          >
                            <File /> View previous ID card
                          </button>
                        </>
                      )}
                      {is_more_than_35 && (
                        <p className="px-3 text-sm">
                          File:{" "}
                          {preview_id_data.data !== null ? (
                            <button
                              className="text-blue-500"
                              // href={preview_cv_data.data.cv_file_url}
                              // target="_blank"
                              onClick={() =>
                                handleShowEmbedModal(
                                  preview_id_data.data.id_card_url,
                                  true
                                )
                              }
                            >
                              View preview here
                            </button>
                          ) : (
                            "No preview"
                          )}
                        </p>
                      )}
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>
                          {" "}
                          Resident of{" "}
                          {enumerator_details_data !== null
                            ? `${enumerator_details_data.user.ward} ward in ${enumerator_details_data.user.county} county`
                            : "---"}
                          :{" "}
                        </strong>
                        {ward_resident ? "Yes" : "No"}
                      </p>

                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Is digitally literate:</strong>{" "}
                        {digitally_literate ? "Yes" : "No"}
                      </p>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Is PWD:</strong> {is_pwd ? "Yes" : "No"}
                      </p>
                      {applicationObject?.pwd_cert_url && (
                        <>
                          <button
                            className="text-blue-500  flex flex-wrap gap-1 mt-5 text-sm"
                            // href={preview_cv_data.data.cv_file_url}
                            // target="_blank"
                            onClick={() =>
                              handleShowEmbedModal(
                                applicationObject.pwd_cert_url,
                                true
                              )
                            }
                          >
                            <File /> View previous PWD certificate
                          </button>
                        </>
                      )}

                      {is_pwd && (
                        <p className="px-3 text-sm">
                          File:{" "}
                          {preview_pwd_data.data !== null ? (
                            <button
                              className="text-blue-500"
                              // href={preview_cv_data.data.cv_file_url}
                              // target="_blank"
                              onClick={() =>
                                handleShowEmbedModal(
                                  preview_pwd_data.data.pwd_cert_url,
                                  true
                                )
                              }
                            >
                              View preview here
                            </button>
                          ) : (
                            "No preview"
                          )}{" "}
                        </p>
                      )}

                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Android smartphone: </strong>
                        {android_model}
                      </p>

                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Have good communication skills:</strong>{" "}
                        {good_communication ? "Yes" : "No"}
                      </p>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>
                          Have experience in the field of agriculture:
                        </strong>{" "}
                        {experience_agric ? "Yes" : "No"}
                      </p>

                      {experience_crops_livestock_description && (
                        <p className="mb-5 bg-slate-100 p-3 text-justify">
                          {experience_crops_livestock_description}
                        </p>
                      )}

                      <hr></hr>

                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Committed to full time engagement:</strong>{" "}
                        {engaged_fulltime ? "Yes" : "No"}
                      </p>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Gender:</strong>{" "}
                        {gender === 1
                          ? "Male"
                          : gender === 2
                          ? "Female"
                          : "Other"}
                      </p>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Have formal employment:</strong>{" "}
                        {current_hustle ? "Yes" : "No"}
                      </p>
                      {earnings_per_month && (
                        <p className="italic mb-5 bg-slate-100 p-3">
                          Earnings: {earnings_per_month}
                        </p>
                      )}
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                        <strong>Have motorcycle:</strong>{" "}
                        {have_boda ? "Yes" : "No"}
                      </p>

                      <p className="mb-5">
                        <strong>
                          Aspiration as an agricultural entrepreneur
                        </strong>
                      </p>
                      <p className="text-justify mb-5 bg-slate-100 p-3">
                        {aspiration_as_an_agriculture_entrepreneur}
                      </p>

                      <div className="my-5"></div>
                    </div>
                  </>
                )}
              </Modal.Body>

              {enumerator_apply_details.loading ? (
                <div className="p-5 text-orange-500">
                  <Spinner />
                  <p className="my-2">
                    Submitting your information. Please wait...
                  </p>
                </div>
              ) : (
                <>
                  {showResponses && (
                    <>
                      <Modal.Footer>
                        <div>
                          <div className="flex flex-col gap-3">
                            <div className={input_div}>
                              <div className="flex flex-wrap gap-3 items-center text-sm">
                                {/* {JSON.stringify(concent_accurate_information)} */}
                                <input
                                  onChange={() =>
                                    handkeConcentInforAccurate(
                                      concent_accurate_information === null
                                        ? true
                                        : !concent_accurate_information
                                    )
                                  }
                                  className="col-span-1"
                                  type="checkbox"
                                  id="concent2"
                                  name="concent2"
                                  value="concent2"
                                  checked={
                                    concent_accurate_information ? true : false
                                  }
                                ></input>
                                <div className="col-span-11">
                                  <label for="concent2">
                                    I hereby declare that the information
                                    provided by me in this application is true
                                    and accurate to the best of my knowledge and
                                    belief.
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className={input_div}>
                              <div className="flex  gap-3 items-center text-sm">
                                <input
                                  onChange={() =>
                                    handleConcentIsNotJob(
                                      concent_this_is_not_a_job === null
                                        ? true
                                        : !concent_this_is_not_a_job
                                    )
                                  }
                                  className="col-span-1"
                                  type="checkbox"
                                  id="concent3"
                                  name="concent3"
                                  value="concent3"
                                  checked={
                                    concent_this_is_not_a_job ? true : false
                                  }
                                ></input>
                                <div className="col-span-11">
                                  <label for="concent3">
                                    I understand that this is not an employment
                                    application. It is a chance to acquire
                                    entrepreneurial skills and build access to
                                    critical agricultural services, inputs and
                                    markets for the farmers I will be serving
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <Button
                              disabled={enumerator_apply_details.loading}
                              color="gray"
                              onClick={() => SetIsPreview(false)}
                            >
                              Back
                            </Button>

                            <button
                              disabled={enumerator_apply_details.loading}
                              onClick={() => ApplyEnumerarator(true)}
                              //   onClick={() => ApplyEnumeraratorPreview()}

                              className="bg-blue-600 text-white px-5 py-2 rounded-md"
                            >
                              Submit Application
                            </button>
                          </div>
                        </div>
                      </Modal.Footer>
                    </>
                  )}
                </>
              )}
            </Modal>
            {/* {JSON.stringify(OFFLINE)} */}
            {/* <hr></hr> */}
            <div>
              <div className={input_div}>
                <label className={label_class}>
                  Do you have a post-secondary certificate in agriculture
                  <span className="italic">
                    {" "}
                    <span className="text-green-700">
                      (agronomy, horticulture, livestock production/health,
                      range management, agricultural economics, agribusiness
                      management, agricultural engineering)
                    </span>
                  </span>
                </label>
                {/* <input className={inputs_class} type="radio"></input> */}
                {/* {JSON.stringify(has_post_cert)} */}
                {/* {has_post_cert ? "true":"false"} */}
                <div className={radio_div}>
                  <input
                    onChange={(e) => handleHasPostCert(true)}
                    checked={has_post_cert === true}
                    type="radio"
                    id="has_post_cert_YES"
                    name="has_post_cert"
                    value={true}
                    className="my-1"
                  />
                  <label for="has_post_cert_YES">Yes i do have</label>
                </div>

                <div className={radio_div}>
                  <input
                    onChange={(e) => handleHasPostCert(false)}
                    checked={has_post_cert === false}
                    type="radio"
                    id="has_post_cert_NO"
                    name="has_post_cert"
                    className="my-1"
                    value={false}
                  />
                  <label for="has_post_cert_NO">No i do not</label>
                </div>
              </div>
              {/* SecondaryCert {JSON.stringify(SecondaryCert)} */}
              {applicationObject?.post_secondary_certificate_url && (
                <>
                  <button
                    className="text-blue-500 px-3  flex flex-wrap gap-1 mt-5 text-sm"
                    // href={preview_cv_data.data.cv_file_url}
                    // target="_blank"
                    onClick={() =>
                      handleShowEmbedModal(
                        applicationObject.post_secondary_certificate_url,
                        true
                      )
                    }
                  >
                    <File /> View previous post secondary certificate
                  </button>
                </>
              )}
              {has_post_cert && (
                <div className={input_div}>
                  <label className={label_class}>
                    if yes, Attach demonstrable documents{" "}
                    <span className="text-green-500">
                      (agronomy, horticulture, livestock production/health,
                      range management, agricultural economics, agribusiness
                      management, agricultural engineering)
                    </span>{" "}
                    (Only PDF) 3MB Maximum Size
                  </label>
                  <input
                    accept=".pdf"
                    className={file_inputs_class}
                    onChange={handleInputChange}
                    type="file"
                  ></input>

                  <p className="p-3 text-sm">
                    {preview_post_educ_data.loading
                      ? "Uploading  to server..."
                      : null}
                    File:{" "}
                    {preview_post_educ_data.data !== null ? (
                      <>
                        <button
                          className="text-blue-500  px-1 py-2"
                          // href={preview_cv_data.data.cv_file_url}
                          // target="_blank"
                          onClick={() =>
                            handleShowEmbedModal(
                              preview_post_educ_data.data
                                .post_secondary_certificate_url,
                              true
                            )
                          }
                        >
                          View preview here
                        </button>
                      </>
                    ) : (
                      "No preview"
                    )}
                  </p>
                </div>
              )}
              <div className={input_div}>
                <label className={label_class}>
                  Are you between the age of 18 and 35 years?
                </label>
                {/* <input className={inputs_class} type="radio"></input> */}
                {/* {JSON.stringify(has_post_cert)} */}
                {/* {has_post_cert ? "true":"false"} */}
                <div className={radio_div}>
                  <input
                    onChange={(e) => handleIsMoreThan35(true)}
                    checked={is_more_than_35 === true}
                    type="radio"
                    id="is_more_than_35_YES"
                    name="is_more_than_35"
                    value={true}
                    className="my-1"
                  />
                  <label for="is_more_than_35_YES">Yes i am</label>
                </div>

                <div className={radio_div}>
                  <input
                    onChange={(e) => handleIsMoreThan35(false)}
                    checked={is_more_than_35 === false}
                    type="radio"
                    id="is_more_than_35_NO"
                    name="is_more_than_35"
                    className="my-1"
                    value={false}
                  />
                  <label for="is_more_than_35_NO">No, i am a not</label>
                </div>
              </div>
              {applicationObject?.id_card_url && (
                <>
                  <button
                    className="text-blue-500 px-3  flex flex-wrap gap-1 mt-5 text-sm"
                    // href={preview_cv_data.data.cv_file_url}
                    // target="_blank"
                    onClick={() =>
                      handleShowEmbedModal(applicationObject.id_card_url, true)
                    }
                  >
                    <File /> View previous ID card
                  </button>
                </>
              )}
              {is_more_than_35 && (
                <div className={input_div}>
                  <label className={label_class}>
                    Attach Identification card (Only PDF or JPEG/PNG) 2MB
                    Maximum Size
                  </label>
                  <input
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={file_inputs_class}
                    onChange={handleIDCARDInputChange}
                    type="file"
                  ></input>

                  <p className="p-3 text-sm">
                    {preview_id_data.loading ? "Uploading  to server..." : null}
                    File:{" "}
                    {preview_id_data.data !== null ? (
                      <>
                        <button
                          className="text-blue-500  px-1 py-2"
                          // href={preview_cv_data.data.cv_file_url}
                          // target="_blank"
                          onClick={() =>
                            handleShowEmbedModal(
                              preview_id_data.data.id_card_url,
                              true
                            )
                          }
                        >
                          View preview here
                        </button>
                      </>
                    ) : (
                      "No preview"
                    )}
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-2  grid-cols-1 gap-2 lg:divide-x my-5">
                <div className={input_div}>
                  <label className={label_class}>
                    Are you a resident of{" "}
                    {enumerator_details_data !== null
                      ? `${enumerator_details_data.user.ward} ward in ${enumerator_details_data.user.county} county`
                      : "---"}
                    ?
                  </label>
                  {/* <input className={inputs_class} type="radio"></input> */}
                  {/* {JSON.stringify(has_post_cert)} */}
                  {/* {has_post_cert ? "true":"false"} */}
                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleIsWardResident(true)}
                      checked={ward_resident === true}
                      type="radio"
                      id="ward_resident_YES"
                      name="ward_resident"
                      value={true}
                      className="my-1"
                    />
                    <label for="ward_resident_YES">Yes i am</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleIsWardResident(false)}
                      checked={ward_resident === false}
                      type="radio"
                      id="ward_resident_NO"
                      name="ward_resident"
                      className="my-1"
                      value={false}
                    />
                    <label for="ward_resident_NO">No, i am not</label>
                  </div>
                </div>
                <div className={input_div}>
                  <label className={label_class}>
                    Are you digitally literate and in possession of a smartphone
                    ?
                  </label>
                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleIsDigitallyLiterate(true)}
                      checked={digitally_literate === true}
                      type="radio"
                      id="digitally_literate_YES"
                      name="digitally_literate"
                      value={true}
                      className="my-1"
                    />
                    <label for="digitally_literate_YES">Yes i am</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleIsDigitallyLiterate(false)}
                      checked={digitally_literate === false}
                      type="radio"
                      id="digitally_literate_NO"
                      name="digitally_literate"
                      className="my-1"
                      value={false}
                    />
                    <label for="digitally_literate_NO">No, i am not</label>
                  </div>
                </div>
              </div>
              {digitally_literate && (
                <div className={input_div}>
                  <label className={label_class}>
                    If yes, which make is the android smartphone?
                  </label>
                  <label className="px-3 text-sm text-gray-500">
                    You can also give specifications of the phone, example 4GB
                    RAM
                  </label>
                  <textarea
                    rows={3}
                    onChange={(e) => set_android_model(e.target.value)}
                    type="text"
                    placeholder="Example Samsung, 4GB RAM"
                    className={inputs_class}
                    defaultValue={android_model}
                  />
                </div>
              )}

              <div className={input_div}>
                <label className={label_class}>
                  Are you a person with disability (PWD)?
                </label>
                <div className={radio_div}>
                  <input
                    onChange={(e) => handlePWD(true)}
                    checked={is_pwd === true}
                    type="radio"
                    id="is_pwd_YES"
                    name="is_pwd"
                    value={true}
                    className="my-1"
                  />
                  <label for="is_pwd_YES">Yes i am</label>
                </div>

                <div className={radio_div}>
                  <input
                    onChange={(e) => handlePWD(false)}
                    checked={is_pwd === false}
                    type="radio"
                    id="is_pwd_NO"
                    name="is_pwd"
                    className="my-1"
                    value={false}
                  />
                  <label for="is_pwd_NO">No, i am not</label>
                </div>
              </div>
              {applicationObject?.pwd_cert_url && (
                <>
                  <button
                    className="text-blue-500  py-2 flex flex-wrap gap-1 mt-5 text-sm"
                    // href={preview_cv_data.data.cv_file_url}
                    // target="_blank"
                    onClick={() =>
                      handleShowEmbedModal(applicationObject.pwd_cert_url, true)
                    }
                  >
                    <File /> View previous PWD certificate
                  </button>
                </>
              )}
              {is_pwd && (
                <div className={input_div}>
                  <label className={label_class}>
                    Attach certificate for PWD (Only PDF) 2MB Maximum Size
                  </label>
                  <input
                    accept=".pdf"
                    className={file_inputs_class}
                    onChange={handlePWD_Cert_InputChange}
                    type="file"
                  ></input>

                  <p className="p-3 text-sm">
                    {preview_pwd_data.loading
                      ? "Uploading  to server..."
                      : null}
                    File:{" "}
                    {preview_pwd_data.data !== null ? (
                      <>
                        <button
                          className="text-blue-500  px-1 py-2"
                          // href={preview_cv_data.data.cv_file_url}
                          // target="_blank"
                          onClick={() =>
                            handleShowEmbedModal(
                              preview_pwd_data.data.pwd_cert_url,
                              true
                            )
                          }
                        >
                          View preview here
                        </button>
                      </>
                    ) : (
                      "No preview"
                    )}
                  </p>
                </div>
              )}

              <div className="grid lg:grid-cols-2  grid-cols-1 gap-2 lg:divide-x my-5">
                <div className={input_div}>
                  <label className={label_class}>
                    Do you have good communication skills in English, Swahili &
                    local dialect?
                  </label>
                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleGoodCommunication(true)}
                      checked={good_communication === true}
                      type="radio"
                      id="good_communication_YES"
                      name="good_communication"
                      value={true}
                      className="my-1"
                    />
                    <label for="good_communication_YES">Yes i have</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleGoodCommunication(false)}
                      checked={good_communication === false}
                      type="radio"
                      id="good_communication_NO"
                      name="good_communication"
                      className="my-1"
                      value={false}
                    />
                    <label for="good_communication_NO">No, i do not</label>
                  </div>
                </div>
                <div className={input_div}>
                  <label className={label_class}>
                    Do you have experience in the field of agricultural
                    development?{" "}
                  </label>
                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleExperienceAgric(true)}
                      checked={experience_agric === true}
                      type="radio"
                      id="experience_agric_YES"
                      name="experience_agric"
                      value={true}
                      className="my-1"
                    />
                    <label for="experience_agric_YES">Yes i have</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleExperienceAgric(false)}
                      checked={experience_agric === false}
                      type="radio"
                      id="experience_agric_NO"
                      name="experience_agric"
                      className="my-1"
                      value={false}
                    />
                    <label for="experience_agric_NO">No, i do not</label>
                  </div>
                </div>
              </div>

              {/* {JSON.stringify(experience_agric)} */}
              {/* {experience_crops_livestock_description} */}
              {experience_agric && (
                <div className={input_div}>
                  <div className={input_div}>
                    <label className={label_class}>
                      {" "}
                      If yes, In not less than 50 words, write your experience
                      in crops or livestock.
                    </label>
                    <textarea
                      cols={5}
                      rows={10}
                      onChange={(e) =>
                        set_experience_crops_livestock_description(
                          e.target.value
                        )
                      }
                      // type="email"
                      className={inputs_class}
                      defaultValue={experience_crops_livestock_description}
                    />
                    <p className="text-sm text-gray-500 px-3">
                      {" "}
                      {experience_crops_livestock_description &&
                        `${countWords(
                          experience_crops_livestock_description
                        )} words`}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2  grid-cols-1 gap-2 lg:divide-x my-5">
                <div className={input_div}>
                  <label className={label_class}>
                    Are you committed to be engaged on a full-time basis?{" "}
                  </label>
                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleSetFullTime(true)}
                      checked={engaged_fulltime === true}
                      type="radio"
                      id="engaged_fulltime_YES"
                      name="engaged_fulltime"
                      value={true}
                      className="my-1"
                    />
                    <label for="engaged_fulltime_YES">Yes i am</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleSetFullTime(false)}
                      checked={engaged_fulltime === false}
                      type="radio"
                      id="engaged_fulltime_NO"
                      name="engaged_fulltime"
                      className="my-1"
                      value={false}
                    />
                    <label for="engaged_fulltime_NO">No, i am not</label>
                  </div>
                </div>
                <div className={input_div}>
                  <label className={label_class}>What is your Gender?</label>
                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleSetgender(1)}
                      checked={gender === 1}
                      type="radio"
                      id="gender_MALE"
                      name="gender"
                      value={1}
                      className="my-1"
                    />
                    <label for="gender_MALE">Male</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleSetgender(2)}
                      checked={gender === 2}
                      type="radio"
                      id="gender_FEMALE"
                      name="gender"
                      className="my-1"
                      value={2}
                    />
                    <label for="gender_FEMALE">Female</label>
                  </div>

                  <div className={radio_div}>
                    <input
                      onChange={(e) => handleSetgender(3)}
                      checked={gender === 3}
                      type="radio"
                      id="gender_OTHER"
                      name="gender"
                      className="my-1"
                      value={3}
                    />
                    <label for="gender_OTHER">Other</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2  grid-cols-1 gap-2 lg:divide-x my-5">
              <div className={input_div}>
                <label className={label_class}>
                  Are you currently engaged in formal or informal employment?
                </label>
                {/* <input className={inputs_class} type="radio"></input> */}
                {/* {JSON.stringify(has_post_cert)} */}
                {/* {has_post_cert ? "true":"false"} */}
                <div className={radio_div}>
                  <input
                    onChange={(e) => handleHasHustle(true)}
                    checked={current_hustle === true}
                    type="radio"
                    id="current_hustle_YES"
                    name="current_hustle"
                    value={true}
                    className="my-1"
                  />
                  <label for="current_hustle_YES">Yes i do</label>
                </div>

                <div className={radio_div}>
                  <input
                    onChange={(e) => handleHasHustle(false)}
                    checked={current_hustle === false}
                    type="radio"
                    id="current_hustle_NO"
                    name="current_hustle"
                    className="my-1"
                    value={false}
                  />
                  <label for="current_hustle_NO">No, i do not</label>
                </div>
              </div>
              {current_hustle && (
                <div className={input_div}>
                  <label className={label_class}>
                    What is your current earnings per month from the employment?
                  </label>
                  <div>
                    <input
                      onChange={(e) => set_earnings_per_month(e.target.value)}
                      checked={digitally_literate === true}
                      type="number"
                      className={inputs_class}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2  grid-cols-1 gap-2 lg:divide-x my-5">
              <div className={input_div}>
                <label className={label_class}>Do you have a motorcycle?</label>

                <div className={radio_div}>
                  <input
                    onChange={(e) => set_have_boda(true)}
                    checked={have_boda === true}
                    type="radio"
                    id="have_boda_YES"
                    name="have_boda"
                    value={true}
                    className="my-1"
                  />
                  <label for="have_boda_YES">Yes i do</label>
                </div>

                <div className={radio_div}>
                  <input
                    onChange={(e) => set_have_boda(false)}
                    checked={have_boda === false}
                    type="radio"
                    id="have_boda_NO"
                    name="have_boda"
                    className="my-1"
                    value={false}
                  />
                  <label for="have_boda_NO">No, i do not</label>
                </div>
              </div>
            </div>

            {/* aspiration_as_an_agriculture_entrepreneur */}
            <div className={input_div}>
              <label className={label_class}>
                In not less than 50 words, write your aspiration as an
                agricultural entrepreneur
              </label>
              <textarea
                cols={5}
                rows={10}
                onChange={(e) =>
                  set_aspiration_as_an_agriculture_entrepreneur(e.target.value)
                }
                // type="email"
                className={inputs_class}
                defaultValue={aspiration_as_an_agriculture_entrepreneur}
              />
              <p className="text-sm text-gray-500 px-3">
                {" "}
                {aspiration_as_an_agriculture_entrepreneur &&
                  `${countWords(
                    aspiration_as_an_agriculture_entrepreneur
                  )} words`}
              </p>
            </div>

            <div className="px-3 py-3">
              <div className={input_div}>
                <div className="grid grid-cols-12">
                  <input
                    checked
                    // onChange={() =>
                    //   handleConcentDataProtection(
                    //     concent_data_collected === null
                    //       ? true
                    //       : !concent_data_collected
                    //   )
                    // }
                    onChange={() => {}}
                    className="col-span-1"
                    type="checkbox"
                    id="concent1"
                    name="concent1"
                    value="By submitting this application form, you consent to the use of the information provided for the purpose of assessing your application. Your data will be processed in accordance with the Kenya Data Protection Act and may be shared with relevant parties involved in the recruitment process. You have the right to withdraw your consent at any time by contacting us."
                  ></input>
                  <div className="col-span-11">
                    <label for="concent1">
                      By submitting this application form, you consent to the
                      use of the information provided for the purpose of
                      assessing your application. Your data will be processed in
                      accordance with the Kenya Data Protection Act and may be
                      shared with relevant parties involved in the recruitment
                      process. You have the right to withdraw your consent at
                      any time by contacting us.
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* buttons */}

            <div className="flex grid-cols-2 gap-5 my-5">
              <div>
                {/* camce; */}

                <button
                  onClick={cancelRegistrationConfirmation}
                  className="bg-red-300  hover:bg-red-500 px-5 py-2 rounded-md text-white"
                >
                  Cancel Registration
                </button>
              </div>

              <div>
                <button
                  //   onClick={() => SetIsPreview(true)}
                  onClick={() => ApplyEnumeraratorPreview()}
                  className="bg-green-600 text-white px-5 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </Suspense>
  );
}

export default Form;
