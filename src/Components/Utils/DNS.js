import API from './API'

// eslint-disable-next-line import/no-anonymous-default-export
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
      return (
        (
          await API(token).post(`/dns/${network}`, {
            address,
            name,
          })
        ).status === 200
      )
    } catch (err) {
      return false
    }
  },
  removeEntry: async (network, name, token) => {
    try {
      return (await API(token).delete(`/dns/${network}/${name}`)).status === 200
    } catch (err) {
      return false
    }
  },
}
