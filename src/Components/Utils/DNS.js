import axios from 'axios'
import Common from '../../Common'

const API = axios.create({
    baseURL: `${Common.BACKEND_URL}/api/dns`,
    headers: {'authorization': `Bearer ${Common.MASTER_KEY}`}
})

export default {

    getDNS: async (network, setDnsData) => {
        let dnsData = []
        try {
            if (!network) {
                dnsData = (await API.get('/')).data
            } else {
                dnsData = (await API.get(`/adm/${network}/custom`)).data
            }
            if (dnsData) setDnsData(dnsData)
        } catch (err) {
            console.log(err)
        }
    },
    createEntry: async (network, name, address) => {
        try {
            return (await API.post(`/${network}`, {
                address,
                name
            })).status === 200 && (await API.post('/adm/pushdns')).status === 200
        } catch (err) {
            return false
        }
    },
    pushDNS: async () => {
        try {
            return (await API.post('/adm/pushdns')).status === 200
        } catch (err) {
            return false
        }
    },
    removeEntry: async (network, name) => {
        try {
            return (await API.delete(`/${network}/${name}`)).status === 200 && (await API.post('/adm/pushdns')).status === 200
        } catch (err) {
            return false
        }
    }
}
