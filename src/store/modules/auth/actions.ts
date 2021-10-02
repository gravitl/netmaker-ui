import { createAction } from "typesafe-actions";
import { User } from "./types";

export const setUser = createAction("setUser")<User>();

export const logout = createAction("logout")<void>();