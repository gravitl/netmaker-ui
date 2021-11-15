import { AxiosResponse } from 'axios'
import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { login } from '../auth/actions'
import { getToken } from '../auth/selectors'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import {
  createNetwork,
  deleteNetwork,
  getNetworks,
  updateNetwork,
  createAccessKey,
  getAccessKeys,
  deleteAccessKey,
  clearMetadata,
  refreshPublicKeys,
  getDnsEntries,
  createDnsEntry,
  deleteDnsEntry,
} from './actions'
import {
  NetworkPayload,
  GetAccessKeysPayload,
} from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { DNS } from '~store/types'

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if (token) { 
    yield put(getNetworks.request())
    yield put(getDnsEntries.request())
  }
}

function* handleClearMetadata(
  action: ReturnType<typeof clearMetadata['request']>
) {
  const netid = action.payload.netid
  if (netid) yield put(clearMetadata['success']({netid}))
  else yield put(clearMetadata['failure'](Error('could not clear metadata')))
}

function* handleGetNetworksRequest() {
  try {
    const response: AxiosResponse<Array<NetworkPayload>> =
      yield apiRequestWithAuthSaga('get', '/networks', {})
    yield put(getNetworks['success'](response.data))
  } catch (e: unknown) {
    yield put(getNetworks['failure'](e as Error))
  }
}

function* handleGetDnsRequest(
) {
  try {
    const response: AxiosResponse<Array<DNS>> =
      yield apiRequestWithAuthSaga('get', `/dns`, {})
    yield put(getDnsEntries['success'](response.data))
  } catch (e: unknown) {
    yield put(getDnsEntries['failure'](e as Error))
  }
}

function* handleCreateDNSRequest(
  action: ReturnType<typeof createDnsEntry['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createDnsEntry['success'],
      error: createDnsEntry['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: i18n.t('toast.create.success.dns'),
        error: i18n.t('toast.create.failure.dns'),
      },
    })

    const response: AxiosResponse<DNS> =
      yield apiRequestWithAuthSaga(
        'post',
        `/dns/${action.payload.network}`,
        action.payload,
        {}
      )

    yield put(createDnsEntry['success'](response.data))
  } catch (e: unknown) {
    yield put(createDnsEntry['failure'](e as Error))
  }
}

function* handleDeleteDNSRequest(
  action: ReturnType<typeof deleteDnsEntry['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteDnsEntry['success'],
      error: deleteDnsEntry['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: i18n.t('toast.delete.success.dns'),
        error: i18n.t('toast.delete.failure.dns'),
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/dns/${action.payload.netid}/${action.payload.domain}`,
      {}
    )

    yield put(deleteDnsEntry['success']({domain: action.payload.domain}))
  } catch (e: unknown) {
    yield put(deleteDnsEntry['failure'](e as Error))
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

function* handleRefreshPubKeyRequest(
  action: ReturnType<typeof refreshPublicKeys['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: refreshPublicKeys['success'],
      error: refreshPublicKeys['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.update.success.networkrefresh')} : ${action.payload.netid}`,
        error: `${i18n.t('toast.update.failure.networkrefresh')} : ${action.payload.netid}`,
      },
    })

    const response: AxiosResponse<NetworkPayload> =
      yield apiRequestWithAuthSaga(
        'post',
        `/networks/${action.payload.netid}/keyupdate`,
        {},
        {}
      )
    yield put(refreshPublicKeys['success'](response.data))
  } catch (e: unknown) {
    yield put(refreshPublicKeys['failure'](e as Error))
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
        pending: i18n.t('common.pending'),
        success: i18n.t('toast.create.success.accesskey'),
        error: (error) =>
          `${i18n.t('toast.create.failure.accesskey')}\n${error.response.data.Message}`,
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
    takeEvery(getType(clearMetadata['request']), handleClearMetadata),
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
    takeEvery(getType(refreshPublicKeys['request']), handleRefreshPubKeyRequest),
    takeEvery(getType(getDnsEntries['request']), handleGetDnsRequest),
    takeEvery(getType(createDnsEntry['request']), handleCreateDNSRequest),
    takeEvery(getType(deleteDnsEntry['request']), handleDeleteDNSRequest),
    handleLoginSuccess(),
  ])
}
