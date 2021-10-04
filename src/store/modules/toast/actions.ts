import { createAction } from "typesafe-actions";
import { ToastPayload } from "./types";

export const toast = createAction("toast_toast")<ToastPayload>();