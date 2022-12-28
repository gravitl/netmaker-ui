import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import CustomDialog from '~components/dialog/CustomDialog'
// import { Node } from '~store/types'
import { useParams, useRouteMatch } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'
import { useNetwork, useNodesByNetworkId } from '~util/network'
import { Node } from '~store/types'
import NodeGraph from './graph-components/NodeGraph'
import NodeDetails from './graph-components/NodeDetails'
import {
  ControlsContainer,
  SearchControl,
  SigmaContainer,
  ZoomControl,
  FullScreenControl,
} from 'react-sigma-v2'
import { filterExtClientsByNetwork, getEdgeConnectivity } from '~util/node'
import { nodeSelectors, aclSelectors, authSelectors, hostsSelectors } from '~store/selectors'
import { AltDataNode, DataNode, Edge } from './graph-components/types'
import { NetworkSelect } from '~components/NetworkSelect'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import {
  clearCurrentACL,
  getNodeACLContainer,
} from '~store/modules/acls/actions'

export const NetworkGraph: React.FC = () => {
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const { url } = useRouteMatch()
  const { netid } = useParams<{ netid: string }>()
  const currentNetwork = useNetwork(netid)
  const tmpNodes = useNodesByNetworkId(netid)
  const listOfNodes = useMemo(() => tmpNodes || [], [tmpNodes])
  const currentNetworkACL = useSelector(aclSelectors.getCurrentACL)
  const currentNodeACLs = Object.keys(currentNetworkACL)
  const [selectedNode, setSelectedNode] = React.useState({} as Node)
  const [selectedAltData, setSelectedAltData] = React.useState(
    {} as AltDataNode
  )
  const extClients = useSelector(nodeSelectors.getExtClients)
  const clients = filterExtClientsByNetwork(extClients, netid)
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const dispatch = useDispatch()
  const isProcessing = useSelector(aclSelectors.isProcessing)

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  React.useEffect(() => {
    if (!!!currentNodeACLs.length && !isProcessing) {
      dispatch(getNodeACLContainer.request({ netid }))
    } else if (
      !!!listOfNodes.length ||
      !!!currentNodeACLs.filter((acl) => acl === listOfNodes[0].id).length
    ) {
      dispatch(clearCurrentACL(''))
    }
  }, [
    dispatch,
    netid,
    currentNetworkACL,
    currentNodeACLs,
    listOfNodes,
    isProcessing,
  ])

  const handleClose = () => {
    setOpen(false)
  }

  const handleAccept = () => {
    setOpen(false)
  }

  const isConnected = (node1: Node, node2: Node) => {
    if (
      !!currentNodeACLs.length &&
      !!currentNetworkACL[node1.id] &&
      currentNetworkACL[node1.id][node2.id] === 1
    ) {
      return false
    } else if (
      node1.isrelay &&
      ([...node1.relayaddrs] as string[]).indexOf(node2.address) >= 0
    ) {
      return false
    } else if (node1.isrelayed || node2.isrelayed) {
      return false
    }
    return true
  }

  const handleSetNode = (selected: Node) => {
    handleUnsetNode()
    setSelectedNode(selected)
  }

  const handleSetAlt = (selected: AltDataNode) => {
    handleUnsetNode()
    setSelectedAltData(selected)
  }

  const handleUnsetNode = () => {
    setSelectedNode({} as Node)
    setSelectedAltData({} as AltDataNode)
  }

  if (!!!listOfNodes || !!!listOfNodes.length || !!!currentNetwork) {
    return (
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={6}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">
              {`${netid}, ${t('node.none')}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={5}>
          <NetworkSelect />
        </Grid>
      </Grid>
    )
  }

  const data = {
    nodes: listOfNodes,
    edges: [] as Edge[],
    nodeTypes: [] as DataNode[],
  }

  const extractEgressRanges = (node: Node) => {
    for (let i = 0; i < node.egressgatewayranges.length; i++) {
      data.nodeTypes.push({
        type: 'cidr',
        id: node.egressgatewayranges[i],
        name: node.egressgatewayranges[i],
        lastCheckin: undefined,
      })
      data.edges.push({
        from: node.id,
        to: node.egressgatewayranges[i],
        status: 'unknown',  // TODO: cross-check whether this can be determined
      })
    }
  }

  const extractIngressRanges = (node: Node) => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].ingressgatewayid === node.id && clients[i].enabled) {
        data.nodeTypes.push({
          type: 'extclient',
          id: clients[i].clientid,
          name: clients[i].clientid,
          lastCheckin: undefined,
          address: clients[i].address,
          address6: clients[i].address6,
        })
        data.edges.push({
          from: clients[i].clientid,
          to: node.id,
          status: getEdgeConnectivity(node, clients[i]),
        })
      }
    }
  }

  const extractRelayedNodes = (node: Node) => {
    const relayaddrs = [...node.relayaddrs] as string[]
    for (let i = 0; i < listOfNodes.length; i++) {
      const currentNode = listOfNodes[i]
      if (relayaddrs.indexOf(currentNode.address) >= 0) {
        data.nodeTypes.push({
          type: 'relayed',
          id: currentNode.id,
          name: currentNode.name,
          lastCheckin: currentNode.lastcheckin,
        })
        if (
          !!currentNodeACLs.length &&
          !!currentNetworkACL[currentNode.id] &&
          currentNetworkACL[currentNode.id][node.id] === 2
        ) {
          data.edges.push({
            from: currentNode.id,
            to: node.id,
            status: getEdgeConnectivity(currentNode, node),
          })
        }
      }
    }
  }

  if (currentNetwork.ispointtosite) {
    const hubNode = listOfNodes.filter((currNode) => currNode.ishub)[0]
    if (!!hubNode) {
      for (let i = 0; i < listOfNodes.length; i++) {
        const innerNode = listOfNodes[i]
        if (innerNode.isingressgateway || innerNode.isegressgateway) {
          // handle adding external cidr(s)
          if (
            innerNode.isingressgateway &&
            innerNode.isegressgateway &&
            innerNode.isrelay
          ) {
            data.nodeTypes.push({
              type: 'i&e&r',
              id: innerNode.id,
              name: hostsMap[innerNode.hostid].name,
              lastCheckin: innerNode.lastcheckin,
            })
            extractEgressRanges(innerNode)
            extractIngressRanges(innerNode)
            extractRelayedNodes(innerNode)
          } else if (innerNode.isegressgateway && innerNode.isrelay) {
            data.nodeTypes.push({
              type: 'e&r',
              id: innerNode.id,
              name: hostsMap[innerNode.hostid].name,
              lastCheckin: innerNode.lastcheckin,
            })
            extractEgressRanges(innerNode)
            extractRelayedNodes(innerNode)
          } else if (innerNode.isingressgateway && innerNode.isrelay) {
            data.nodeTypes.push({
              type: 'i&r',
              id: innerNode.id,
              name: hostsMap[innerNode.hostid].name,
              lastCheckin: innerNode.lastcheckin,
            })
            extractIngressRanges(innerNode)
            extractRelayedNodes(innerNode)
          } else if (innerNode.isegressgateway) {
            // handle adding external cidr(s)
            data.nodeTypes.push({
              type: 'egress',
              id: innerNode.id,
              name: hostsMap[innerNode.hostid].name,
              lastCheckin: innerNode.lastcheckin,
            })
            extractEgressRanges(innerNode)
          } else {
            // handle adding ext client nodes
            data.nodeTypes.push({
              type: 'ingress',
              id: innerNode.id,
              name: hostsMap[innerNode.hostid].name,
              lastCheckin: innerNode.lastcheckin,
            })
            extractIngressRanges(innerNode)
          }
        } else if (innerNode.isrelay) {
          data.nodeTypes.push({
            type: 'relay',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractRelayedNodes(innerNode)
        } else if (innerNode.isrelayed) {
          // skip edges for relayed nodes
          continue
        } else {
          data.nodeTypes.push({
            type: 'normal',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
        }
        if (innerNode.id === hubNode.id) {
          // skip the hub node
          continue
        }

        if (isConnected(innerNode, hubNode)) {
          data.edges.push({
            from: innerNode.id,
            to: hubNode.id,
            status: getEdgeConnectivity(innerNode, hubNode),
          })
          data.edges.push({
            from: hubNode.id,
            to: innerNode.id,
            status: getEdgeConnectivity(innerNode, hubNode),
          })
        }
      }
    }
  } else {
    for (let i = 0; i < listOfNodes.length; i++) {
      const innerNode = listOfNodes[i]
      if (innerNode.isingressgateway || innerNode.isegressgateway) {
        // handle adding external cidr(s)
        if (
          innerNode.isingressgateway &&
          innerNode.isegressgateway &&
          innerNode.isrelay
        ) {
          data.nodeTypes.push({
            type: 'i&e&r',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractEgressRanges(innerNode)
          extractIngressRanges(innerNode)
          extractRelayedNodes(innerNode)
        } else if (innerNode.isingressgateway && innerNode.isegressgateway) {
          // and ext clients
          data.nodeTypes.push({
            type: '1&e',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractEgressRanges(innerNode)
          extractIngressRanges(innerNode)
        } else if (innerNode.isegressgateway && innerNode.isrelay) {
          data.nodeTypes.push({
            type: 'e&r',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractEgressRanges(innerNode)
          extractRelayedNodes(innerNode)
        } else if (innerNode.isingressgateway && innerNode.isrelay) {
          data.nodeTypes.push({
            type: 'i&r',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractIngressRanges(innerNode)
          extractRelayedNodes(innerNode)
        } else if (innerNode.isegressgateway) {
          // handle adding external cidr(s)
          data.nodeTypes.push({
            type: 'egress',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractEgressRanges(innerNode)
        } else {
          // handle adding ext client nodes
          data.nodeTypes.push({
            type: 'ingress',
            id: innerNode.id,
            name: hostsMap[innerNode.hostid].name,
            lastCheckin: innerNode.lastcheckin,
          })
          extractIngressRanges(innerNode)
        }
      } else if (innerNode.isrelay) {
        data.nodeTypes.push({
          type: 'relay',
          id: innerNode.id,
          name: hostsMap[innerNode.hostid].name,
          lastCheckin: innerNode.lastcheckin,
        })
        extractRelayedNodes(innerNode)
      } else if (innerNode.isrelayed) {
        // skip edges for relayed nodes
        continue
      } else {
        data.nodeTypes.push({
          type: 'normal',
          id: innerNode.id,
          name: hostsMap[innerNode.hostid].name,
          lastCheckin: innerNode.lastcheckin,
        })
      }

      for (let j = 0; j < listOfNodes.length; j++) {
        const outerNode = listOfNodes[j]
        if (outerNode.id === innerNode.id) {
          continue
        }
        if (isConnected(innerNode, outerNode)) {
          data.edges.push({
            from: innerNode.id,
            to: outerNode.id,
            status: getEdgeConnectivity(innerNode, outerNode),
          })
        }
      }
    }
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        {!!selectedNode && (
          <CustomDialog
            open={open}
            handleClose={handleClose}
            handleAccept={handleAccept}
            message={t('hello there')}
            title={t('networks.graph')}
          />
        )}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">
                {`${t('network.graphview')}: ${netid}`}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={5}>
            <NetworkSelect />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={8}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <SigmaContainer
            style={{
              height: '35em',
              width: '600px',
              backgroundColor: inDarkMode ? '#272727' : '#f0f0f0',
            }}
          >
            <NodeGraph
              data={data}
              handleViewNode={handleSetNode}
              handleViewAlt={handleSetAlt}
            />
            <ControlsContainer position={'top-right'}>
              <ZoomControl />
              <FullScreenControl />
            </ControlsContainer>
            <ControlsContainer position={'top-left'}>
              <SearchControl />
            </ControlsContainer>
          </SigmaContainer>
        </div>
      </Grid>
      <Grid item xs={12} sm={4}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <NodeDetails
            network={currentNetwork}
            data={selectedNode}
            handleClose={handleUnsetNode}
            altData={selectedAltData}
          />
        </div>
      </Grid>
    </Grid>
  )
}
