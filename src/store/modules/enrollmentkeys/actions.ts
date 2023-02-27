import { createAction, createAsyncAction } from 'typesafe-actions'
import {
  GetEnrollmentKeysPayload,
  DeleteEnrollmentKeyPayload,
  CreateEnrollmentKeyPayload,
} from '.'

export const getEnrollmentKeys = createAsyncAction(
  'EnrollmentKeys_getEnrollmentKeys_Request',
  'EnrollmentKeys_getEnrollmentKeys_Success',
  'EnrollmentKeys_getEnrollmentKeys_Failure'
)<GetEnrollmentKeysPayload['Request'], GetEnrollmentKeysPayload['Response'], Error>()

export const deleteEnrollmentKey = createAsyncAction(
  'EnrollmentKeys_deleteEnrollmentKey_Request',
  'EnrollmentKeys_deleteEnrollmentKey_Success',
  'EnrollmentKeys_deleteEnrollmentKey_Failure'
)<DeleteEnrollmentKeyPayload['Request'], DeleteEnrollmentKeyPayload['Response'], Error>()

export const createEnrollmentKey = createAsyncAction(
  'EnrollmentKeys_createEnrollmentKey_Request',
  'EnrollmentKeys_createEnrollmentKey_Success',
  'EnrollmentKeys_createEnrollmentKey_Failure'
)<CreateEnrollmentKeyPayload['Request'], CreateEnrollmentKeyPayload['Response'], Error>()

export const clearEnrollmentKeys = createAction('EnrollmentKeys_clearEnrollmentKeys')<string>()
