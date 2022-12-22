import { all, fork, put, takeEvery } from 'redux-saga/effects'
import { deleteHost, getHosts, updateHost } from './actions'
import { AxiosResponse } from 'axios'
import { Host } from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import { getType } from 'typesafe-actions'

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
        success: i18n.t('toast.update.success.nodeacl', {
          hostid: action.payload.id,
        }),
        error: (e) =>
          `${i18n.t('toast.update.failure.nodeacl', {
            hostid: action.payload.id,
          })} : ${e.response.data.Message}`,
      },
    })

    const response: AxiosResponse<Host> = yield apiRequestWithAuthSaga(
      'put',
      `/hosts/${action.payload.id}`,
      action.payload,
      {}
    )

    yield put(updateHost['success'](response.data))
  } catch (e: unknown) {
    yield put(updateHost['failure'](e as Error))
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
        success: i18n.t('toast.delete.success.nodeacl', {
          hostid: action.payload.hostid,
        }),
        error: (e) =>
          `${i18n.t('toast.delete.failure.nodeacl', {
            hostid: action.payload.hostid,
          })} : ${e.response.data.Message}`,
      },
    })

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

export function* saga() {
  yield all([
    takeEvery(getType(getHosts['request']), handleGetHostsRequest),
    takeEvery(getType(updateHost['request']), handleUpdateHostRequest),
    takeEvery(getType(deleteHost['request']), handleDeleteHostRequest),
  ])
}
