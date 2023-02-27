import { produce } from 'immer'
import { createReducer } from 'typesafe-actions'
import {
  getEnrollmentKeys,
  createEnrollmentKey,
  deleteEnrollmentKey,
  clearEnrollmentKeys,
} from './actions'
import { EnrollmentKey } from '.'

export const reducer = createReducer({
  isProcessing: false,
  enrollmentKeys: [] as EnrollmentKey[],
})
  // reset store actions
  .handleAction(clearEnrollmentKeys, (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      draftState.enrollmentKeys = []
    })
  )

  // get keys actions
  .handleAction(getEnrollmentKeys['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(getEnrollmentKeys['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false

      const keys = payload.payload
      draftState.enrollmentKeys = keys
    })
  )
  .handleAction(getEnrollmentKeys['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )

  // delete keys actions
  .handleAction(deleteEnrollmentKey['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(deleteEnrollmentKey['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false

      const newStateKeys: EnrollmentKey[] = JSON.parse(JSON.stringify(state.enrollmentKeys))
      const deletedKeyVal = payload.payload.id
      newStateKeys.splice(
        newStateKeys.findIndex((k: EnrollmentKey) => k.value === deletedKeyVal),
        1
      )
      draftState.enrollmentKeys = newStateKeys
    })
  )
  .handleAction(deleteEnrollmentKey['failure'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )

  // create keys actions
  .handleAction(createEnrollmentKey['request'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = true
    })
  )
  .handleAction(createEnrollmentKey['success'], (state, payload) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
      const newStateKeys: EnrollmentKey[] = (JSON.parse(JSON.stringify(state.enrollmentKeys)) as EnrollmentKey[]).concat(payload.payload)
      draftState.enrollmentKeys = newStateKeys
    })
  )
  .handleAction(createEnrollmentKey['failure'], (state, _) =>
    produce(state, (draftState) => {
      draftState.isProcessing = false
    })
  )
