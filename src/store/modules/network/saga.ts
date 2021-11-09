import { AxiosResponse } from 'axios'
import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { login } from '../auth/actions'
import { getToken } from '../auth/selectors'
import { generatorToastSaga } from '../toast/saga'
import {
  createNetwork,
  deleteNetwork,
  getNetworks,
  updateNetwork,
  createAccessKey,
  getAccessKeys,
  deleteAccessKey,
} from './actions'
import {
  NetworkPayload,
  GetAccessKeysPayload,
} from './types'
import { apiRequestWithAuthSaga } from '../api/saga'

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if (token) yield put(getNetworks.request())
}

function* handleGetNetworksRequest() {
  try {
    const response: AxiosResponse<Array<NetworkPayload>> =
      yield apiRequestWithAuthSaga('get', '/networks', {})
    console.log(response.data)
    yield put(getNetworks['success'](response.data))
  } catch (e: unknown) {
    yield put(getNetworks['failure'](e as Error))
  }
}

function* handleUpdateNetworkRequest(
  action: ReturnType<typeof updateNetwork['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: updateNetwork['success'],
      error: updateNetwork['failure'],
      params: {
        pending: `Updaing network ${action.payload.network.netid}`,
        success: `Updaing network ${action.payload.network.netid} success!`,
        error: `Updaing network ${action.payload.network.netid} error!`,
      },
    })

    const response: AxiosResponse<NetworkPayload> =
      yield apiRequestWithAuthSaga(
        'put',
        `/networks/${action.payload.network.netid}`,
        action.payload.network,
        {}
      )

    yield put(updateNetwork['success'](response.data))
  } catch (e: unknown) {
    yield put(updateNetwork['failure'](e as Error))
  }
}

function* handleDeleteNetworkRequest(
  action: ReturnType<typeof deleteNetwork['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteNetwork['success'],
      error: deleteNetwork['failure'],
      params: {
        pending: `Deleting network ${action.payload.netid}`,
        success: `Deleting network ${action.payload.netid} success!`,
        error: (error) =>
          `Deleting network ${action.payload.netid} error!\n${error.response.data.Message}`,
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/networks/${action.payload.netid}`,
      {}
    )

    yield put(deleteNetwork['success']({ netid: action.payload.netid }))
  } catch (e: unknown) {
    yield put(deleteNetwork['failure'](e as Error))
  }
}

function* handleCreateNetworkRequest(
  action: ReturnType<typeof createNetwork['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createNetwork['success'],
      error: createNetwork['failure'],
      params: {
        pending: `Creating network ${action.payload.netid}`,
        success: `Creating network ${action.payload.netid} success!`,
        error: (error) =>
          `Creating network ${action.payload.netid} error!\n${error.response.data.Message}`,
      },
    })

    yield apiRequestWithAuthSaga('post', '/networks', action.payload, {})

    yield put(createNetwork['success']())
  } catch (e: unknown) {
    yield put(createNetwork['failure'](e as Error))
  }
}

function* handleDeleteAccessKeyRequest(
  action: ReturnType<typeof deleteAccessKey['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteAccessKey['success'],
      error: deleteAccessKey['failure'],
      params: {
        pending: `Deleting Access Key ${action.payload.name}`,
        success: `Deleting Access Key ${action.payload.name} success!`,
        error: (error) =>
          `Deleting Access Key ${action.payload.name} error!\n${error.response.data.Message}`,
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/networks/${action.payload.netid}/keys/${action.payload.name}`,
      {}
    )
    yield put(deleteAccessKey['success'](action.payload))
  } catch (e: unknown) {
    yield put(deleteAccessKey['failure'](e as Error))
  }
}

function* handleGetAccessKeysRequest(
  action: ReturnType<typeof getAccessKeys['request']>
) {
  try {
    const response: AxiosResponse<GetAccessKeysPayload['Response']> =
      yield apiRequestWithAuthSaga(
        'get',
        `/networks/${action.payload.netid}/keys`,
        {}
      )
    yield put(getAccessKeys['success'](response.data))
  } catch (e: unknown) {
    yield put(getAccessKeys['failure'](e as Error))
  }
}

function* handleCreateAccessKeyRequest(
  action: ReturnType<typeof createAccessKey['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createAccessKey['success'],
      error: createAccessKey['failure'],
      params: {
        pending: `Creating Access Key ${action.payload.newAccessKey.name}`,
        success: `Creating Access Key ${action.payload.newAccessKey.name} success!`,
        error: (error) =>
          `Creating Access Key ${action.payload.newAccessKey.name} error!\n${error.response.data.Message}`,
      },
    })

    action.payload.newAccessKey.uses = Number(action.payload.newAccessKey.uses)

    const response: AxiosResponse =
      yield apiRequestWithAuthSaga(
        'post',
        `/networks/${action.payload.netid}/keys`,
        action.payload.newAccessKey,
        {}
      )
    
    yield put(createAccessKey['success']({
      netid: action.payload.netid,
      newAccessKey: response.data
    }))
  } catch (e: unknown) {
    yield put(createAccessKey['failure'](e as Error))
  }
}
function* handleDeleteNetworkSuccess(
  action: ReturnType<typeof deleteNetwork['success']>
) {
  // TODO: Navigate back to networks
}

// Update keys
// post http://hakeee.duckdns.org:8081/api/networks/testnet/keyupdate
// Token
// reponse empty NetworkPayload

export function* saga() {
  yield all([
    takeEvery(getType(login['success']), handleLoginSuccess),
    takeEvery(getType(getNetworks['request']), handleGetNetworksRequest),
    takeEvery(getType(updateNetwork['request']), handleUpdateNetworkRequest),
    takeEvery(getType(deleteNetwork['request']), handleDeleteNetworkRequest),
    takeEvery(getType(createNetwork['request']), handleCreateNetworkRequest),
    takeEvery(
      getType(deleteAccessKey['request']),
      handleDeleteAccessKeyRequest
    ),
    takeEvery(getType(getAccessKeys['request']), handleGetAccessKeysRequest),
    takeEvery(
      getType(createAccessKey['request']),
      handleCreateAccessKeyRequest
    ),
    takeEvery(getType(createNetwork['success']), handleGetNetworksRequest),
    takeEvery(getType(deleteNetwork['success']), handleDeleteNetworkSuccess),
    handleLoginSuccess(),
  ])
}
