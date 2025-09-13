"use client";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import Styles from "./Styles.module.css";
import { useRouter } from "next/navigation";
import {
  StoreofflineLocalStorage,
  getOfflineData,
  removeValueFromOffline,
} from "@/app/constants/OfflineStorage";
import { JsonToformData } from "@/app/constants/utils";
import {
  loginUser,
  getUserTokenOffline,
  getUserOffline,
} from "@/app/app-redux/features/AppData/appSlice";
import { Spinner } from "flowbite-react";
import { LockOn } from "akar-icons";

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [error_msg, set_error_msg] = useState(null);
  const [isloading, setIsLoading] = useState(null);

  const router = useRouter();
  useEffect(() => {
    removeValueFromOffline("@userData");
    removeValueFromOffline("@isLoggedIn");
  }, []);

  useEffect(() => {
    document.title = "Login"; // Replace 'Your New Page Title' with your desired title}
  }, []);

  const onSubmitWithReCAPTCHA = async (e) => {
    e.preventDefault();
    set_error_msg(null);
    setIsLoading(true);
    // const token = await recaptchaRef.current.executeAsync();
    // console.log(token)

    dispatch(loginUser(JsonToformData({ username, password })))
      .unwrap()
      .then((res) => {
        setIsLoading(false);

        // alert("success")
        setTimeout(() => {
          router.replace(`/county`);
          StoreofflineLocalStorage("@userData", res);
          StoreofflineLocalStorage("@isLoggedIn", true);

          getOfflineData("@isLoggedIn").then((res1) => {
            dispatch(getUserTokenOffline(res1));
            // updateToken(res)
            getOfflineData("@userData").then((res2) => {
              dispatch(getUserOffline(res2));
            });
            // dispatch(getUserOffline("@userData"))
            // console.log({res})
            if (!res1) {
              // alert(0)
              dispatch(getUserTokenOffline(false));
              router.replace(`/login`);
            }
          });
        }, 100);
      })
      .catch((err) => {
        // console.log(err);
        setIsLoading(false);

        if (err.hasOwnProperty("message")) {
          //   alert(err.message);
        } else {
          if (err.hasOwnProperty("non_field_errors")) {
            set_error_msg(err.non_field_errors[0]);

            return 0;
          }
          set_error_msg("Something went wrong");
        }
      });

    // apply to form data
  };

  return (
    <div className="flex md:justify-center md:items-center">
      {/* <AppHomeNav></AppHomeNav> */}
      <div className="container md:m-0">
        <div className="row mt-0">
          <div className="col-sm-2"></div>
          <div className="col-sm-8 mt-0">
            <h3 className="my-5 text-2xl flex gap-3">
              {" "}
              <LockOn className="my-1" /> Login
            </h3>
            {/* <hr></hr> */}
            <form
              className="shadow rounded-md p-3 border-t-8 border-t-green-400"
              onSubmit={(e) => onSubmitWithReCAPTCHA(e)}
            >
              <div class="mb-3">
                <label
                  for="exampleInputEmail1"
                  class="form-label text-gray-600"
                >
                  Username
                </label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="email"
                  placeholder="@johndoe"
                  class="form-control bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-2"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div class="mb-3">
                <label
                  for="exampleInputPassword1"
                  class="form-label text-gray-600"
                >
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*******"
                  type="password"
                  class="form-control bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-2"
                  id="exampleInputPassword1"
                />
              </div>

              {error_msg !== null && (
                <p className="text-red-400 my-3">{error_msg}</p>
              )}
              {isloading ? (
                <Spinner></Spinner>
              ) : (
                <button
                  onClick={(e) => onSubmitWithReCAPTCHA(e)}
                  // type="submit"
                  class="bg-green-500 p-2 px-5 py-2 rounded-lg text-white"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
          <div className="col-sm-2"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
