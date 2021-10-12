import { createAsyncAction } from "typesafe-actions";
import {
  GetServerConfigPayload
} from "./types";

export const getServerConfig = createAsyncAction(
  "api_getServerConfig_Request",
  "api_getServerConfig_Success",
  "api_getServerConfig_Failure"
)<GetServerConfigPayload["Request"], GetServerConfigPayload["Response"], Error>();
