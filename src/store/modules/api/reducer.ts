import { createReducer } from 'typesafe-actions'
import axios from 'axios'
import { BACKEND_URL } from '../../../config'

export const reducer = createReducer({
  axios: axios.create({
    baseURL: `${BACKEND_URL}/api`,
  }),
})
