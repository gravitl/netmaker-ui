import { all, fork, put, takeEvery } from 'redux-saga/effects'
import {
  createEnrollmentKey,
  deleteEnrollmentKey,
  getEnrollmentKeys,
} from './actions'
import { AxiosResponse } from 'axios'
import { EnrollmentKey } from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import { getType } from 'typesafe-actions'

function* handleGetEnrollmentKeysRequest(
  action: ReturnType<typeof getEnrollmentKeys['request']>
) {
  try {
    const response: AxiosResponse<EnrollmentKey[]> = yield apiRequestWithAuthSaga(
      'get',
      `/v1/enrollment-keys`,
      {}
    )
    yield put(getEnrollmentKeys['success'](response.data))
  } catch (e: unknown) {
    yield put(getEnrollmentKeys['failure'](e as Error))
  }
}

function* handleDeleteEnrollmentKeyRequest(
  action: ReturnType<typeof deleteEnrollmentKey['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteEnrollmentKey['success'],
      error: deleteEnrollmentKey['failure'],
      params: {
        pending: i18n.t('common.pending', {
          id: action.payload.id,
        }),
        success: i18n.t('toast.delete.success.enrollmentkey', {
          id: action.payload.id,
        }),
        error: (e) =>
          `${i18n.t('toast.delete.failure.enrollmentkey', {
            id: action.payload.id,
          })}: ${
            e.response?.data?.Message || i18n.t('toast.delete.failure.enrollmentkey')
          }`,
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/v1/enrollment-keys/${action.payload.id}`,
      {}
    )

    yield put(deleteEnrollmentKey['success']({ id: action.payload.id }))
  } catch (e: unknown) {
    yield put(deleteEnrollmentKey['failure'](e as Error))
  }
}

function* handleCreateEnrollmentKeyRequest(
  action: ReturnType<typeof createEnrollmentKey['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createEnrollmentKey['success'],
      error: createEnrollmentKey['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: i18n.t('toast.create.success.enrollmentkeys'),
        error: (e) =>
          `${i18n.t('toast.create.failure.enrollmentkeys')}: ${
            e.response.data.Message || ''
          }`,
      },
    })

    const response: AxiosResponse<EnrollmentKey> = yield apiRequestWithAuthSaga(
      'post',
      `/v1/enrollment-keys`,
      action.payload,
      {}
    )

    yield put(createEnrollmentKey['success'](response.data))
  } catch (e: unknown) {
    yield put(createEnrollmentKey['failure'](e as Error))
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(getEnrollmentKeys['request']), handleGetEnrollmentKeysRequest),    
    takeEvery(getType(deleteEnrollmentKey['request']), handleDeleteEnrollmentKeyRequest),
    takeEvery(
      getType(createEnrollmentKey['request']),
      handleCreateEnrollmentKeyRequest
    ),
  ])
}
