// eslint-disable-next-line import/no-anonymous-default-export
export default {
  NETWORK_FIELDS: [
    'addressrange',
    'addressrange6',
    'localrange',
    'displayname',
    'nodeslastmodified',
    'networklastmodified',
    'defaultinterface',
    'defaultlistenport',
    'defaultpostup',
    'defaultpostdown',
    'defaultkeepalive',
    'defaultcheckininterval',
    'defaultextclientdns',
    'defaultmtu',
    'isdualstack',
    'defaultsaveconfig',
    'accesskeys',
    'defaultudpholepunch',
  ],
  NETWORK_DISPLAY_NAME: {
    addressrange: 'Address Range (IPv4)',
    addressrange6: 'Address Range (IPv6)',
    localrange: 'Local Range',
    displayname: 'Display Name',
    nodeslastmodified: 'Nodes Last Modified',
    networklastmodified: 'Network Last Modified',
    defaultinterface: 'Default Interface',
    defaultlistenport: 'Default Listen Port',
    defaultpostup: 'Default Postup',
    defaultpostdown: 'Default Postdown',
    defaultkeepalive: 'Default KeepAlive',
    defaultcheckininterval: 'Default Checkin Interval',
    defaultextclientdns: 'Default Ext Client DNS',
    defaultmtu: 'Default MTU',
    isdualstack: 'Is Dual Stack (IPv4 + IPv6)',
    defaultsaveconfig: 'Default Saveconfig',
    accesskeys: 'Access Keys',
    defaultudpholepunch: 'Default UDP Hole Punch',
  },
  NODE_FIELDS: [
    'address',
    'address6',
    'name',
    'listenport',
    'publickey',
    'endpoint',
    'expdatetime',
    'postup',
    'postdown',
    'persistentkeepalive',
    'saveconfig',
    'interface',
    'lastmodified',
    'lastcheckin',
    'macaddress',
    'network',
    'localaddress',
    'egressgatewayranges',
    'allowedips',
    'udpholepunch',
    'isstatic',
    'mtu',
    'relayaddrs',
    'os',
  ],
  NODE_DISPLAY_NAMES: {
    address: 'IP Address',
    address6: 'IPv6 Address',
    name: 'Node Name',
    listenport: 'Listen Port',
    publickey: 'Publickey',
    endpoint: 'Endpoint',
    expdatetime: 'Node Expiration Date/Time',
    postup: 'Postup',
    postdown: 'Postdown',
    persistentkeepalive: 'Persistent Keepalive',
    saveconfig: 'Saveconfig',
    interface: 'Interface',
    lastmodified: 'Last Modified',
    lastcheckin: 'Last Checkin',
    macaddress: 'Mac Address',
    network: 'Network',
    localaddress: 'Local Address',
    egressgatewayranges: 'Egress Gateway Ranges (Comma Separated)',
    allowedips: 'Allowed IPs (Comma Separated)',
    udpholepunch: 'UDP Hole Punching',
    isstatic: 'Is Static',
    mtu: 'MTU',
    relayaddrs: 'Relay Addresses (Comma Separated)',
    os: 'Node Operating System',
  },
  timeConverter: (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const date = a.getDate()
    const hour = a.getHours()
    const min = a.getMinutes()
    const sec = a.getSeconds()
    const time =
      date + ' ' + month + ', ' + year + ' - ' + hour + ':' + min + ':' + sec
    return time
  },
  datePickerConverter: (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000)
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const year = a.getFullYear()
    const month =
      months[a.getMonth()] < 10
        ? '0' + months[a.getMonth()]
        : a.getMonth() + months[a.getMonth()]
    const date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate()
    const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours()
    const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes()
    const time = year + '-' + month + '-' + date + 'T' + hour + ':' + min
    return time
  },
  makeKey: function makeid(length) {
    let result = []
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      )
    }
    return result.join('')
  },
  sortNodes: (node1, node2) => {
    const node1Name = node1.name.toLowerCase()
    const node2Name = node2.name.toLowerCase()
    if (node1Name < node2Name) return -1
    if (node1Name > node2Name) return 1
    return 0
  },
}
