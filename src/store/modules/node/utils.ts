import { NodePayload, Node } from '.'

export const nodeToNodePayload = (node: Node): NodePayload => {
  return {
    ...node,
    mtu: Number(node.mtu),
    persistentkeepalive: Number(node.persistentkeepalive),
    listenport: Number(node.listenport),
    isegressgateway: node.isegressgateway ? 'yes' : 'no',
    isingressgateway: node.isingressgateway ? 'yes' : 'no',
    isstatic: node.isstatic ? 'yes' : 'no',
    udpholepunch: node.udpholepunch ? 'yes' : 'no',
    dnson: node.dnson ? 'yes' : 'no',
    isdualstack: node.isdualstack ? 'yes' : 'no',
    isserver: node.isserver ? 'yes' : 'no',
    islocal: node.islocal ? 'yes' : 'no',
    ipforwarding: node.ipforwarding ? 'yes' : 'no',
    isrelay: node.isrelay ? 'yes' : 'no',
    isrelayed: node.isrelayed ? 'yes' : 'no',
    isdocker: node.isdocker ? 'yes' : 'no',
    isk8s: node.isk8s ? 'yes' : 'no',
    ishub: node.ishub ? 'yes' : 'no',
    defaultacl: node.defaultacl === undefined ? 'unset' : node.defaultacl ? 'yes' : 'no',
    connected: node.connected ? 'yes' : 'no',
  }
}
export const nodePayloadToNode = (node: NodePayload): Node => {
  return {
    ...node,
    mtu: Number(node.mtu),
    persistentkeepalive: Number(node.persistentkeepalive),
    listenport: Number(node.listenport),
    isegressgateway: node.isegressgateway === 'yes',
    isingressgateway: node.isingressgateway === 'yes',
    isstatic: node.isstatic === 'yes',
    udpholepunch: node.udpholepunch === 'yes',
    dnson: node.dnson === 'yes',
    isdualstack: node.isdualstack === 'yes',
    isserver: node.isserver === 'yes',
    islocal: node.islocal === 'yes',
    ipforwarding: node.ipforwarding === 'yes',
    isrelay: node.isrelay === 'yes',
    isrelayed: node.isrelayed === 'yes',
    isdocker: node.isdocker === 'yes',
    isk8s: node.isk8s === 'yes',
    ishub: node.ishub === 'yes',
    defaultacl: node.defaultacl === 'unset' ? undefined : node.defaultacl === 'yes' ? true : false,
    connected: node.connected === 'yes',
  }
}

export function download(filename: string, text: string) {
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}
