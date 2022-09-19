import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import {
  getUserGroups,
  deleteUserGroup,
  createUserGroup,
  getNetworkUsers,
  updateNetworkUser,
  getNetworkUserData,
  proCreateAccessKey,
} from './actions'
import { AxiosResponse } from 'axios'
import { NetworksUsersMap, NetworkUserDataMapPayload, UserGroups } from './types'
import { apiRequestWithAuthSaga } from '../api/saga'
import { generatorToastSaga } from '../toast/saga'
import { i18n } from '../../../i18n/i18n'
import { getType } from 'typesafe-actions'
import { getServerConfig } from '../server/selectors'

const userGroups = 'usergroups'

function* handleGetUserGroupsRequest(
  action: ReturnType<typeof getUserGroups['request']>
) {
  try {
    const serverConfig: ReturnType<typeof getServerConfig> = yield select(getServerConfig)

    if (serverConfig.IsEE) {
      const response: AxiosResponse<UserGroups> = yield apiRequestWithAuthSaga(
        'get',
        `/${userGroups}`,
        {}
      )
      yield put(getUserGroups['success'](response.data))
    }
  } catch (e: unknown) {
    yield put(getUserGroups['failure'](e as Error))
  }
}

function* handleDeleteUserGroup(
  action: ReturnType<typeof deleteUserGroup['request']>
) {
  try {
    const serverConfig: ReturnType<typeof getServerConfig> = yield select(getServerConfig)

    if (serverConfig.IsEE) {
      yield fork(generatorToastSaga, {
        success: deleteUserGroup['success'],
        error: deleteUserGroup['failure'],
        params: {
          pending: i18n.t('common.pending', {}),
          success: i18n.t('toast.delete.success.usergroups', {}),
          error: (e) =>
            `${i18n.t('toast.delete.failure.usergroups')} : ${
              e.response.data.Message
            }`,
        },
      })

      yield apiRequestWithAuthSaga(
        'delete',
        `/${userGroups}/${action.payload.groupName}`,
        {}
      )

      yield put(deleteUserGroup['success']({ ...action.payload }))
    }
  } catch (e: unknown) {
    yield put(deleteUserGroup['failure'](e as Error))
  }
}

function* handleCreateUserGroup(
  action: ReturnType<typeof createUserGroup['request']>
) {
  try {
    const serverConfig: ReturnType<typeof getServerConfig> = yield select(getServerConfig)

    if (serverConfig.IsEE) {
      yield fork(generatorToastSaga, {
        success: createUserGroup['success'],
        error: createUserGroup['failure'],
        params: {
          pending: i18n.t('common.pending', {}),
          success: i18n.t('toast.create.success.usergroup', {}),
          error: (e) =>
            `${i18n.t('toast.create.failure.usergroup')} : ${
              e.response.data.Message
            }`,
        },
      })

      yield apiRequestWithAuthSaga(
        'post',
        `/${userGroups}/${action.payload.groupName}`,
        {},
        {}
      )

      yield put(createUserGroup['success']({ ...action.payload }))
    }
  } catch (e: unknown) {
    yield put(createUserGroup['failure'](e as Error))
  }
}

function* handleGetNetworkUserData(
  action: ReturnType<typeof getNetworkUserData['request']>
) {
  try {
    const serverConfig: ReturnType<typeof getServerConfig> = yield select(getServerConfig)

    if (serverConfig.IsEE) {
      const response: AxiosResponse<NetworkUserDataMapPayload> =
        yield apiRequestWithAuthSaga('get', `/networkusers/data/${action.payload.networkUserID}/me`, {})
      yield put(getNetworkUserData['success'](response.data))
    }
  } catch (e: unknown) {
    yield put(getNetworkUserData['failure'](e as Error))
  }
}

