const validNetworkNames = [
  'network',
  'netty',
  'dev',
  'dev-net',
  'office',
  'office-vpn',
  'netmaker-vpn',
  'securoserv',
  'quick',
  'long',
  'lite',
  'inet',
  'vnet',
  'mesh',
  'netmaker',
  'site',
  'lan-party',
  'skynet',
  'short',
  'private',
  'my-net',
  'it-dept',
  'test-net',
  'kube-net',
  'mynet',
  'wg-net',
  'wireguard-1',
  'mesh-vpn',
  'mesh-virt',
  'virt-net',
  'wg-vnet',
]

export const genRandomNumber = (size: number, inclusive: boolean) => {
  if (inclusive) {
    return Math.floor(Math.random() * size + 1)
  }
  return Math.floor(Math.random() * size)
}

// export const genRandomHex = (size: number) => {
//   [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
// }
const genRandomHex = (size: number) => {
  const result = []
  const hexRef = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
  ]

  for (let n = 0; n < size; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)])
  }
  return result.join('')
}

export const randomCIDR = () =>
  `10.${genRandomNumber(254, true)}.${genRandomNumber(254, true)}.0/24`

export const randomCIDR6 = () => `${genRandomHex(4)}:4206:9753:2021::/64`

export const randomNetworkName = () =>
  validNetworkNames[genRandomNumber(validNetworkNames.length, false)]

export const copy = (text: string) => navigator.clipboard.writeText(text)

// export const decode64 = (str: string): string =>
//   Buffer.from(str, 'base64').toString('binary')
// export const encode64 = (str: string): string =>
//   Buffer.from(str, 'binary').toString('base64')

export const getCommaSeparatedArray = (values: string) => {
  const newArray = values.split(',')
  for (let i = 0; i < newArray.length; i++) {
    newArray[i] = newArray[i].trim()
  }
  return newArray as []
}

// Returns level of health of a node
// 2 - unhealthy (hasn't checked in for 30 min)
// 1 - warning (hasn't checked in for 5 min)
// 0 - healthy
export const isNodeHealthy = (lastCheckinTime: number) => {
  const time = Date.now() / 1000
  if (time - lastCheckinTime >= 1800) return 2
  if (time - lastCheckinTime >= 300) return 1
  return 0
}

// convert array to a string with commas separating each element
export const convertStringToArray = (commaSeparatedData: string) => {
  const data = commaSeparatedData.split(',')
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].trim()
  }
  return data as any
}
