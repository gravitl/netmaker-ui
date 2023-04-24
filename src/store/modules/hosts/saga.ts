import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import {
  createHostRelay,
  deleteHost,
  deleteHostRelay,
  getHosts,
  refreshHostKeys,
  updateHost,
  updateHostNetworks,
} from './actions'
import { AxiosResponse } from 'axios'
import { Host } from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import { getType } from 'typesafe-actions'
import { getNodes } from '../node/selectors'
import { Node } from '../node'
import { getToken } from '../auth/selectors'
import { login } from '../auth/actions'

function* handleGetHostsRequest(
  action: ReturnType<typeof getHosts['request']>
) {
  try {
    const response: AxiosResponse<Host[]> = yield apiRequestWithAuthSaga(
      'get',
      `/hosts`,
      {}
    )
    yield put(getHosts['success'](response.data))
  } catch (e: unknown) {
    yield put(getHosts['failure'](e as Error))
  }
}

function* handleUpdateHostRequest(
  action: ReturnType<typeof updateHost['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: updateHost['success'],
      error: updateHost['failure'],
      params: {
        pending: i18n.t('common.pending', {
          hostid: action.payload.id,
        }),
        success: i18n.t('toast.update.success.host', {
          hostid: action.payload.id,
        }),
        error: (e) =>
          `${i18n.t('toast.update.failure.host', {
            hostid: action.payload.id,
          })}: ${e.response.data.Message || ''}`,
      },
    })

    const response: AxiosResponse<Host> = yield apiRequestWithAuthSaga(
      'put',
      `/hosts/${action.payload.id}`,
      {
        ...action.payload,
        verbosity: Number(action.payload.verbosity),
        mtu: Number(action.payload.mtu),
        listenport: Number(action.payload.listenport),
        proxy_listen_port: Number(action.payload.proxy_listen_port),
      },
      {}
    )

    yield put(updateHost['success'](response.data))
  } catch (e: unknown) {
    yield put(updateHost['failure'](e as Error))
  }
}

function* handleRefreshHostKeysRequest(
  action: ReturnType<typeof refreshHostKeys['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: refreshHostKeys['success'],
      error: refreshHostKeys['failure'],
      params: {
        pending: i18n.t('common.pending', {
          hostid: action.payload.id,
        }),
        success: i18n.t('toast.update.success.host', {
          hostid: action.payload.id,
        }),
        error: (e) =>
          `${i18n.t('toast.update.failure.host', {
            hostid: action.payload.id,
          })}: ${e.response.data.Message || ''}`,
      },
    })

    yield apiRequestWithAuthSaga(
      'put',
      `/hosts/${action.payload.id}/keys`,
      {},
      {}
    )

    yield put(refreshHostKeys['success']())
    yield put(getHosts['request']())
  } catch (e: unknown) {
    yield put(refreshHostKeys['failure'](e as Error))
  }
}

function* handleUpdateHostNetworksRequest(
  action: ReturnType<typeof updateHostNetworks['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: updateHostNetworks['success'],
      error: updateHostNetworks['failure'],
      params: {
        pending: i18n.t('common.pending', {
          hostid: action.payload.id,
        }),
        success: i18n.t('toast.update.success.host', {
          hostid: action.payload.id,
        }),
        error: (e) =>
          `${i18n.t('toast.update.failure.host', {
            hostid: action.payload.id,
          })}: ${e.response.data.Message || ''}`,
      },
    })

    if (action.payload.action === 'join') {
      yield apiRequestWithAuthSaga(
        'post',
        `/hosts/${action.payload.id}/networks/${action.payload.network}`,
        {},
        {}
      )
    } else if (action.payload.action === 'leave') {
      yield apiRequestWithAuthSaga(
        'delete',
        `/hosts/${action.payload.id}/networks/${action.payload.network}`,
        {}
      )
    }

    yield put(updateHostNetworks['success']())
    yield fork(getHosts['request'])
  } catch (e: unknown) {
    yield put(updateHostNetworks['failure'](e as Error))
  }
}

function* handleDeleteHostRequest(
  action: ReturnType<typeof deleteHost['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteHost['success'],
      error: deleteHost['failure'],
      params: {
        pending: i18n.t('common.pending', {
          hostid: action.payload.hostid,
        }),
        success: i18n.t('toast.delete.success.host', {
          hostid: action.payload.hostid,
        }),
        error: (e) =>
          `${i18n.t('toast.delete.failure.host', {
            hostid: action.payload.hostid,
          })}: ${
            e.response?.data?.Message || i18n.t('toast.delete.failure.hostalt')
          }`,
      },
    })

    const nodes: Node[] = yield select(getNodes)
    const hasNodes = nodes.some((node) => node.hostid === action.payload.hostid)
    if (hasNodes) {
      throw new Error('Host has nodes. Delete all nodes before deleting host')
    }

    const response: AxiosResponse<Host> = yield apiRequestWithAuthSaga(
      'delete',
      `/hosts/${action.payload.hostid}`,
      {}
    )

    yield put(deleteHost['success'](response.data))
  } catch (e: unknown) {
    yield put(deleteHost['failure'](e as Error))
  }
}

function* handleCreateHostRelayRequest(
  action: ReturnType<typeof createHostRelay['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createHostRelay['success'],
      error: createHostRelay['failure'],
      params: {
        pending: i18n.t('common.pending', {
          hostid: action.payload.hostid,
        }),
        success: i18n.t('toast.create.success.hostrelay'),
        error: (e) =>
          `${i18n.t('toast.create.failure.hostrelay')}: ${
            e.response.data.Message || ''
          }`,
      },
    })

    const response: AxiosResponse<Host> = yield apiRequestWithAuthSaga(
      'post',
      `/hosts/${action.payload.hostid}/relay`,
      action.payload,
      {}
    )

    yield put(createHostRelay['success'](response.data))
  } catch (e: unknown) {
    yield put(createHostRelay['failure'](e as Error))
  }
}

function* handleDeleteHostRelayRequest(
  action: ReturnType<typeof deleteHostRelay['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteHostRelay['success'],
      error: deleteHostRelay['failure'],
      params: {
        pending: i18n.t('common.pending', {
          hostid: action.payload.hostid,
        }),
        success: i18n.t('toast.delete.success.hostrelay'),
        error: (e) =>
          `${i18n.t('toast.delete.failure.hostrelay')}: ${
            e.response.data.Message || ''
          }`,
      },
    })

    const response: AxiosResponse<Host> = yield apiRequestWithAuthSaga(
      'delete',
      `/hosts/${action.payload.hostid}/relay`,
      {}
    )

    yield put(deleteHostRelay['success'](response.data))
  } catch (e: unknown) {
    yield put(deleteHostRelay['failure'](e as Error))
  }
}

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if (token) yield put(getHosts.request())
}

export function* saga() {
  yield all([
    takeEvery(login['success'], handleLoginSuccess),
    takeEvery(getType(getHosts['request']), handleGetHostsRequest),
    takeEvery(getType(updateHost['request']), handleUpdateHostRequest),
    takeEvery(
      getType(updateHostNetworks['request']),
      handleUpdateHostNetworksRequest
    ),
    takeEvery(getType(deleteHost['request']), handleDeleteHostRequest),
    takeEvery(
      getType(createHostRelay['request']),
      handleCreateHostRelayRequest
    ),
    takeEvery(
      getType(deleteHostRelay['request']),
      handleDeleteHostRelayRequest
    ),
    takeEvery(
      getType(refreshHostKeys['request']),
      handleRefreshHostKeysRequest
    ),
  ])
}
