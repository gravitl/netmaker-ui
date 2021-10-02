import { all, put, select, takeEvery } from "redux-saga/effects"
import { getNodes, login } from "../api/actions"
import { getToken } from "../auth/selectors"

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if(token)
    yield put(getNodes.request({
      token
    }))
}

export function* saga() {
  yield all([
    takeEvery(login["success"], handleLoginSuccess),
    handleLoginSuccess()
  ])
}
