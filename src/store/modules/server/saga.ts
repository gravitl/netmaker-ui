import { all, put, select, takeEvery } from 'redux-saga/effects'
import { getExtMetrics, getMetrics, getNodeMetrics, getServerConfig, getServerLogs } from './actions'
import { login } from '../auth/actions'
import { getToken } from '../auth/selectors'
import { getType } from 'typesafe-actions'
import { AxiosResponse } from 'axios'
import { apiRequestWithAuthSaga } from '../api/saga'
import { getNetworks } from '../network/selectors'
import { ExtMetrics } from '~store/types'
import { getNetworks as getNets } from '../network/actions'
import { getServerConfig as getSC } from '../server/selectors'

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if (token)
    yield put(
      getServerConfig.request({
        token,
      })
    )
}

function* handleGetServerConfigRequest(
  _: ReturnType<typeof getServerConfig['request']>
) {
  try {
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'get',
      '/server/getconfig',
      {}
    )
    yield put(getServerConfig['success'](response.data))
  } catch (e: unknown) {
    yield put(getServerConfig['failure'](e as Error))
  }
}

function* handleGetServerLogsRequest(
  _: ReturnType<typeof getServerLogs['request']>
) {
  try {
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'get',
      '/logs',
      {}
    )
    yield put(getServerLogs['success'](response.data))
  } catch (e: unknown) {
    yield put(getServerLogs['failure'](e as Error))
  }
}

function* handleGetAllMetrics(
  action: ReturnType<typeof getMetrics['request']>
) {
  try {
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'get',
      !!action.payload ? `/metrics/${action.payload}` : '/metrics',
      {}
    )
    yield put(getMetrics['success'](response.data))
  } catch (e: unknown) {
    yield put(getMetrics['failure'](e as Error))
  }
}

function* handleGetAllExtMetrics(
  action: ReturnType<typeof getExtMetrics['request']>
) {
  try {
    let responseMetrics = {} as ExtMetrics
    const networks: ReturnType<typeof getNetworks> = yield select(getNetworks)
    const serverConfig: ReturnType<typeof getSC> = yield select(getSC)

    if (serverConfig.IsEE && networks && networks.length) {
      for (let i = 0; i < networks.length; i++) {
        try {
          const response: AxiosResponse = yield apiRequestWithAuthSaga(
            'get',
            `/metrics-ext/${networks[i].netid}`,
            {}
          )
          responseMetrics[networks[i].netid] = response.data
        } catch (e: unknown) {
          responseMetrics[networks[i].netid] = {}
        }
      }
    
      yield put(getExtMetrics['success'](responseMetrics))
    }
  } catch (e: unknown) {
    yield put(getExtMetrics['failure'](e as Error))
  }
}


function* handleGetNodeMetrics(
  action: ReturnType<typeof getNodeMetrics['request']>
) {
  try {
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'get',
      `/metrics/${action.payload.Network}/${action.payload.ID}`,
      {}
    )
    yield put(getNodeMetrics['success'](response.data))
  } catch (e: unknown) {
    yield put(getNodeMetrics['failure'](e as Error))
  }
}


export function* saga() {
  yield all([
    takeEvery(login['success'], handleLoginSuccess),
    takeEvery(
      getType(getServerConfig['request']),
      handleGetServerConfigRequest
    ),
    takeEvery(
      getType(getServerLogs['request']),
      handleGetServerLogsRequest
    ),
    takeEvery(
      getType(getNodeMetrics['request']),
      handleGetNodeMetrics
    ),
    takeEvery(
      getType(getMetrics['request']),
      handleGetAllMetrics
    ),
    takeEvery(
      getType(getNets['success']),
      handleGetAllExtMetrics,
    ),
    takeEvery(
      getType(getExtMetrics['request']),
      handleGetAllExtMetrics,
    ),
    handleLoginSuccess(),
  ])
}