function* handleGetNetworkUsers(
  action: ReturnType<typeof getNetworkUsers['request']>
) {
  try {
    const serverConfig: ReturnType<typeof getServerConfig> = yield select(getServerConfig)

    if (serverConfig.IsEE) {
      const response: AxiosResponse<NetworksUsersMap> =
        yield apiRequestWithAuthSaga('get', '/networkusers', {})
      yield put(getNetworkUsers['success'](response.data))
    }
  } catch (e: unknown) {
    yield put(getNetworkUsers['failure'](e as Error))
  }
}

// function* handleDeleteNetworkUser(
//   action: ReturnType<typeof deleteNetworkUser['request']>
// ) {
//   try {
//     yield fork(generatorToastSaga, {
//       success: deleteNetworkUser['success'],
//       error: deleteNetworkUser['failure'],
//       params: {
//         pending: i18n.t('common.pending', {}),
//         success: i18n.t('toast.delete.success.networkuser', {}),
//         error: (e) =>
//           `${i18n.t('toast.delete.failure.networkuser')} : ${
//             e.response.data.Message
//           }`,
//       },
//     })

//     yield apiRequestWithAuthSaga(
//       'delete',
//       `/networkusers/${action.payload.networkName}/${action.payload.networkUserID}`,
//       {}
//     )

//     yield put(deleteNetworkUser['success']({ ...action.payload }))
//   } catch (e: unknown) {
//     yield put(deleteNetworkUser['failure'](e as Error))
//   }
// }

function* handleUpdateNetworkUser(
  action: ReturnType<typeof updateNetworkUser['request']>
) {
  try {
    const serverConfig: ReturnType<typeof getServerConfig> = yield select(getServerConfig)

    if (serverConfig.IsEE) {
      yield fork(generatorToastSaga, {
        success: updateNetworkUser['success'],
        error: updateNetworkUser['failure'],
        params: {
          pending: i18n.t('common.pending', {}),
          success: i18n.t('toast.update.success.networkuser', {}),
          error: (e) =>
            `${i18n.t('toast.update.failure.networkuser', {})} : ${
              e.response.data.Message
            }`,
        },
      })

      yield apiRequestWithAuthSaga(
        'put',
        `/networkusers/${action.payload.networkName}`,
        { ...action.payload.networkUser },
        {}
      )

      yield put(updateNetworkUser['success'](action.payload))
    }
  } catch (e: unknown) {
    yield put(updateNetworkUser['failure'](e as Error))
  }
}

function* handleProCreateAccessKeyRequest(
  action: ReturnType<typeof proCreateAccessKey['request']>
) {
  try {
    yield fork(generatorToastSaga, {
      success: proCreateAccessKey['success'],
      error: proCreateAccessKey['failure'],
      params: {
        pending: i18n.t('common.pending'),
        success: i18n.t('toast.create.success.accesskey'),
        error: (error) =>
          `${i18n.t('toast.create.failure.accesskey')}\n${
            error.response.data.Message
          }`,
      },
    })

    action.payload.newAccessKey.uses = Number(action.payload.newAccessKey.uses)

    const response: AxiosResponse = yield apiRequestWithAuthSaga(
      'post',
      `/networks/${action.payload.netid}/keys`,
      action.payload.newAccessKey,
      {}
    )

    yield put(proCreateAccessKey['success']({ 
      netid: action.payload.netid,
      newAccessKey: response.data, 
    }))
  } catch (e: unknown) {
    yield put(proCreateAccessKey['failure'](e as Error))
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(getUserGroups['request']), handleGetUserGroupsRequest),
    takeEvery(getType(deleteUserGroup['request']), handleDeleteUserGroup),
    takeEvery(getType(createUserGroup['request']), handleCreateUserGroup),
    takeEvery(getType(getNetworkUsers['request']), handleGetNetworkUsers),
    takeEvery(getType(updateNetworkUser['request']), handleUpdateNetworkUser),
    takeEvery(getType(getNetworkUserData['request']), handleGetNetworkUserData),
    takeEvery(getType(proCreateAccessKey['request']), handleProCreateAccessKeyRequest),
  ])
}
