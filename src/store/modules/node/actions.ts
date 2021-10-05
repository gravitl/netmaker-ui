import { createAsyncAction } from "typesafe-actions";
import { GetNodes } from "./types";

export const getNodes = createAsyncAction(
  "Node_getNodes_Request",
  "Node_getNodes_Success",
  "Node_getNodes_Failure"
)<GetNodes["Request"], GetNodes["Response"], Error>();
