import { createAsyncAction } from 'typesafe-actions'
import { DeleteRelayNodePayload, GetExternalClientConfPayload } from '~store/types'
import {
  DeleteNodePayload,
  CreatIngressNodePayload,
  DeleteIngressNodePayload,
  GetNodesPayload,
  CreateEgressNodePayload,
  DeleteExternalClientPayload,
  CreateExternalClientPayload,
  GetExternalClientsPayload,
  UpdateNodePayload,
  DeleteEgressNodePayload,
  CreateRelayNodePayload,
} from './types'

export const getNodes = createAsyncAction(
  'Node_getNodes_Request',
  'Node_getNodes_Success',
  'Node_getNodes_Failure'
)<GetNodesPayload['Request'], GetNodesPayload['Response'], Error>()

export const updateNode = createAsyncAction(
  'Node_updateNode_Request',
  'Node_updateNode_Success',
  'Node_updateNode_Failure'
)<UpdateNodePayload['Request'], UpdateNodePayload['Response'], Error>()

export const getExternalClients = createAsyncAction(
  'Node_getExternalClients_Request',
  'Node_getExternalClients_Success',
  'Node_getExternalClients_Failure'
)<
  GetExternalClientsPayload['Request'],
  GetExternalClientsPayload['Response'],
  Error
>()

export const getExternalClientConf = createAsyncAction(
  'Node_getExternalClientConf_Request',
  'Node_getExternalClientConf_Success',
  'Node_getExternalClientConf_Failure'
)<
  GetExternalClientConfPayload['Request'],
  GetExternalClientConfPayload['Response'],
  Error
>()

export const createExternalClient = createAsyncAction(
  'Node_createExternalClient_Request',
  'Node_createExternalClient_Success',
  'Node_createExternalClient_Failure'
)<
  CreateExternalClientPayload['Request'],
  CreateExternalClientPayload['Response'],
  Error
>()

export const deleteExternalClient = createAsyncAction(
  'Node_deleteExternalClient_Request',
  'Node_deleteExternalClient_Success',
  'Node_deleteExternalClient_Failure'
)<
  DeleteExternalClientPayload['Request'],
  DeleteExternalClientPayload['Response'],
  Error
>()

export const createRelayNode = createAsyncAction(
  'Node_createRelayNode_Request',
  'Node_createRelayNode_Success',
  'Node_createRelayNode_Failure'
)<
  CreateRelayNodePayload['Request'],
  CreateRelayNodePayload['Response'],
  Error
>()

export const deleteRelayNode = createAsyncAction(
  'Node_deleteRelayNode_Request',
  'Node_deleteRelayNode_Success',
  'Node_deleteRelayNode_Failure'
)<
  DeleteRelayNodePayload['Request'],
  DeleteRelayNodePayload['Response'],
  Error
>()

export const createEgressNode = createAsyncAction(
  'Node_createEgressNode_Request',
  'Node_createEgressNode_Success',
  'Node_createEgressNode_Failure'
)<
  CreateEgressNodePayload['Request'],
  CreateEgressNodePayload['Response'],
  Error
>()

export const deleteEgressNode = createAsyncAction(
  'Node_deleteEgressNode_Request',
  'Node_deleteEgressNode_Success',
  'Node_deleteEgressNode_Failure'
)<
  DeleteEgressNodePayload['Request'],
  DeleteEgressNodePayload['Response'],
  Error
>()

export const deleteNode = createAsyncAction(
  'Node_deleteNode_Request',
  'Node_deleteNode_Success',
  'Node_deleteNode_Failure'
)<DeleteNodePayload['Request'], DeleteNodePayload['Response'], Error>()

export const createIngressNode = createAsyncAction(
  'Node_createIngressNode_Request',
  'Node_createIngressNode_Success',
  'Node_createIngressNode_Failure'
)<
  CreatIngressNodePayload['Request'],
  CreatIngressNodePayload['Response'],
  Error
>()

export const deleteIngressNode = createAsyncAction(
  'Node_deleteIngressNode_Request',
  'Node_deleteIngressNode_Success',
  'Node_deleteIngressNode_Failure'
)<
  DeleteIngressNodePayload['Request'],
  DeleteIngressNodePayload['Response'],
  Error
>()
