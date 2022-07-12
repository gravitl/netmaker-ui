import { all, fork, put, takeEvery, select } from 'redux-saga/effects'
import {
  getUserGroups,
  deleteUserGroup,
  createUserGroup,
} from './actions'
import { AxiosResponse } from 'axios'
import { UserGroups } from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import { getType } from 'typesafe-actions'
import { getToken } from '../auth/selectors'

const userGroups = 'usergroups'

function* handleLoginSuccess() {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  if (token) {
    yield put(getUserGroups.request())
  }
}

function* handleGetUserGroupsRequest(
  action: ReturnType<typeof getUserGroups['request']>
) {
  try {
    const response: AxiosResponse<UserGroups> =
      yield apiRequestWithAuthSaga(
        'get', 
        `/${userGroups}`,
        {}
      )
    yield put(getUserGroups['success'](response.data))
  } catch (e: unknown) {
    yield put(getUserGroups['failure'](e as Error))
  }
}

function* handleDeleteUserGroup(
  action: ReturnType<typeof deleteUserGroup['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteUserGroup['success'],
      error: deleteUserGroup['failure'],
      params: {
        pending: i18n.t('common.pending', {}),
        success: i18n.t('toast.delete.success.usergroups', {}),
        error: e => `${i18n.t('toast.delete.failure.usergroups')} : ${e.response.data.Message}`,
      },
    })

    yield apiRequestWithAuthSaga(
      'delete',
      `/${userGroups}/${action.payload.groupName}`,
      {},
    )

    yield put(deleteUserGroup['success']({...action.payload}))
  } catch (e: unknown) {
    yield put(deleteUserGroup['failure'](e as Error))
  }
}

function* handleCreateUserGroup(
  action: ReturnType<typeof createUserGroup['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createUserGroup['success'],
      error: createUserGroup['failure'],
      params: {
        pending: i18n.t('common.pending', {}),
        success: i18n.t('toast.delete.success.usergroups', {}),
        error: e => `${i18n.t('toast.delete.failure.usergroups')} : ${e.response.data.Message}`,
      },
    })

    yield apiRequestWithAuthSaga(
      'post',
      `/${userGroups}/${action.payload.groupName}`,
      {},
      {},
    )

    yield put(createUserGroup['success']({...action.payload}))
  } catch (e: unknown) {
    yield put(createUserGroup['failure'](e as Error))
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(getUserGroups['request']), handleGetUserGroupsRequest),
    takeEvery(getType(deleteUserGroup['request']), handleDeleteUserGroup),  
    takeEvery(getType(createUserGroup['request']), handleCreateUserGroup),
    handleLoginSuccess(),
  ])
}
