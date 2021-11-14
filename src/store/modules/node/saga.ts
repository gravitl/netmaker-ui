import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import {
  createEgressNode,
  createExternalClient,
  createIngressNode,
  createRelayNode,
  deleteEgressNode,
  deleteExternalClient,
  deleteIngressNode,
  deleteNode,
  deleteRelayNode,
  getExternalClientConf,
  getExternalClients,
  getNodes,
  updateNode,
} from './actions'
import { login } from '../auth/actions'
import { getToken } from '../auth/selectors'
import { AxiosResponse } from 'axios'
import { getType } from 'typesafe-actions'
import { ExternalClient, NodePayload } from './types'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import { nodeToNodePayload } from './utils'
import { apiRequestWithAuthSaga } from '../api/saga'
import { ExtClientConfResponse, GetExternalClientConfPayload } from '~store/types'

function* handleGetNodesRequest(
  action: ReturnType<typeof getNodes['request']>
) {
  try {
    const response: AxiosResponse<Array<NodePayload>> =
      yield apiRequestWithAuthSaga('get', '/nodes', {})
    yield put(getNodes['success'](response.data))
  } catch (e: unknown) {
    yield put(getNodes['failure'](e as Error))
  }
}

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if (token)
    yield put(
      getNodes.request({
        token,
      })
    )
    yield put(
      getExternalClients.request({
        token: token || '',
      })
    )
}

function* handleUpdateNodeRequest(
  action: ReturnType<typeof updateNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: updateNode['success'],
      error: updateNode['failure'],
      params: {
        pending: i18n.t('toast.pending', {
          nodeid: action.payload.node.id,
        }),
        success: i18n.t('toast.update.success.node', {
          nodeid: action.payload.node.id,
        }),
        error: i18n.t('toast.update.failure.node', {
          nodeid: action.payload.node.id,
        }),
      },
    })

    const newNode = nodeToNodePayload(action.payload.node)

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'put',
      `/nodes/${action.payload.netid}/${action.payload.node.id}`,
      newNode,
      {}
    )

    yield put(updateNode['success'](response.data))
  } catch (e: unknown) {
    yield put(updateNode['failure'](e as Error))
  }
}

