import { createReducer } from "typesafe-actions"
import axios from "axios";
import {BACKEND_URL} from "../../../config";

// headers: { authorization: `Bearer ${key}` },

export const reducer = createReducer({
  axios: axios.create({
    baseURL: `${BACKEND_URL}/api`,
  }),
})
