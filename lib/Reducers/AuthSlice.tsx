import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const api = "https://jupiter.cmdev.cc";
const initialState = {
  adminauthlogindata: {},
  loginuser: {},
  isAuth: false,
  isLoading: false,
  isError: null,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.loginuser = action.payload;
      state.isAuth = true;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logIn: (state, action) => {
      state.loginuser = action.payload;
    },
    logOut: (state) => {
      state.loginuser = {};
      state.isAuth = false;
      state.isLoading = false;
      state.isError = null;
    },
    otpverify: (state, action) => {
      state.adminauthlogindata = action.payload;
      state.isAuth = true;
    },
  },
});
export const { setLoading, logIn, setInitialData, logOut, otpverify } =
  AuthSlice.actions;
export default AuthSlice.reducer;
export const getUsers = () => async (dispatch: any) => {
  try {
    const res = await axios.get(api);
    dispatch(setInitialData(res.data));
  } finally {
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  }
};