function* handleDeleteNodeRequest(
  action: ReturnType<typeof deleteNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteNode['success'],
      error: deleteNode['failure'],
      params: {
        pending: i18n.t('deleteNodeToastRequest', {
          nodeid: action.payload.nodeid,
        }),
        success: i18n.t('deleteNodeToastSuccess', {
          nodeid: action.payload.nodeid,
        }),
        error: i18n.t('deleteNodeToastError', {
          nodeid: action.payload.nodeid,
        }),
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/nodes/${action.payload.netid}/${action.payload.nodeid.split('###')[0]}`,
      {}
    )

    yield put(deleteNode['success']({nodeid: action.payload.nodeid}))
  } catch (e: unknown) {
    yield put(deleteNode['failure'](e as Error))
  }
}

function* handleCreateRelayNodeRequest(
  action: ReturnType<typeof createRelayNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createRelayNode['success'],
      error: createRelayNode['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeid: action.payload.nodemac,
        }),
        success: i18n.t('toast.create.success.relay', {
          nodeid: action.payload.nodemac,
        }),
        error: i18n.t('toast.create.failure.relay', {
          nodeid: action.payload.nodemac,
        }),
      },
    })

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'post',
      `/nodes/${action.payload.netid}/${action.payload.nodemac}/createrelay`,
      {relayaddrs: action.payload.payload.ranges},
      {}
    )

    yield put(createRelayNode['success'](response.data))
  } catch (e: unknown) {
    yield put(createRelayNode['failure'](e as Error))
  }
}

function* handleDeleteRelayNodeRequest(
  action: ReturnType<typeof deleteRelayNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteRelayNode['success'],
      error: deleteRelayNode['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeid: action.payload.nodeid,
        }),
        success: i18n.t('toast.delete.success.ingress', {
          nodeid: action.payload.nodeid,
        }),
        error: i18n.t('toast.delete.failure.ingress', {
          nodeid: action.payload.nodeid,
        }),
      },
    })

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'delete',
      `/nodes/${action.payload.netid}/${action.payload.nodemac}/deleterelay`,
      {}
    )

    yield put(deleteRelayNode['success'](response.data))
  } catch (e: unknown) {
    yield put(deleteRelayNode['failure'](e as Error))
  }
}

function* handleCreateIngressNodeRequest(
  action: ReturnType<typeof createIngressNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createIngressNode['success'],
      error: createIngressNode['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeid: action.payload.nodemac,
        }),
        success: i18n.t('toast.create.success.ingress', {
          nodeid: action.payload.nodemac,
        }),
        error: i18n.t('toast.create.failure.ingress', {
          nodeid: action.payload.nodemac,
        }),
      },
    })

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'post',
      `/nodes/${action.payload.netid}/${action.payload.nodemac}/createingress`,
      {},
      {}
    )

    yield put(createIngressNode['success'](response.data))
  } catch (e: unknown) {
    yield put(createIngressNode['failure'](e as Error))
  }
}

function* handleDeleteIngressNodeRequest(
  action: ReturnType<typeof deleteIngressNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteIngressNode['success'],
      error: deleteIngressNode['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeid: action.payload.nodeid,
        }),
        success: i18n.t('toast.delete.success.ingress', {
          nodeid: action.payload.nodeid,
        }),
        error: i18n.t('toast.delete.failure.ingress', {
          nodeid: action.payload.nodeid,
        }),
      },
    })

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'delete',
      `/nodes/${action.payload.netid}/${action.payload.nodeid}/deleteingress`,
      {}
    )

    yield put(deleteIngressNode['success'](response.data))
  } catch (e: unknown) {
    yield put(deleteIngressNode['failure'](e as Error))
  }
}

function* handleGetExternalClientRequest(
  action: ReturnType<typeof getExternalClients['request']>
) {
  try {
    const response: AxiosResponse<Array<ExternalClient> | null> =
      yield apiRequestWithAuthSaga('get', `/extclients`, {})

    yield put(getExternalClients['success'](response.data))
  } catch (e: unknown) {
    yield put(getExternalClients['failure'](e as Error))
  }
}

function* handleGetExternalClientConfRequest(
  action: ReturnType<typeof getExternalClientConf['request']>
) {
  try {
    const response: AxiosResponse<string> =
      yield apiRequestWithAuthSaga('get', `/extclients/${action.payload.netid}/${action.payload.clientid}/${action.payload.type}`, 
        {headers: {
          'authorization': `Bearer ${action.payload.token}`
        }}
      )

    yield put(getExternalClientConf['success']({
      filename: action.payload.clientid,
      data: response.data,
      type: action.payload.type,
    }))
  } catch (e: unknown) {
    yield put(getExternalClientConf['failure'](e as Error))
  }
}

function* handleCreateExternalClientRequest(
  action: ReturnType<typeof createExternalClient['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createExternalClient['success'],
      error: createExternalClient['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeid: action.payload.nodeid,
        }),
        success: i18n.t('toast.create.success.extclient', {
          nodeid: action.payload.nodeid,
        }),
        error: i18n.t('toast.create.failure.extclient', {
          nodeid: action.payload.nodeid,
        }),
      },
    })

    const response: AxiosResponse<void> = yield apiRequestWithAuthSaga(
      'post',
      `/extclients/${action.payload.netid}/${action.payload.nodeid}`,
      {},
      {}
    )

    yield put(createExternalClient['success'](response.data))
    yield put(getExternalClients.request({token: ''}))
  } catch (e: unknown) {
    yield put(createExternalClient['failure'](e as Error))
  }
}

function* handleDeleteExternalClientRequest(
  action: ReturnType<typeof deleteExternalClient['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteExternalClient['success'],
      error: deleteExternalClient['failure'],
      params: {
        pending: i18n.t('deleteExternalClientToastRequest', {
          nodeName: action.payload.clientName,
        }),
        success: i18n.t('deleteExternalClientToastSuccess', {
          nodeName: action.payload.clientName,
        }),
        error: i18n.t('deleteExternalClientToastError', {
          nodeName: action.payload.clientName,
        }),
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/extclients/${action.payload.netid}/${action.payload.clientName}`,
      {}
    )

    yield put(deleteExternalClient['success']())
  } catch (e: unknown) {
    yield put(deleteExternalClient['failure'](e as Error))
  }
}

