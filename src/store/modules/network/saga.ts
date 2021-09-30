import { AxiosResponse } from "axios";
import { all, put, select, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { login } from "../api/actions";
import { getApi } from "../api/selectors";
import { getToken } from "../auth/selectors";
import { asyncToast } from "../toast/actions";
import {
  createNetwork,
  deleteNetwork,
  getNetworks,
  updateNetwork,
  createAccessKey,
  getAccessKeys,
  deleteAccessKey,
} from "./actions";
import { NetworkPayload, GetAccessKeysPayload, CreateAccessKeyPayload, DeleteAccessKeyPayload, CreateNetworkPayload } from "./types";

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
    const response: AxiosResponse<Array<NetworkPayload>> = yield api.get(
      "/networks",
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );
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
      `/networks/${action.payload.network.netid}`,
      action.payload.network,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );

    yield put(
      asyncToast({
        promise: promise,
        params: {
          pending: `Updaing network ${action.payload.network.netid}`,
          success: `Updaing network ${action.payload.network.netid} success!`,
          error: `Updaing network ${action.payload.network.netid} error!`,
        },
      })
    );

    const response: AxiosResponse<NetworkPayload> = yield promise;
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
    const response: AxiosResponse<void> = yield api.delete(
      `/networks/${action.payload.netid}`,
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

function* handleCreateNetworkRequest(
  action: ReturnType<typeof createNetwork["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<CreateNetworkPayload["Response"]> = yield api.post(
      `/networks`,
      action.payload.newNetwork,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );
    console.log(response.data);
    yield put(createNetwork["success"]());
  } catch (e: unknown) {
    yield put(createNetwork["failure"](e as Error));
  }
}

function* handleDeleteAccessKeyRequest(
  action: ReturnType<typeof deleteAccessKey["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<DeleteAccessKeyPayload["Response"]> = yield api.delete(
      `/networks/${action.payload.netid}/keys/${action.payload.name}`,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );
    console.log(response.data);
    yield put(deleteAccessKey["success"]());
  } catch (e: unknown) {
    yield put(deleteAccessKey["failure"](e as Error));
  }
}

function* handleGetAccessKeysRequest(
  action: ReturnType<typeof getAccessKeys["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<GetAccessKeysPayload["Response"]> = yield api.get(
      `/networks/${action.payload.netid}/keys`,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );
    console.log(response.data);
    yield put(getAccessKeys["success"](response.data));
  } catch (e: unknown) {
    yield put(getAccessKeys["failure"](e as Error));
  }
}

function* handleCreateAccessKeyRequest(
  action: ReturnType<typeof createAccessKey["request"]>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<CreateAccessKeyPayload["Response"]> = yield api.put(
      `/networks/${action.payload.netid}/keys`,
      action.payload.newAccessKey,
      {
        headers: {
          authorization: `Bearer ${action.payload.token}`,
        },
      }
    );
    console.log(response.data);
    yield put(createAccessKey["success"](response.data));
  } catch (e: unknown) {
    yield put(createAccessKey["failure"](e as Error));
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(login["success"]), handleLoginSuccess),
    takeEvery(getType(getNetworks["request"]), handleGetNetworksRequest),
    takeEvery(getType(updateNetwork["request"]), handleUpdateNetworkRequest),
    takeEvery(getType(deleteNetwork["request"]), handleDeleteNetworkRequest),
    takeEvery(getType(createNetwork["request"]), handleCreateNetworkRequest),
    takeEvery(getType(deleteAccessKey["request"]), handleDeleteAccessKeyRequest),
    takeEvery(getType(getAccessKeys["request"]), handleGetAccessKeysRequest),
    takeEvery(getType(createAccessKey["request"]), handleCreateAccessKeyRequest),
    handleLoginSuccess(),
  ]);
}
