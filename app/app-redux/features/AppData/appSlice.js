import {
  AxiosGetService,
  AxiosPostService,
  AxiosPostService2,
  AxiosPutService2,
} from "@/app/constants/AxiosService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

let enumerator_details = {
  data: null,
  error: "",
  loading: false,
};

let shorlisted_enumerator_details = {
  data: null,
  error: "",
  loading: false,
};

let shorlisted_enumerator_qr_code_details = {
  data: null,
  error: "",
  loading: false,
};

let enumerator_apply_details = {
  data: null,
  error: "",
  loading: false,
};

let COUNTIES = [
  "West Pokot",
  "Wajir",
  "Vihiga",
  "UASIN GISHU",
  "TURKANA",
  "TRANSZOIA",
  "THARAKA-NITHI",
  "TANA RIVER",
  "TAITA TAVETA",
  "SIAYA",
  "SAMBURU",
  "NYERI",
  "NYANDARUA",
  "NYAMIRA",
  "NAROK",
  "NANDI",
  "NAKURU",
  "MURANGA",
  "MIGORI",
  "MERU",
  "MARSABIT",
  "Mandera",
  "MAKUENI",
  "MACHAKOS",
  "LAMU",
  "LAIKIPIA",
  "KWALE",
  "KITUI",
  "KISUMU",
  "KISII",
  "KIRINYAGA",
  "KILIFI",
  "KIAMBU",
  "KERICHO",
  "KAKAMEGA",
  "Kajiado",
  "ISIOLO",
  "HOMABAY",
  "GARISSA",
  "EMBU",
  "ELGEYO MARAKWET",
  "Busia",
  "BUNGOMA",
  "BOMET",
  "BARINGO",
];

let loginUserState = {
  loading: true,
  data: null,
  error: "",
  success: null,
  isLoggedIn: false,
  isLoggedOutButton: null,
  isChangePassword: null,
};
let offlineUserToken = {
  loading: true,
  userToken: null,
  error: "",
  isPresent: null,
  userOffline: null,
};

let county_stats = {
  data: null,
  error: "",
  loading: false,
};

let preview_cv_data = {
  data: null,
  error: "",
  loading: false,
};

let preview_passport_data = {
  data: null,
  error: "",
  loading: false,
};
let preview_post_educ_data = {
  data: null,
  error: "",
  loading: false,
};

let preview_pwd_data = {
  data: null,
  error: "",
  loading: false,
};

let preview_id_data = {
  data: null,
  error: "",
  loading: false,
};

let register_enum_data = {
  data: null,
  error: "",
  loading: false,
};
let app_utils = {
  data: null,
  error: "",
  loading: true,
};
const initialState = {
  language: 0,
  enumerator_details,
  enumerator_apply_details,
  loginUserState,
  offlineUserToken,
  county_stats,
  preview_cv_data,
  preview_post_educ_data,
  preview_id_data,
  preview_pwd_data,
  COUNTIES,
  county_selected_stats: "MERU",
  register_enum_data,
  app_utils,
  preview_passport_data,
  shorlisted_enumerator_details,
  shorlisted_enumerator_qr_code_details,
};