function* handleCreateEgressNodeRequest(
  action: ReturnType<typeof createEgressNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createEgressNode['success'],
      error: createEgressNode['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeName: action.payload.nodeid,
        }),
        success: i18n.t('toast.create.success.egress', {
          nodeName: action.payload.nodeid,
        }),
        error: i18n.t('toast.create.failure.egress', {
          nodeName: action.payload.nodeid,
        }),
      },
    })

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'post',
      `/nodes/${action.payload.netid}/${action.payload.nodeid}/creategateway`,
      action.payload.payload,
      {}
    )

    yield put(createEgressNode['success'](response.data))
  } catch (e: unknown) {
    yield put(createEgressNode['failure'](e as Error))
  }
}

function* handleDeleteEgressNodeRequest(
  action: ReturnType<typeof deleteEgressNode['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteEgressNode['success'],
      error: deleteEgressNode['failure'],
      params: {
        pending: i18n.t('common.pending', {
          nodeName: action.payload.nodeMac,
        }),
        success: i18n.t('toast.delete.success.egress', {
          nodeName: action.payload.nodeMac,
        }),
        error: i18n.t('toast.delete.failure.egress', {
          nodeName: action.payload.nodeMac,
        }),
      },
    })

    const response: AxiosResponse<NodePayload> = yield apiRequestWithAuthSaga(
      'delete',
      `/nodes/${action.payload.netid}/${action.payload.nodeMac}/deletegateway`,
      {}
    )

    yield put(deleteEgressNode['success'](response.data))
  } catch (e: unknown) {
    yield put(deleteEgressNode['failure'](e as Error))
  }
}

// get external client qr
// get http://hakeee.duckdns.org:8081/api/extclients/testnet/fun-hulk
// response content type png

export function* saga() {
  yield all([
    takeEvery(getType(getNodes['request']), handleGetNodesRequest),
    takeEvery(getType(login['success']), handleLoginSuccess),
    takeEvery(getType(updateNode['request']), handleUpdateNodeRequest),
    takeEvery(getType(deleteNode['request']), handleDeleteNodeRequest),
    takeEvery(
      getType(createIngressNode['request']),
      handleCreateIngressNodeRequest
    ),
    takeEvery(
      getType(deleteIngressNode['request']),
      handleDeleteIngressNodeRequest
    ),
    takeEvery(
      getType(getExternalClients['request']),
      handleGetExternalClientRequest
    ),
    takeEvery(
      getType(createExternalClient['request']),
      handleCreateExternalClientRequest
    ),
    takeEvery(
      getType(deleteExternalClient['request']),
      handleDeleteExternalClientRequest
    ),
    takeEvery(
      getType(createEgressNode['request']),
      handleCreateEgressNodeRequest
    ),
    takeEvery(
      getType(deleteEgressNode['request']),
      handleDeleteEgressNodeRequest
    ),
    takeEvery(
      getType(createRelayNode['request']),
      handleCreateRelayNodeRequest
    ),
    takeEvery(
      getType(deleteRelayNode['request']),
      handleDeleteRelayNodeRequest
    ),
    takeEvery(
      getType(getExternalClientConf['request']),
      handleGetExternalClientConfRequest
    ),
    handleLoginSuccess(),
  ])
}
