import { all, fork, put, takeEvery } from 'redux-saga/effects'
import {
  getNodeACLContainer,
  updateNodeACL,
  updateNodeContainerACL,
} from './actions'
import { AxiosResponse } from 'axios'
import { NodeACL, NodeACLContainer } from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from 'src/i18n/i18n'
import { getType } from 'typesafe-actions'

function* handleGetACLContainerRequest(
  action: ReturnType<typeof getNodeACLContainer['request']>
) {
  try {
    const response: AxiosResponse<NodeACLContainer> =
      yield apiRequestWithAuthSaga('get', `/networks/${action.payload.netid}/acls`, {})
    yield put(getNodeACLContainer['success'](response.data))
  } catch (e: unknown) {
    yield put(getNodeACLContainer['failure'](e as Error))
  }
}

function* handleUpdateNodeACL(
  action: ReturnType<typeof updateNodeACL['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: updateNodeACL['success'],
      error: updateNodeACL['failure'],
      params: {
        pending: i18n.t('toast.pending', {
          nodeid: action.payload.nodeid,
        }),
        success: i18n.t('toast.update.success.nodeacl', {
          nodeid: action.payload.nodeid,
        }),
        error: e => `${i18n.t('toast.update.failure.nodeacl', {
          nodeid: action.payload.nodeid
        })} : ${e.response.data.Message}`,
      },
    })

    const response: AxiosResponse<NodeACL> = yield apiRequestWithAuthSaga(
      'put',
      `/nodes/${action.payload.netid}/${action.payload.nodeid}/acls`,
      action.payload.nodeACL,
      {}
    )

    yield put(updateNodeACL['success']({ 
      nodeID: action.payload.nodeid,
      nodeACL: response.data 
    }))
  } catch (e: unknown) {
    yield put(updateNodeACL['failure'](e as Error))
  }
}

function* handleUpdateNodeACLContainer(
  action: ReturnType<typeof updateNodeContainerACL['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: updateNodeContainerACL['success'],
      error: updateNodeContainerACL['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeid: action.payload.netid,
        }),
        success: i18n.t('toast.delete.success.node', {
          nodeid: action.payload.netid,
        }),
        error: e => `${i18n.t('toast.delete.failure.node', {
          nodeid: action.payload.netid,
        })} : ${e.response.data.Message}`,
      },
    })

    const response: AxiosResponse<NodeACLContainer> = yield apiRequestWithAuthSaga(
      'put',
      `/networks/${action.payload.netid}/acls`,
      action.payload.aclContainer,
      {}
    )

    yield put(updateNodeContainerACL['success'](response.data))
  } catch (e: unknown) {
    yield put(updateNodeContainerACL['failure'](e as Error))
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(getNodeACLContainer['request']), handleGetACLContainerRequest),
    takeEvery(getType(updateNodeACL['request']), handleUpdateNodeACL),
    takeEvery(getType(updateNodeContainerACL['request']), handleUpdateNodeACLContainer),    
  ])
}
