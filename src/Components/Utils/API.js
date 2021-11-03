import axios from 'axios'
import { BACKEND_URL } from '../../config'

const API = function (key) {
  return axios.create({
    baseURL: `${BACKEND_URL}/api`,
    headers: { authorization: `Bearer ${key}` },
  })
}

export default API
