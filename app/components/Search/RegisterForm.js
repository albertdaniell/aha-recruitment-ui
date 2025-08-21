import {
  getUtils,
  registerEnumerator,
  updateEnumerator,
} from "@/app/app-redux/features/AppData/appSlice";
import {
  countWords,
  generateCountySubCountyWard,
  isEmptyString,
  isNumberCheck,
} from "@/app/constants/utils";
import { Pencil, Send } from "akar-icons";
import { Button, Modal, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminSelectorGroup from "./AdminSelectorGroup";

function RegisterForm({ user_id_number, editObject,searchEnumerator }) {
  const [id_number, set_id_number] = useState(null);
  const [phone, set_phone] = useState(null);
  const [name, set_name] = useState(null);
  const appData = useSelector((state) => state.appData);
  const { register_enum_data, app_utils } = appData;
  const [county, set_county] = useState(null);
  const [subcounty, set_subcounty] = useState(null);
  const [ward, set_ward] = useState(null);
  const [correct_info, set_correct_info] = useState(null);
  const [openModal, SetShowModal] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState(null);
  const [isSuccess, SetIsSuccess] = useState(null);
  const [adminUnitsData, SetAdminUnits] = useState(null);
  const [countySelected, SetCountySelected] = useState(null);
  const [subCountySelected, SetSubCountySelected] = useState(null);
  const [wardSelected, SetWardSelected] = useState(null);
  const router = useRouter();
  const [recent_subcounties, set_recent_subcounties] = useState(null);
  const [recent_wards, set_recent_wards] = useState(null);
  const [cohort_selected, set_cohort_selected] = useState(null);

  const dispatch = useDispatch();

  let inputs_class = "px-3 py-2  my-2 mx-3 rounded border-1 border-gray-200";
  let inputs_class_muted =
    "px-3 py-2 text-gray-800 bg-white opacity-4  my-2 mx-3 rounded border-1 border-gray-200";

  let file_inputs_class = "px-3 py-1 bg-white my-2 mx-2 rounded overflow-auto";

  let label_class = "px-3 py-1  my-0 text-gray-700 font-medium";
  let input_div = "flex flex-col my-1";
  let radio_div = "flex flex-row gap-2 flex align-center my-1 px-3";

  useEffect(() => {
    // automatically load the id number from the search page
    if (user_id_number !== undefined) {
      // check if is number
      if (isNumberCheck(user_id_number)) {
        if (user_id_number.length === 10 || user_id_number[0] === "0") {
          set_phone(user_id_number);
        } else {
          set_id_number(user_id_number);
        }
      }
    }
  }, [user_id_number]);

  const handleIDChange = (e) => {
    set_id_number(e);
  };

  const handlePhoneChange = (e) => {
    set_phone(e);
  };

  const handleNameChange = (e) => {
    set_name(e);
  };

  const handleConfirmCorrectDetails = async (data) => {
    SetIsSuccess(false);

    if (id_number === null) {
      SetShowModal(true);

      SetErrorMessage("ID number cannot be empty");
      return 0;
    }
    if (isEmptyString(id_number)) {
      SetShowModal(true);

      SetErrorMessage("ID number cannot be empty");
      return 0;
    }

    if (phone === null) {
      SetShowModal(true);

      SetErrorMessage("Phone number cannot be empty");
      return 0;
    }
    if (isEmptyString(phone)) {
      SetShowModal(true);

      SetErrorMessage("Phone number cannot be empty");
      return 0;
    }
    // count words

    if (name === null) {
      SetShowModal(true);

      SetErrorMessage("Name cannot be empty");
      return 0;
    }
    if (isEmptyString(name)) {
      SetShowModal(true);

      SetErrorMessage("Name cannot be empty");
      return 0;
    }

    let name_count = countWords(name.trim());

    if (name_count < 2) {
      SetShowModal(true);

      SetErrorMessage("Your two names are recommended");
      return 0;
    }
    if (county === null) {
      SetShowModal(true);
      SetErrorMessage("County cannot be empty");
      return 0;
    }

    if (subcounty === null) {
      SetShowModal(true);
      SetErrorMessage("Sub-county cannot be empty");
      return 0;
    }

    if (ward === null) {
      SetShowModal(true);
      SetErrorMessage("Ward cannot be empty");
      return 0;
    }
    set_correct_info(data);
  };

  let resetform = ()=>{
    set_phone("");
    set_county("");
    set_subcounty("");
    set_ward("");
    set_name("");
    set_correct_info(false);
    setTimeout(() => {
      set_name(null);
      set_phone(null);
      set_county(null);
      set_subcounty(null);
      set_ward(null);
    }, 100);
  }

  const handleSelectCounty = () => {};
  const handleSubmit = () => {
    SetIsSuccess(false);

    let data = new FormData();

    data.append("name", name.trim());
    data.append("id_number", id_number.trim());
    data.append("mobile_number", phone.trim());
    data.append("ward", ward);
    data.append("subcounty", subcounty);
    data.append("ward", ward);
    data.append("county", county);
    data.append("cohort", cohort_selected);

    data.append("status", 1);
    data.append("adminID", parseInt(wardSelected));

    // register here or update

    if(editObject){
      // update
      // console.log(editObject)
      dispatch(updateEnumerator({ 
        id: editObject.pk,
          dataPassed: data,
          Token: null
       }))
      .unwrap()
      .then((res) => {
        if (res.status == 0) {
          SetShowModal(true);
          SetErrorMessage(res.message);
        } else {
          SetIsSuccess(true);
          SetShowModal(true);
          SetErrorMessage(res.message);
         resetform()
        }
        //
      })
      .catch((e) => {
        if(e?.message){
          SetIsSuccess(true);
          SetShowModal(true);
          SetErrorMessage(e.message);
        }else{
          // SetIsSuccess(true);
          SetShowModal(true);
          SetErrorMessage("Something went wrong updating your details");
        }
      });
    }else{
      // register

      dispatch(registerEnumerator({ data: data }))
      .unwrap()
      .then((res) => {
        if (res.status == 0) {
          SetShowModal(true);
          SetErrorMessage(res.message);
        } else {
          SetIsSuccess(true);
          SetShowModal(true);
          SetErrorMessage(res.message);
         resetform()
        }
        //
      })
      .catch((e) => {});
    }

    
  };

  const proceedToApply = () => {
    SetShowModal(false);
    router.push(`/apply?id_number=${id_number}`);
    setTimeout(() => {
      set_id_number("");
    }, 1000);
    setTimeout(() => {
      set_id_number(null);
    }, 1500);
  };

  const handleCountySelect = async (data) => {
    SetSubCountySelected(null);

    data = JSON.parse(data);
    // console.log(data);
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
      set_cohort_selected(data.cohort);

      set_recent_subcounties(subcounties);
      //   console.log(subcounties)
      SetCountySelected(data);
      SetSubCountySelected(null);
      //   set_recent_wards(null);
    }, 100);
  };

  const handleSubCountySelect = (data) => {
    set_correct_info(false)

    SetWardSelected(null)
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
      // console.log(adminUnitsData.wards)
      // console.log(county)

      set_subcounty(data.Subcounty);

      // console.log({wards})

      set_recent_wards(wards);

      if (editObject) {
        SetSubCountySelected(data);
      } else {
        SetSubCountySelected(data.id);
      }
    }, 100);
  };

  const handleWardSelect = (data) => {
    set_correct_info(false)
    data = JSON.parse(data);

    setTimeout(() => {
      set_ward(data.Ward);
      if (editObject) {
        SetWardSelected(data);
      } else {
        SetWardSelected(data.id);
      }
    }, 100);
  };

  useEffect(() => {
    // subcounty filter
  }, [countySelected]);

  useEffect(() => {
    // console.log(editObject);
    set_name(editObject?.name);
    set_phone(editObject?.mobile_number);
    set_county(editObject?.county);
    set_subcounty(editObject?.subcounty);
    set_ward(editObject?.ward);




    if (adminUnitsData) {
      let filtered_county = adminUnitsData?.counties.filter((cnty) => {
        return cnty.County === editObject?.county;
      });

      let filtered_subcounty = adminUnitsData?.subcounties.filter((cnty) => {
        return cnty.Subcounty === editObject?.subcounty;
      });

      let filtered_ward = adminUnitsData?.wards.filter((cnty) => {
        return cnty.Subcounty === editObject?.subcounty;
      });

      // console.log(adminUnitsData?.subcounties)

      if (filtered_county) {
        if (filtered_county.length !== 0) {
          handleCountySelect(JSON.stringify(filtered_county[0]));
          SetCountySelected(filtered_county[0]);

          // SetSubCountySelected(filtered_subcounty ? filtered_subcounty[0] : null);
        }
      }

      if (filtered_subcounty) {
        if (filtered_subcounty.length !== 0) {
          // console.log({ filtered_subcounty });
          SetSubCountySelected(filtered_subcounty[0]);
          handleSubCountySelect(JSON.stringify(filtered_subcounty[0]));
        }
      }

      if (filtered_ward) {
        if (filtered_ward.length !== 0) {
          SetSubCountySelected(filtered_ward ? filtered_ward[0] : null);
          handleWardSelect(JSON.stringify(filtered_ward[0]));
        }
      }
      // SetSubCountySelected(filtered_subcounty !== undefined ? filtered_subcounty[0] : null);
      // SetWardSelected(filtered_ward !== undefined ? filtered_ward[0] : null);
    }
  }, [editObject, adminUnitsData]);

  useEffect(() => {
    // generate county,subcounty,ward

    if (app_utils.data) {
      let admin_data_set = generateCountySubCountyWard(app_utils.data);
      SetAdminUnits(admin_data_set);
    }
  }, [app_utils]);

  useEffect(() => {
    dispatch(getUtils())
      .unwrap()
      .then((res) => {})
      .catch((e) => {});
  }, []);

  return (
    <div>
      {/* {JSON.stringify(adminUnitsData)} */}
      <Modal show={openModal} onClose={() => SetShowModal(false)} size="md">
        <Modal.Header>Message</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {ErrorMessage}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isSuccess ? (
            <Button color="blue" onClick={proceedToApply} className="gap-3">
              <Pencil className="mr-2" /> Proceed to apply
            </Button>
          ) : (
            <Button
              color="gray"
              onClick={() => SetShowModal(false)}
              className="gap-3"
            >
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div className="grid lg:grid-cols-2  grid-cols-1 gap-2">
        <div className={input_div}>
          <label className={label_class}>National Identification number</label>
          {/* aa{JSON.stringify(editObject !== null ? true : false)} */}
          <input
            disabled={
              register_enum_data.loading || editObject ? true : false
            }
            onChange={(e) => handleIDChange(e.target.value)}
            type="number"
            className={`${inputs_class} ${editObject && "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
            value={id_number}
            placeholder="12345678"
          />
        </div>
        <div className={input_div}>
          <label className={label_class}>Phone</label>
          <input
            disabled={register_enum_data.loading}
            onChange={(e) => handlePhoneChange(e.target.value)}
            type="number"
            className={inputs_class}
            value={phone}
            placeholder="0711000000"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-1  grid-cols-1 gap-2">
        <div className={input_div}>
          <label className={label_class}>Your full name</label>
          <p className="text-sm text-gray-400 px-3">Two names recommended</p>
          <input
            disabled={register_enum_data.loading}
            onChange={(e) => handleNameChange(e.target.value)}
            type="text"
            className={inputs_class}
            value={name}
            placeholder="Jane Doe"
          />
        </div>
      </div>

      <div>
        {editObject && (
          <>
            <p className="px-3 mt-4 text-orange-400 text-sm">
              You were previously registered in {editObject?.ward} Ward,{" "}
              {editObject?.subcounty} in {editObject?.county} county
            </p>
          </>
        )}
        {adminUnitsData !== null && (
          <AdminSelectorGroup
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
      </div>

      <div className="p-3">
        <div className={input_div}>
          <div className="flex gap-4">
            {/* {JSON.stringify(correct_info)} */}
            <input
              disabled={register_enum_data.loading}
              onChange={() => handleConfirmCorrectDetails(!correct_info)}
              className="col-span-1 my-1"
              type="checkbox"
              id="concent2"
              name="concent2"
              value="concent2"
              checked={correct_info === true ? true : false}
            ></input>
            <div className="col-span-11 ">
              <label for="concent2">
                I confirm that these are my correct details
              </label>
              <p className="text-xs text-gray-400 px-0">
                Make sure to confirm your details
              </p>
            </div>
          </div>
        </div>
      </div>

      {register_enum_data.loading ? (
        <>
          <Spinner /> Submitting...
        </>
      ) : (
        <>
          {correct_info && (
            <>
              <button
                disabled={register_enum_data.loading}
                onClick={handleSubmit}
                type="submit"
                className="my-2 mx-2 lg:w-[15%] w-[30%] bg-[#53a840] md:p-3 p-2 text-white rounded-md shadow-lg hover:bg-[#448b34]"
              >
            {editObject ? "Update Details":"Submit"} 
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default RegisterForm;
