import { produce } from "immer";
import * as ls from 'local-storage'
import { createReducer } from "typesafe-actions";
import { USER_KEY } from "../../../config";
import { login, logout, setUser } from "./actions";
import { LocalStorageUserKeyValue } from "./types";

const initialValues = ls.get<LocalStorageUserKeyValue | undefined>(USER_KEY)

export const reducer = createReducer({
  token: initialValues?.token,
  user: initialValues?.user,
  isLoggingIn: false
})
  .handleAction(setUser, (state, action) =>
    produce(state, (draftState) => {
      draftState.user = action.payload;
    })
  )
  .handleAction(login["request"], (state, action) =>
    produce(state, (draftState) => {
      draftState.isLoggingIn = true
    })
  )
  .handleAction(login["success"], (state, action) =>
    produce(state, (draftState) => {
      draftState.user = action.payload.user;
      draftState.token = action.payload.token;
      draftState.isLoggingIn = false

      ls.set<LocalStorageUserKeyValue>(USER_KEY, {
        token: action.payload.token,
        user: action.payload.user
      })
    })
  )
  .handleAction(login["failure"], (state, action) =>
    produce(state, (draftState) => {
      draftState.user = undefined;
      draftState.token = undefined;
      draftState.isLoggingIn = false
      
      ls.set<void>(USER_KEY, undefined)
    })
  )
  .handleAction(logout, (state, _) =>
    produce(state, (draftState) => {
      draftState.user = undefined;
      draftState.token = undefined;

      ls.set<void>(USER_KEY, undefined)
    })
  )
