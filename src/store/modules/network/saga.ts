import { AxiosResponse } from "axios";
import { all, put, select, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { login } from "../api/actions";
import { getApi } from "../api/selectors";
import { getToken } from "../auth/selectors";
import { asyncToast } from "../toast/actions";
import { deleteNetwork, getNetworks, updateNetwork } from "./actions";
import { NetworkPayload } from "./types";

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken);
  if (token)
    yield put(
      getNetworks.request({
        token,
      })
    );
}

function* handleGetNetworksRequest(
  action: ReturnType<typeof getNetworks["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<Array<NetworkPayload>> = yield api.get("/networks", {
      headers: {
        authorization: `Bearer ${action.payload.token}`,
      },
    });
    console.log(response.data);
    yield put(getNetworks["success"](response.data));
  } catch (e: unknown) {
    yield put(getNetworks["failure"](e as Error));
  }
}

function* handleUpdateNetworkRequest(
  action: ReturnType<typeof updateNetwork["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const promise = api.put(
      `/network/${action.payload.network.netid}`,
      action.payload.network,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );

    yield put(asyncToast({
      promise: promise,
      params: {
        pending: `Updaing network ${action.payload.network.netid}`,
        success: `Updaing network ${action.payload.network.netid} success!`,
        error: `Updaing network ${action.payload.network.netid} error!`,
      }
    }))

    const response: AxiosResponse<NetworkPayload> = yield promise
    console.log(response.data);
    yield put(updateNetwork["success"](response.data));
  } catch (e: unknown) {
    yield put(updateNetwork["failure"](e as Error));
  }
}

function* handleDeleteNetworkRequest(
  action: ReturnType<typeof deleteNetwork["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<NetworkPayload> = yield api.delete(
      `/network/${action.payload.netid}`,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );
    console.log(response.data);
    yield put(deleteNetwork["success"]());
  } catch (e: unknown) {
    yield put(deleteNetwork["failure"](e as Error));
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(login["success"]), handleLoginSuccess),
    takeEvery(getType(getNetworks["request"]), handleGetNetworksRequest),
    takeEvery(getType(updateNetwork["request"]), handleUpdateNetworkRequest),
    takeEvery(getType(deleteNetwork["request"]), handleDeleteNetworkRequest),
    handleLoginSuccess(),
  ]);
}
