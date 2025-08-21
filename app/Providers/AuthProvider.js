"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   getCountyStats_Merged,
//   getUserOffline,
//   getUserTokenOffline,
// } from "../../app-redux/features/appData/appDataSlice";
import { getOfflineData } from "../constants/OfflineStorage";
import { useRouter } from "next/navigation";
import {
  getUserOffline,
  getUserTokenOffline,
} from "../app-redux/features/AppData/appSlice";
import { Spinner } from "flowbite-react";
// import { StoreofflineLocalStorage, getOfflineData, setOfflineLocalStorage } from "../../constants/OfflineStorage";

const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
  const router = useRouter();

  const { pathname: location, query } = router;

  const dispatch = useDispatch();

  const appData = useSelector((state) => state.appData);

  let { offlineUserToken } = appData;
  let { loginUserState } = appData;

  let user_county =
    loginUserState.data !== null ? loginUserState.data.county_string : null;

  useEffect(() => {
    // Get the user offline token
    setTimeout(() => {
      if (!loginUserState.isLoggedIn) {
        // alert(0)
        // dispatch(getUserTokenOffline("@isLoggedIn"));
        // console.log("getting user offline")
        let myoffline = getOfflineData("@isLoggedIn").then((res) => {
          dispatch(getUserTokenOffline(res));
          // updateToken(res)
          getOfflineData("@userData").then((res2) => {
            dispatch(getUserOffline(res2))
              .unwrap()
              .then((res3) => {
                if (res3) {
                  if (res3.user.hasOwnProperty("expires")) {
                    let expires = res3.user.expires;
                    let date1 = new Date(expires);

                    const date2 = new Date();

                    if (date2 > date1) {
                      router.replace(`/login`);
                    } else {
                    }
                  } else {
                    router.replace(`/login`);
                  }
                }
              });
          });
          if (!res) {
            // alert(0)
            dispatch(getUserTokenOffline(false));

            router.replace(`/login`);
          }
        });
      }
    }, 2000);
    // dispatch(getUserTokenOffline("@isLoggedIn"));
    // console.log(offlineUserToken.userToken)
  }, [offlineUserToken.userToken, location, loginUserState]);

  useEffect(() => {
    //get user from token if not null
    // if (offlineUserToken.userToken !== null) {
    if (loginUserState.isLoggedIn) {
      // dispatch(getUserOffline("@userData"));
    }

    // !loginUserState.loading && dispatch(getUserOffline("@userData"));
    // }
  }, [offlineUserToken.userToken]);

  useEffect(() => {}, [loginUserState]);

  return (
    <>
      {loginUserState.isLoggedIn && !loginUserState.loading ? (
        children
      ) : (
        <>{loginUserState.loading && <Spinner />}</>
      )}
    </>
  );
};

export default AuthProvider;
