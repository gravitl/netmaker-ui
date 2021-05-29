import API from './API'

export default {

    getDNS: async (network, setDnsData, token) => {
        let dnsData = []
        try {
            if (!network) {
                dnsData = (await API(token).get('/dns')).data
            } else {
                dnsData = (await API(token).get(`/dns/adm/${network}/custom`)).data
            }
            if (dnsData) setDnsData(dnsData)
        } catch (err) {
            // console.log(err)
        }
    },
    createEntry: async (network, name, address, token) => {
        try {
            console.log(token)
            return (await API(token).post(`/dns/${network}`, {
                address,
                name
            })).status === 200 && (await API(token).post('/dns/adm/pushdns')).status === 200
        } catch (err) {
            return false
        }
    },
    pushDNS: async (token) => {
        try {
            const result = await API(token).post('/dns/adm/pushdns')
            return result.status === 200
        } catch (err) {
            return false
        }
    },
    removeEntry: async (network, name, token) => {
        try {
            return (await API(token).delete(`/dns/${network}/${name}`)).status === 200 && (await API(token).post('/dns/adm/pushdns')).status === 200
        } catch (err) {
            return false
        }
    }
}
