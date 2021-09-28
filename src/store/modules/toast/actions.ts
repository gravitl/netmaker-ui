import { createAction } from "typesafe-actions";
import { ToastPayload, AsyncToastPayload } from "./types";

export const toast = createAction("toast_toast")<ToastPayload>();
export const asyncToast = createAction("toast_asyncToast")<AsyncToastPayload>();