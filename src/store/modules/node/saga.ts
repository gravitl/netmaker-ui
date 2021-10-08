import { all, call, put, select, takeEvery } from "redux-saga/effects"
import { createEgressNode, createExternalClient, createIngressNode, deleteExternalClient, deleteIngressNode, deleteNode, getExternalClients, getNodes, updateNode } from "./actions"
import { login } from "../api/actions"
import { getToken } from "../auth/selectors"
import { AxiosResponse } from "axios"
import { getType } from "typesafe-actions"
import { getApi } from "../api/selectors"
import { ExternalClient, NodePayload } from "./types"
import { asyncToastSaga } from "../toast/saga"
import { i18n } from "../../../i18n/i18n"
import { nodeToNodePayload } from "./utils"

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

function* handleUpdateNodeRequest(action: ReturnType<typeof updateNode["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<NodePayload> = yield call(asyncToastSaga, {
      promise: {
        method: api.put,
        params: [
          `/nodes/${action.payload.netid}/${action.payload.node.id}`,
          nodeToNodePayload(action.payload.node),
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("updateNodeToastRequest", {nodeid: action.payload.node.id}),
        success: i18n.t("updateNodeToastSuccess", {nodeid: action.payload.node.id}),
        error: i18n.t("updateNodeToastError", {nodeid: action.payload.node.id}),
      },
    });

    yield put(updateNode["success"](response.data));
  } catch (e: unknown) {
    yield put(updateNode["failure"](e as Error));
  }
}

function* handleDeleteNodeRequest(action: ReturnType<typeof deleteNode["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    yield call(asyncToastSaga, {
      promise: {
        method: api.delete,
        params: [
          `/nodes/${action.payload.netid}/${action.payload.nodeid}`,
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("deleteNodeToastRequest", {nodeid: action.payload.nodeid}),
        success: i18n.t("deleteNodeToastSuccess", {nodeid: action.payload.nodeid}),
        error: i18n.t("deleteNodeToastError", {nodeid: action.payload.nodeid}),
      },
    });

    yield put(deleteNode["success"]());
  } catch (e: unknown) {
    yield put(deleteNode["failure"](e as Error));
  }
}

function* handleCreateIngressNodeRequest(action: ReturnType<typeof createIngressNode["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    yield call(asyncToastSaga, {
      promise: {
        method: api.post,
        params: [
          `/nodes/${action.payload.netid}/${action.payload.nodeid}/createingress`,
          {},
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("createIngressNodeToastRequest", {nodeid: action.payload.nodeid}),
        success: i18n.t("createIngressNodeToastSuccess", {nodeid: action.payload.nodeid}),
        error: i18n.t("createIngressNodeToastError", {nodeid: action.payload.nodeid}),
      },
    });

    yield put(createIngressNode["success"]());
  } catch (e: unknown) {
    yield put(createIngressNode["failure"](e as Error));
  }
}

function* handleDeleteIngressNodeRequest(action: ReturnType<typeof deleteIngressNode["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    yield call(asyncToastSaga, {
      promise: {
        method: api.delete,
        params: [
          `/nodes/${action.payload.netid}/${action.payload.nodeid}/deleteingress`,
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("deleteIngressNodeToastRequest", {nodeid: action.payload.nodeid}),
        success: i18n.t("deleteIngressNodeToastSuccess", {nodeid: action.payload.nodeid}),
        error: i18n.t("deleteIngressNodeToastError", {nodeid: action.payload.nodeid}),
      },
    });

    yield put(deleteIngressNode["success"]());
  } catch (e: unknown) {
    yield put(deleteIngressNode["failure"](e as Error));
  }
}

function* handleGetExternalClientRequest(action: ReturnType<typeof getExternalClients["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<Array<ExternalClient> | null> = yield call(api.get,
          `/extclients`,
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          })

    yield put(getExternalClients["success"](response.data));
  } catch (e: unknown) {
    yield put(getExternalClients["failure"](e as Error));
  }
}

function* handleCreateExternalClientRequest(action: ReturnType<typeof createExternalClient["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<void> = yield call(asyncToastSaga, {
      promise: {
        method: api.post,
        params: [
          `/extclients/${action.payload.netid}/${action.payload.nodeid}`,
          {},
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("createExternalClientToastRequest", {nodeid: action.payload.nodeid}),
        success: i18n.t("createExternalClientToastSuccess", {nodeid: action.payload.nodeid}),
        error: i18n.t("createExternalClientToastError", {nodeid: action.payload.nodeid}),
      },
    });

    yield put(createExternalClient["success"](response.data));
  } catch (e: unknown) {
    yield put(createExternalClient["failure"](e as Error));
  }
}

function* handleDeleteExternalClientRequest(action: ReturnType<typeof deleteExternalClient["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<void> = yield call(asyncToastSaga, {
      promise: {
        method: api.delete,
        params: [
          `/extclients/${action.payload.netid}/${action.payload.clientName}`,
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("deleteExternalClientToastRequest", {nodeName: action.payload.clientName}),
        success: i18n.t("deleteExternalClientToastSuccess", {nodeName: action.payload.clientName}),
        error: i18n.t("deleteExternalClientToastError", {nodeName: action.payload.clientName}),
      },
    });

    yield put(deleteExternalClient["success"](response.data));
  } catch (e: unknown) {
    yield put(deleteExternalClient["failure"](e as Error));
  }
}

function* handleCreateEgressNodeRequest(action: ReturnType<typeof createEgressNode["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi);

  try {
    const response: AxiosResponse<NodePayload> = yield call(asyncToastSaga, {
      promise: {
        method: api.post,
        params: [
          `/nodes/${action.payload.netid}/${action.payload.nodeid}/creategateway`,
          action.payload.payload,
          {
            headers: {
              authorization: `Bearer ${action.payload.token}`,
            },
          },
        ],
      },
      params: {
        pending: i18n.t("createEgressNodeToastRequest", {nodeName: action.payload.nodeid}),
        success: i18n.t("createEgressNodeToastSuccess", {nodeName: action.payload.nodeid}),
        error: i18n.t("createEgressNodeToastError", {nodeName: action.payload.nodeid}),
      },
    });

    yield put(createEgressNode["success"](response.data));
  } catch (e: unknown) {
    yield put(createEgressNode["failure"](e as Error));
  }
}

// get external client qr
// get http://hakeee.duckdns.org:8081/api/extclients/testnet/fun-hulk
// response content type png

export function* saga() {
  yield all([
    takeEvery(getType(getNodes["request"]), handleGetNodesRequest),
    takeEvery(getType(login["success"]), handleLoginSuccess),

    takeEvery(getType(updateNode["request"]), handleUpdateNodeRequest),
    takeEvery(getType(deleteNode["request"]), handleDeleteNodeRequest),
    takeEvery(getType(createIngressNode["request"]), handleCreateIngressNodeRequest),
    takeEvery(getType(deleteIngressNode["request"]), handleDeleteIngressNodeRequest),
    takeEvery(getType(getExternalClients["request"]), handleGetExternalClientRequest),
    takeEvery(getType(createExternalClient["request"]), handleCreateExternalClientRequest),
    takeEvery(getType(deleteExternalClient["request"]), handleDeleteExternalClientRequest),
    takeEvery(getType(createEgressNode["request"]), handleCreateEgressNodeRequest),

    handleLoginSuccess()
  ])
}
