import { NodePayload, Node } from '.'

export const nodeToNodePayload = (node: Node): NodePayload => {
  return {
    ...node,
    saveconfig: node.saveconfig ? 'yes' : 'no',
    isegressgateway: node.isegressgateway ? 'yes' : 'no',
    isingressgateway: node.isingressgateway ? 'yes' : 'no',
    isstatic: node.isstatic ? 'yes' : 'no',
    udpholepunch: node.udpholepunch ? 'yes' : 'no',
    pullchanges: node.pullchanges ? 'yes' : 'no',
    dnson: node.dnson ? 'yes' : 'no',
    isdualstack: node.isdualstack ? 'yes' : 'no',
    isserver: node.isserver ? 'yes' : 'no',
    islocal: node.islocal ? 'yes' : 'no',
    roaming: node.roaming ? 'yes' : 'no',
    ipforwarding: node.ipforwarding ? 'yes' : 'no',
    isrelay: node.isrelay ? 'yes' : 'no',
    isrelayed: node.isrelayed ? 'yes' : 'no',
  }
}
export const nodePayloadToNode = (node: NodePayload): Node => {
  return {
    ...node,
    saveconfig: node.saveconfig === 'yes',
    isegressgateway: node.isegressgateway === 'yes',
    isingressgateway: node.isingressgateway === 'yes',
    isstatic: node.isstatic === 'yes',
    udpholepunch: node.udpholepunch === 'yes',
    pullchanges: node.pullchanges === 'yes',
    dnson: node.dnson === 'yes',
    isdualstack: node.isdualstack === 'yes',
    isserver: node.isserver === 'yes',
    islocal: node.islocal === 'yes',
    roaming: node.roaming === 'yes',
    ipforwarding: node.ipforwarding === 'yes',
    isrelay: node.isrelay === 'yes',
    isrelayed: node.isrelayed === 'yes',
  }
}

export function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
