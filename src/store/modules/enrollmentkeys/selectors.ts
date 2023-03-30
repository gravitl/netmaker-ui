import { createSelector } from 'reselect'
import { RootState } from '../../reducers'

const getEnrollmentKeysState = (state: RootState) => state.enrollmentKeys

export const isProcessingEnrollmentKeys = createSelector(
  getEnrollmentKeysState,
  (hostsState) => hostsState.isProcessing
)

export const getEnrollmentKeys = createSelector(
  getEnrollmentKeysState,
  (hostsState) => hostsState.enrollmentKeys
)