export const searchEnumerator = createAsyncThunk(
  "appSlice/searchEnumerator",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      let { data, csrf } = dataPassed;
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_SEARCH_URL;
      const res = await AxiosPostService2(url, data, null, csrf);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const searchEnumeratorQR_Code = createAsyncThunk(
  "appSlice/searchEnumeratorQR_Code",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      // let { id_number } = dataPassed;
      
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_SEARCH_SUCCESS_AGP_URL;
      const res = await AxiosPostService2(url, dataPassed, null);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const searchShortlistedEnumerator = createAsyncThunk(
  "appSlice/searchShortlistedEnumerator",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      let { data, csrf } = dataPassed;
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_SEARCH_SHORTLISTED_OTP_URL;
      const res = await AxiosPostService2(url, data, null, csrf);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "appSlice/verifyOTP",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      let { data, csrf } = dataPassed;
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_SEARCH_SHORTLISTED_OTP_URL;
      const res = await AxiosPostService2(url, data, null, csrf);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const VERIFYOTP = createAsyncThunk(
  "appSlice/VERIFYOTP",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      let { data, csrf, record_id } = dataPassed;
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_VERIFY_OTP_URL;

      url = `${url}${record_id}/`;
      // console.log(url)
      const res = await AxiosPostService2(url, data, null, csrf);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const VERIFY_AGP_QR_CODE = createAsyncThunk(
  "appSlice/VERIFYOTP",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      let { data, csrf, record_id } = dataPassed;
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_VERIFY_OTP_URL;

      url = `${url}${record_id}/`;
      // console.log(url)
      const res = await AxiosPostService2(url, data, null, csrf);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const registerEnumerator = createAsyncThunk(
  "appSlice/registerEnumerator",
  async (dataPassed, { rejectWithValue }) => {
    try {
      // console.log(data);
      let { data } = dataPassed;
      // let { dataPassed, Token } = data;
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_REGISTER_ENUM_URL;
      const res = await AxiosPostService2(url, data, null);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateEnumerator = createAsyncThunk(
  "appSlice/updateEnumerator",
  async (data, { rejectWithValue }) => {
    try {
      // console.log({ data });
      let { dataPassed, Token, id } = data;

      // console.log(data);
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_REGISTER_ENUM_URL;
      url = `${url}${id}/`;
      const res = await AxiosPutService2(url, dataPassed, Token);

      if (res.hasOwnProperty("data")) {
        return res.data;
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const applyEnumerator = createAsyncThunk(
  "appSlice/applyEnumerator",
  async (data, { rejectWithValue }) => {
    try {
      // console.log({ data });
      let { dataPassed, Token } = data;

      // console.log(data);
      let url = process.env.NEXT_PUBLIC_APPLY_ENUMERATOR_URL;
      const res = await AxiosPostService2(url, dataPassed, Token);

      if (res.hasOwnProperty("data")) {
        return res.data;
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateApplication = createAsyncThunk(
  "appSlice/applyEnumerator",
  async (data, { rejectWithValue }) => {
    try {
      // console.log({ data });
      let { dataPassed, Token, id } = data;

      // console.log(data);
      let url = process.env.NEXT_PUBLIC_APPLICATION_URL;
      url = `${url}${id}/`;
      const res = await AxiosPutService2(url, dataPassed, Token);

      if (res.hasOwnProperty("data")) {
        return res.data;
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitAvailability = createAsyncThunk(
  "appSlice/submitAvailability",
  async (data, { rejectWithValue }) => {
    try {
      let { dataPassed } = data;

      // console.log(data);
      let url = process.env.NEXT_PUBLIC_POST_AVAILABILITY_URL;
      const res = await AxiosPostService2(url, dataPassed);

      if (res.hasOwnProperty("data")) {
        return res.data;
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendNotification = createAsyncThunk(
  "appSlice/sendNotification",
  async (data, { rejectWithValue }) => {
    try {
      let dataPassed = data;

      let url = process.env.NEXT_PUBLIC_SEND_SMS_URL;
      const res = await AxiosPostService2(url, dataPassed);

      if (res.hasOwnProperty("data")) {
        return res.data;
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitAvailability_Update = createAsyncThunk(
  "appSlice/submitAvailability",
  async (data, { rejectWithValue }) => {
    try {
      // console.log({ data });
      let { dataPassed } = data;

      let { availability_object_id } = data;

      // console.log(data);
      let url = process.env.NEXT_PUBLIC_AVAILABILITY_URL;
      url = `${url}${availability_object_id}/`;
      const res = await AxiosPutService2(url, dataPassed);

      if (res.hasOwnProperty("data")) {
        return res.data;
      } else {
        return res;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserTokenOffline = createAsyncThunk(
  "appSlice/getUserTokenOffline",
  async (key) => {
    // let data = await StoreofflineLocalStorage(key);
    return key;
  }
);

export const getUserOffline = createAsyncThunk(
  "appSlice/getUserOffline",
  async (key) => {
    // let data = await StoreofflineLocalStorage(key);
    // return data;
    return key;
  }
);

export const loginUser = createAsyncThunk(
  "appSlice/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_LOGIN_URL;
      // url = `${process.env.REACT_APP_LOGIN_API}/api/login/`;
      const res = await AxiosPostService2(url, data);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);

export const PreviewCV = createAsyncThunk(
  "appSlice/PreviewCV",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_PREV_CV_URL;
      // url = `${process.env.REACT_APP_LOGIN_API}/api/login/`;
      const res = await AxiosPostService2(url, data);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);

export const PreviewPassport = createAsyncThunk(
  "appSlice/PreviewPassport",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_SHORLISTED_PREV_PASSPORT_URL;
      // url = `${process.env.REACT_APP_LOGIN_API}/api/login/`;
      const res = await AxiosPostService2(url, data);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);
export const PreviewPostEductation = createAsyncThunk(
  "appSlice/PreviewPostEductation",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_PREV_POST_EDU_URL;
      // url = `${process.env.REACT_APP_LOGIN_API}/api/login/`;
      const res = await AxiosPostService2(url, data);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);
export const PreviewIdCard = createAsyncThunk(
  "appSlice/PreviewIdCard",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_PREV_ID_URL;
      // url = `${process.env.REACT_APP_LOGIN_API}/api/login/`;
      const res = await AxiosPostService2(url, data);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);

export const PreviewPwdCert = createAsyncThunk(
  "appSlice/PreviewPwdCert",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_PREV_PWD_URL;
      // url = `${process.env.REACT_APP_LOGIN_API}/api/login/`;
      const res = await AxiosPostService2(url, data);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);
export const getCountyStats = createAsyncThunk(
  "appSlice/getCountyStats",
  async (data, { rejectWithValue }) => {
    try {
      // console.log((data))
      let { county_of_data, Token, filter } = data;
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_STATS_URL;
      url = `${url}?county_of_data=${county_of_data}&filter=${filter}`;

      if (county_of_data === "admin") {
        let { county_admin, filter } = data;
        url = `${process.env.NEXT_PUBLIC_APPLICATIONS_STATS_ADMIN_URL}?county_admin=${county_admin}&county_of_data=${county_admin}&filter=${filter}`;
        // alert(url)
      }

      const res = await AxiosGetService(url, Token);
      return res.data;
    } catch (err) {
      // console.log(err)
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUtils = createAsyncThunk(
  "appSlice/getUtils",
  async (data, { rejectWithValue }) => {
    try {
      let url = process.env.NEXT_PUBLIC_APPLICATIONS_UTILS_URL;

      if (data !== undefined) {
        url = `${url}?show_all=${data}`;
      }

      const res = await AxiosGetService(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    ToggleIsDataHub: (state, action) => {
      // console.log(action);
      state.isDataHub = action.payload;
    },

    resetShortlistedData: (state, action) => {
      // console.log(action);
      state.shorlisted_enumerator_details = shorlisted_enumerator_details;
    },
    ToggleChangeLanguage: (state, action) => {
      // console.log(action);
      state.language = action.payload;
    },

    ToggleChangeCountyStats: (state, action) => {
      state.county_selected_stats = action.payload;
    },
    logoutUser: (state, action) => {
      state.loginUserState.isLoggedIn = false;
      state.loginUserState.data = null;
      state.offlineUserToken = {
        loading: true,
        userToken: null,
        error: "",
        isPresent: null,
        userOffline: null,
      };
      state.county_stats = county_stats;
    },
  },

  extraReducers: (builder) => {
    // register builders here
    builder.addCase(searchEnumerator.pending, (state, action) => {
      state.shorlisted_enumerator_details = shorlisted_enumerator_details;
      state.enumerator_details.loading = true;
      state.enumerator_details.data = null;
      // state.enumerator_details.data = null;
    });
    builder.addCase(searchEnumerator.fulfilled, (state, action) => {
      state.enumerator_details.loading = false;
      state.enumerator_details.data = action.payload;
      state.enumerator_details.error = "";
    });

    builder.addCase(searchEnumerator.rejected, (state, action) => {
      state.enumerator_details.loading = false;
      state.enumerator_details.data = null;
    });

    builder.addCase(VERIFYOTP.pending, (state, action) => {
      state.shorlisted_enumerator_details.loading = true;
      // state.enumerator_details.data = null;
    });
    builder.addCase(VERIFYOTP.fulfilled, (state, action) => {
      state.shorlisted_enumerator_details.loading = false;
      state.shorlisted_enumerator_details.data = action.payload;
      state.shorlisted_enumerator_details.error = "";
    });

    builder.addCase(VERIFYOTP.rejected, (state, action) => {
      state.shorlisted_enumerator_details.loading = false;
      state.shorlisted_enumerator_details.data = null;
    });

    // searchEnumeratorQR_Code

    builder.addCase(searchEnumeratorQR_Code.pending, (state, action) => {
      state.shorlisted_enumerator_qr_code_details.loading = true;
      // state.enumerator_details.data = null;
    });
    builder.addCase(searchEnumeratorQR_Code.fulfilled, (state, action) => {
      state.shorlisted_enumerator_qr_code_details.loading = false;
      state.shorlisted_enumerator_qr_code_details.data = action.payload;
      state.shorlisted_enumerator_qr_code_details.error = "";
    });

    builder.addCase(searchEnumeratorQR_Code.rejected, (state, action) => {
      state.shorlisted_enumerator_qr_code_details.loading = false;
      state.shorlisted_enumerator_qr_code_details.data = null;
    });

    // apply enumerator
    builder.addCase(applyEnumerator.pending, (state, action) => {
      state.enumerator_apply_details.loading = true;
      state.enumerator_apply_details.data = null;
    });
    builder.addCase(applyEnumerator.fulfilled, (state, action) => {
      state.enumerator_apply_details.loading = false;
      state.enumerator_apply_details.data = action.payload;
      state.enumerator_apply_details.error = "";
      state.preview_cv_data = preview_cv_data;
      state.preview_post_educ_data = preview_post_educ_data;
      state.preview_pwd_data = preview_pwd_data;
      state.preview_id_data = preview_id_data;
    });

    builder.addCase(applyEnumerator.rejected, (state, action) => {
      state.enumerator_apply_details.loading = false;
      state.enumerator_apply_details.data = null;
    });

    builder.addCase(getUserOffline.pending, (state) => {});

    builder.addCase(getUserOffline.fulfilled, (state, action) => {
      // console.log(action.payload)
      // state.offlineUserToken.loading = null;
      // state.offlineUserToken.userOffline = action.payload;
      // state.offlineUserToken.error = "";

      if (action.payload !== null) {
        // state.offlineUserToken.isPresent = true;
        // state.offlineTokenIsPresent = true;
        state.loginUserState.data = action.payload.user;
        // state.loginUserState.isLoggedIn= true
        state.loginUserState.loading = false;
      } else {
        // alert(1)
        // state.offlineUserToken.isPresent = false;
        // state.loginUserState = loginUserState;
        // state.offlineUserToken.userOffline = action.payload.user;
      }
    });

    builder.addCase(getUserOffline.rejected, (state, action) => {
      state.loginUserState.loading = null;
      state.getUserTokenOffline.loading = null;
      state.offlineTokenIsPresent = null;
      state.offlineTokenIsPresent = null;
      state.offlineUserToken.isPresent = false;
      state.loginUserState = loginUserState;
    });

    builder.addCase(getUserTokenOffline.pending, (state) => {
      state.offlineUserToken.loading = true;
      state.offlineUserToken.error = "";
      state.offlineTokenIsPresent = null;
      state.offlineUserToken.isPresent = null;
    });

    builder.addCase(getUserTokenOffline.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.offlineUserToken.loading = null;
      state.offlineUserToken.userToken = action.payload;
      state.offlineUserToken.error = "";

      if (action.payload) {
        state.offlineUserToken.isPresent = true;
        state.offlineTokenIsPresent = true;
        state.loginUserState.isLoggedIn = true;
      } else {
        state.offlineUserToken.isPresent = false;
        state.loginUserState = loginUserState;
      }
    });

    builder.addCase(getUserTokenOffline.rejected, (state, action) => {
      state.loginUserState.loading = null;
      state.getUserTokenOffline.loading = null;
      state.offlineTokenIsPresent = null;
      state.offlineTokenIsPresent = null;
      state.offlineUserToken.isPresent = false;
      state.loginUserState = loginUserState;
    });

    // login

    builder.addCase(loginUser.pending, (state) => {
      state.loginUserState.loading = true;
      state.loginUserState.success = false;
      state.loginUserState.error = "";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginUserState.data = action.payload;
      state.loginUserState.isLoggedIn = true;
      state.loginUserState.error = "";
      state.loginUserState.loading = false;
      state.loginUserState.success = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {});

    builder.addCase(getCountyStats.pending, (state) => {
      state.county_stats.loading = true;
      state.county_stats.data !== null && null;
      state.county_stats.error = "";
    });
    builder.addCase(getCountyStats.fulfilled, (state, action) => {
      state.county_stats.data = action.payload;
      if (action.payload.status === 0) {
        state.county_stats.data = null;

        state.county_stats.error = action.payload.message;
      }
      // state.county_stats.error = "";
      state.county_stats.loading = false;
    });
    builder.addCase(getCountyStats.rejected, (state, action) => {
      state.county_stats.error = "Error!";
      state.county_stats.loading = false;
    });

    // preview cv

    builder.addCase(PreviewCV.pending, (state) => {
      state.preview_cv_data.loading = true;
      state.preview_cv_data.data = null;
      state.preview_cv_data.error = "";
    });
    builder.addCase(PreviewCV.fulfilled, (state, action) => {
      state.preview_cv_data.data = action.payload;
      state.preview_cv_data.error = "";
      state.preview_cv_data.loading = false;
    });
    builder.addCase(PreviewCV.rejected, (state, action) => {
      state.preview_cv_data.error = "Error!";
      state.preview_cv_data.loading = false;
    });

    builder.addCase(PreviewPassport.pending, (state) => {
      state.preview_passport_data.loading = true;
      state.preview_passport_data.data = null;
      state.preview_passport_data.error = "";
    });
    builder.addCase(PreviewPassport.fulfilled, (state, action) => {
      state.preview_passport_data.data = action.payload;
      state.preview_passport_data.error = "";
      state.preview_passport_data.loading = false;
    });
    builder.addCase(PreviewPassport.rejected, (state, action) => {
      state.preview_passport_data.error = "Error!";
      state.preview_passport_data.loading = false;
    });

    // preview post edu

    builder.addCase(PreviewPostEductation.pending, (state) => {
      state.preview_post_educ_data.loading = true;
      state.preview_post_educ_data.data = null;
      state.preview_post_educ_data.error = "";
    });
    builder.addCase(PreviewPostEductation.fulfilled, (state, action) => {
      state.preview_post_educ_data.data = action.payload;
      state.preview_post_educ_data.error = "";
      state.preview_post_educ_data.loading = false;
    });
    builder.addCase(PreviewPostEductation.rejected, (state, action) => {
      state.preview_post_educ_data.error = "Error!";
      state.preview_post_educ_data.loading = false;
    });

    // prev id card\

    builder.addCase(PreviewIdCard.pending, (state) => {
      state.preview_id_data.loading = true;
      state.preview_id_data.data = null;
      state.preview_id_data.error = "";
    });
    builder.addCase(PreviewIdCard.fulfilled, (state, action) => {
      state.preview_id_data.data = action.payload;
      state.preview_id_data.error = "";
      state.preview_id_data.loading = false;
    });
    builder.addCase(PreviewIdCard.rejected, (state, action) => {
      state.preview_id_data.error = "Error!";
      state.preview_id_data.loading = false;
    });

    builder.addCase(PreviewPwdCert.pending, (state) => {
      state.preview_pwd_data.loading = true;
      state.preview_pwd_data.data = null;
      state.preview_pwd_data.error = "";
    });
    builder.addCase(PreviewPwdCert.fulfilled, (state, action) => {
      state.preview_pwd_data.data = action.payload;
      state.preview_pwd_data.error = "";
      state.preview_pwd_data.loading = false;
    });
    builder.addCase(PreviewPwdCert.rejected, (state, action) => {
      state.preview_pwd_data.error = "Error!";
      state.preview_pwd_data.loading = false;
    });

    // register enum

    builder.addCase(registerEnumerator.pending, (state) => {
      state.register_enum_data.loading = true;
      state.register_enum_data.data = null;
      state.register_enum_data.error = "";
    });
    builder.addCase(registerEnumerator.fulfilled, (state, action) => {
      state.register_enum_data.data = action.payload;
      state.register_enum_data.error = "";
      state.register_enum_data.loading = false;
    });
    builder.addCase(registerEnumerator.rejected, (state, action) => {
      state.register_enum_data.error = "Error!";
      state.register_enum_data.loading = false;
    });

    // get utils\\

    builder.addCase(getUtils.pending, (state) => {
      state.app_utils.loading = true;
      state.app_utils.error = "";
    });
    builder.addCase(getUtils.fulfilled, (state, action) => {
      state.app_utils.data = action.payload;
      state.app_utils.error = "";
      state.app_utils.loading = false;
    });
    builder.addCase(getUtils.rejected, (state, action) => {
      state.app_utils.error = "Error!";
      state.app_utils.loading = false;
    });
  },
});

export const {
  ToggleIsDataHub,
  ToggleChangeLanguage,
  logoutUser,
  ToggleChangeCountyStats,
  resetShortlistedData,
} = appSlice.actions;

export default appSlice.reducer;
