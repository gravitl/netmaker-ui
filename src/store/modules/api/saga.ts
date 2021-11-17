import { select, all, call, put } from 'redux-saga/effects'
import { produce } from 'immer'
import { getToken, getLoggedIn } from '../auth/selectors'
import { getApi } from './selectors'
import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'
import { KeysOfAxios, ApiRequestSignatureGenerator } from './types'
import { logout } from '../auth/actions'
import { i18n } from '../../../i18n/i18n'

export function* apiRequestSaga<K extends KeysOfAxios, R>(
  method: K,
  ...params: Required<Parameters<AxiosInstance[K]>>
) {
  const api: ReturnType<typeof getApi> = yield select(getApi)
  return (yield call<AxiosInstance[K]>(
    api[method],
    ...(params as unknown as Parameters<AxiosInstance[K]>)
  )) as AxiosResponse<R>
}

export function* apiRequestWithAuthSaga<K extends KeysOfAxios, R>(
  method: K,
  ...params: Required<Parameters<AxiosInstance[K]>>
) {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  const isLoggedIn: boolean = yield select(getLoggedIn)
  if(!isLoggedIn && !!token) {
    yield put(logout())
    throw new Error(i18n.t('error.tokenexpire'))
  }
  let config = params.pop() as AxiosRequestConfig
  config = produce(config, (draft) => {
    draft.headers = draft.headers ? draft.headers : {}
    draft.headers['authorization'] = `Bearer ${token}`
  })
  params.push(config)
  return (yield call<ApiRequestSignatureGenerator<K, R>>(
    apiRequestSaga,
    method,
    ...params
  )) as AxiosResponse<R>
}

export function* saga() {
  yield all([])
}
