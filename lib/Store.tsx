import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Reducers/AuthSlice";

export const store = configureStore({
  reducer: {
    auth: AuthSlice,
  },
});
