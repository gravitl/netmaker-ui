import { all, put, select, takeEvery } from "redux-saga/effects"
import { getServerConfig } from "./actions"
import { login } from "../auth/actions"
import { getToken } from "../auth/selectors"
import { getType } from "typesafe-actions"
import { AxiosResponse } from "axios"
import { apiRequestWithAuthSaga } from "../api/saga"

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if(token)
    yield put(getServerConfig.request({
      token
    }))
}

function* handleGetServerConfigRequest(
  _: ReturnType<typeof getServerConfig["request"]>
) {
  try {
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      "get",
      "/server/getconfig",
      {}
    );
    yield put(getServerConfig["success"](response.data));
  } catch (e: unknown) {
    yield put(getServerConfig["failure"](e as Error));
  }
}

export function* saga() {
  yield all([
    takeEvery(login["success"], handleLoginSuccess),
    takeEvery(
      getType(getServerConfig["request"]),
      handleGetServerConfigRequest
    ),
    handleLoginSuccess()
  ])
}
