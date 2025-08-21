"use client";
import { rootStore } from "./appstore";
import { Provider } from "react-redux";

export function Providers({ children }) {
  return <Provider store={rootStore}>{children}</Provider>;
}
