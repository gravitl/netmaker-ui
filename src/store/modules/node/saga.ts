import { all, put, select, takeEvery } from "redux-saga/effects"
import { getNodes } from "./actions"
import { login } from "../api/actions"
import { getToken } from "../auth/selectors"
import { AxiosResponse } from "axios"
import { getType } from "typesafe-actions"
import { getApi } from "../api/selectors"
import { NodePayload } from "./types"

function* handleGetNodesRequest(action: ReturnType<typeof getNodes["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse<Array<NodePayload>> = yield api.get("/nodes", {
      headers: {
        authorization: `Bearer ${action.payload.token}`
      }
    })
    console.log(response.data)
    yield put(getNodes["success"](response.data))
  } catch (e: unknown) {
    yield put(getNodes["failure"](e as Error))
  }
}

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if(token)
    yield put(getNodes.request({
      token
    }))
}

export function* saga() {
  yield all([
    takeEvery(getType(getNodes["request"]), handleGetNodesRequest),
    takeEvery(login["success"], handleLoginSuccess),

    handleLoginSuccess()
  ])
}
