import axios from 'axios'
import Common from '../../Common'

const API = function(key) { 
        return axios.create({
                baseURL: `${Common.BACKEND_URL}/api`,
                headers: {'authorization': `Bearer ${key}`}
        })
}

export default API
