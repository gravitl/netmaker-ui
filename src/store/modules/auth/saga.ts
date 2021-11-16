import { AxiosResponse } from 'axios'
import { all, call, put, select, takeEvery, fork } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { User } from './types'
import { apiRequestWithAuthSaga, apiRequestSaga } from '../api/saga'
import {
  getAllUsers,
  getUser,
  login,
  hasAdmin,
  createAdmin,
  createUser,
  deleteUser,
  updateUser,
  updateUserNetworks,
} from './actions'
import { authSelectors } from '~store/selectors'
import { getHistory } from '../router/selectors'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'

function* handleGetAllUsersRequest(
  action: ReturnType<typeof getAllUsers['request']>
) {
  try {
    const response: AxiosResponse<Array<User>> = yield apiRequestWithAuthSaga(
      'get',
      '/users',
      {}
    )
    yield put(getAllUsers['success'](response.data))
  } catch (e: unknown) {
    yield put(getAllUsers['failure'](e as Error))
  }
}

function* handleGetUserRequest(action: ReturnType<typeof getUser['request']>) {
  try {
    const response: AxiosResponse = yield apiRequestWithAuthSaga('get', '', {})
    yield put(getUser['success'](response.data))
  } catch (e: unknown) {
    yield put(getUser['failure'](e as Error))
  }
}

function* handleLoginRequest(action: ReturnType<typeof login['request']>) {
  try {
    yield fork(generatorToastSaga, {
      success: login['success'],
      error: login['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.login.success')} : ${action.payload.username}`,
        error: `${i18n.t('toast.login.failure')} : ${action.payload.username}`,
      },
    })
    const response: AxiosResponse = yield apiRequestSaga(
      'post',
      '/users/adm/authenticate',
      action.payload,
      {}
    )
    yield put(
      login['success']({
        token: response.data.Response.AuthToken,
      })
    )
  } catch (e: unknown) {
    yield put(login['failure'](e as Error))
  }
}

function* handleHasAdminRequest(
  action: ReturnType<typeof hasAdmin['request']>
) {
  try {
    const response: AxiosResponse = yield apiRequestSaga(
      'get',
      '/users/adm/hasadmin',
      {}
    )
    yield put(hasAdmin['success'](response.status === 200 && response.data))
  } catch (e: unknown) {
    yield put(hasAdmin['failure'](e as Error))
  }
}

function* handleCreateAdminRequest(
  action: ReturnType<typeof createAdmin['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createAdmin['success'],
      error: createAdmin['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.create.success.admin')} : ${action.payload.username}`,
        error: `${i18n.t('toast.create.failure.admin')} : ${action.payload.username}`,
      },
    })
    const response: AxiosResponse = yield apiRequestSaga(
      'post',
      '/users/adm/createadmin',
      action.payload,
      {}
    )
    yield put(createAdmin['success'](response.data))
  } catch (e: unknown) {
    yield put(createAdmin['failure'](e as Error))
  }
}

function* handleCreateUserRequest(
  action: ReturnType<typeof createUser['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: createUser['success'],
      error: createUser['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.create.success.user')} : ${action.payload.username}`,
        error: `${i18n.t('toast.create.failure.user')} : ${action.payload.username}`,
      },
    })
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'post',
      `/users/${action.payload.username}`,
      {
        username: action.payload.username,
        password: action.payload.password,
        networks: action.payload.networks,
        isadmin: action.payload.isadmin,
      },
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    )

    yield put(createUser['success'](response.data))

    const history: ReturnType<typeof getHistory> = yield select(getHistory)
    history?.push('/users')
  } catch (e: unknown) {
    yield put(createUser['failure'](e as Error))
  }
}

function* handleDeleteUserRequest(
  action: ReturnType<typeof deleteUser['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: deleteUser['success'],
      error: deleteUser['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.delete.success.user')} : ${action.payload.username}`,
        error: `${i18n.t('toast.delete.failure.user')} : ${action.payload.username}`,
      },
    })
    yield apiRequestWithAuthSaga(
      'delete',
      `/users/${action.payload.username}`,
      {}
    )

    yield put(deleteUser['success'](action.payload))
  } catch (e: unknown) {
    yield put(deleteUser['failure'](e as Error))
  }
}

function* handleUpdateUserRequest({
  payload,
}: ReturnType<typeof updateUser['request']>) {
  try {
    yield fork(generatorToastSaga, {
      success: updateUser['success'],
      error: updateUser['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.update.success.user')} : ${payload.username}`,
        error: `${i18n.t('toast.update.failure.user')} : ${payload.username}`,
      },
    })
    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'put',
      `/users/${payload.username}`,
      payload,
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    )

    yield put(updateUser['success'](response.data))
  } catch (e: unknown) {
    yield put(updateUser['failure'](e as Error))
  }
}

function* handleUpdateUserNetworksRequest({
  payload,
}: ReturnType<typeof updateUserNetworks['request']>) {
  try {
    yield fork(generatorToastSaga, {
      success: updateUserNetworks['success'],
      error: updateUserNetworks['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: `${i18n.t('toast.update.success.user')} : ${payload.username}`,
        error: `${i18n.t('toast.update.failure.user')} : ${payload.username}`,
      },
    })
    console.log('HELLO')
    yield apiRequestWithAuthSaga(
      'put',
      `/users/networks/${payload.username}`,
      payload,
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
    yield put(updateUserNetworks['success'](payload))
  } catch (e: unknown) {
    yield put(updateUserNetworks['failure'](e as Error))
  }
}

function* handleIsLoggedIn() {
  const isLoggedIn: boolean = yield select(authSelectors.getLoggedIn)

  if (isLoggedIn) {
    const token: string = yield select(authSelectors.getToken)
    yield put(
      login.success({
        token,
      })
    )
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(getAllUsers['request']), handleGetAllUsersRequest),
    takeEvery(getType(getUser['request']), handleGetUserRequest),
    takeEvery(getType(login['request']), handleLoginRequest),
    takeEvery(getType(login['success']), handleGetAllUsersRequest),
    takeEvery(getType(hasAdmin['request']), handleHasAdminRequest),
    takeEvery(getType(createAdmin['request']), handleCreateAdminRequest),
    takeEvery(getType(createUser['request']), handleCreateUserRequest),
    takeEvery(getType(deleteUser['request']), handleDeleteUserRequest),
    takeEvery(getType(updateUser['request']), handleUpdateUserRequest),
    takeEvery(
      getType(updateUserNetworks['request']),
      handleUpdateUserNetworksRequest
    ),
    call(handleHasAdminRequest, hasAdmin.request()),
    call(handleIsLoggedIn),
  ])
}
