import { select, put, takeEvery, all } from "redux-saga/effects"
import { getType } from "typesafe-actions"
import { get, getAllUsers, getUser, login, getServerConfig, hasAdmin, createAdmin, createUser, deleteUser, updateUser } from "./actions"
import { getToken } from "../auth/selectors"
import { getApi } from "./selectors"
import { AxiosResponse } from "axios"
import jwtDecode from "jwt-decode"

function* handleGetRequest(action: ReturnType<typeof get["request"]>) {
  const token: ReturnType<typeof getToken> = yield select(getToken)
  const api: ReturnType<typeof getApi> = yield select(getApi)

  const headers = token ? {
    authorization: `Bearer ${token}`
  } : {}

  try {
    const response: AxiosResponse = yield api.get(action.payload.url, {
      headers
    })
    yield put(get["success"](response))
  } catch (e: unknown) {
    yield put(get["failure"](e as Error))
  }
}

function* handleGetAllUsersRequest(action: ReturnType<typeof getAllUsers["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.get("/users", {
      headers: {
        authorization: `Bearer ${action.payload.token}`
      }
    })
    console.log(response.data)
    yield put(getAllUsers["success"](response.data))
  } catch (e: unknown) {
    yield put(getAllUsers["failure"](e as Error))
  }
}

function* handleGetUserRequest(action: ReturnType<typeof getUser["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.get("", {
      headers: {
        authorization: `Bearer ${action.payload.token}`
      }
    })
    yield put(getUser["success"](response))
  } catch (e: unknown) {
    yield put(getUser["failure"](e as Error))
  }
}

function* handleLoginRequest(action: ReturnType<typeof login["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.post('/users/adm/authenticate', action.payload)
    const decoded: {
      IsAdmin: boolean
      UserName: string
      Networks: unknown
      exp: number
    } = jwtDecode(response.data.Response.AuthToken)
    yield put(login["success"]({
      token: response.data.Response.AuthToken,
      user: {
        "isAdmin": decoded.IsAdmin,
        "name": decoded.UserName,
        "exp": decoded.exp
    }}))
  } catch (e: unknown) {
    yield put(login["failure"](e as Error))
  }
}

function* handleGetServerConfigRequest(action: ReturnType<typeof getServerConfig["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.get('/server/getconfig', {
      headers: {
        authorization: `Bearer ${action.payload.token}`
      }
    })
    yield put(getServerConfig["success"](response.data))
  } catch (e: unknown) {
    yield put(getServerConfig["failure"](e as Error))
  }
}

function* handleHasAdminRequest(action: ReturnType<typeof hasAdmin["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.get("/users/adm/hasadmin")
    yield put(hasAdmin["success"](response.status === 200))
  } catch (e: unknown) {
    yield put(hasAdmin["failure"](e as Error))
  }
}

function* handleCreateAdminRequest(action: ReturnType<typeof createAdmin["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.post("/users/adm/createadmin", action.payload)
    console.log(response.data)
    yield put(createAdmin["success"](response.data))
  } catch (e: unknown) {
    yield put(createAdmin["failure"](e as Error))
  }
}

function* handleCreateUserRequest(action: ReturnType<typeof createUser["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.post(`/users/${action.payload.username}`, 
    {
      username: action.payload.username, 
      password: action.payload.password, 
      networks: action.payload.networks
    }, 
    {
      headers: {
        authorization: `Bearer ${action.payload.token}`,
        'Content-type': 'application/json'
      }
    })
    console.log(response.data)
    yield put(createUser["success"](response.data))
  } catch (e: unknown) {
    yield put(createUser["failure"](e as Error))
  }
}

function* handleDeleteUserRequest(action: ReturnType<typeof deleteUser["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.delete(`/users/${action.payload.username}`, {
      headers: {
        authorization: `Bearer ${action.payload.token}`
      }
    })
    console.log(response.data)
    yield put(deleteUser["success"](response.data))
  } catch (e: unknown) {
    yield put(deleteUser["failure"](e as Error))
  }
}

function* handleUpdateUserRequest(action: ReturnType<typeof updateUser["request"]>) {
  const api: ReturnType<typeof getApi> = yield select(getApi)

  try {
    const response: AxiosResponse = yield api.put(`/users/${action.payload.oldUsername}`, 
    {
      username: action.payload.newUsername, 
      password: action.payload.password
    }, 
    {
      headers: {
        authorization: `Bearer ${action.payload.token}`,
        'Content-type': 'application/json'
      }
    })
    console.log(response.data)
    yield put(updateUser["success"](response.data))
  } catch (e: unknown) {
    yield put(updateUser["failure"](e as Error))
  }
}

export function* saga() {
  yield all([
    takeEvery(getType(get["request"]), handleGetRequest),
    takeEvery(getType(getAllUsers["request"]), handleGetAllUsersRequest),
    takeEvery(getType(getUser["request"]), handleGetUserRequest),
    takeEvery(getType(login["request"]), handleLoginRequest),
    takeEvery(getType(getServerConfig["request"]), handleGetServerConfigRequest),
    takeEvery(getType(hasAdmin["request"]), handleHasAdminRequest),
    takeEvery(getType(createAdmin["request"]), handleCreateAdminRequest),
    takeEvery(getType(createUser["request"]), handleCreateUserRequest),
    takeEvery(getType(deleteUser["request"]), handleDeleteUserRequest),
    takeEvery(getType(updateUser["request"]), handleUpdateUserRequest),
  ])
}
