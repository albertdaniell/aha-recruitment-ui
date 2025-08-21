"use client";
import { configureStore } from "@reduxjs/toolkit";
import appData from "./features/AppData/appSlice";


export const rootStore = configureStore({
  reducer: {
    appData: appData,
   
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootStore.getState>;

export type AppDispatch = typeof rootStore.dispatch;
