import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import CustomDialog from '~components/dialog/CustomDialog'
// import { Node } from '~store/types'
import { useParams } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'
import { useNodesByNetworkId } from '~util/network'
import { Node } from '~store/types'
import NodeGraph from './graph-components/NodeGraph'
import NodeDetails from './graph-components/NodeDetails'
import { ControlsContainer, ForceAtlasControl, SearchControl, SigmaContainer, ZoomControl } from "react-sigma-v2";
import { filterExtClientsByNetwork } from "~util/node"
import { nodeSelectors } from '~store/selectors'

export const NetworkGraph: React.FC = () => {
  // const networks = useSelector(networkSelectors.getNetworks)
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const { netid } = useParams<{ netid: string }>()
  const listOfNodes = useNodesByNetworkId(netid)
  const [selectedNode, setSelectedNode] = React.useState({} as Node)
  const [selectedAltData, setSelectedAltData] = React.useState({} as {
      id: string
      name: string
      type: 'extclient' | 'cidr' 
  })
  const extClients = useSelector(nodeSelectors.getExtClients)
  const clients = filterExtClientsByNetwork(extClients, netid)

  const handleClose = () => {
    setOpen(false)
  }

  const handleAccept = () => {
      setOpen(false)
  }

  const isConnected = (node1: Node, node2: Node) => {
    if (node1.isrelay && ([...node1.relayaddrs] as string[]).indexOf(node2.address) < 0) {
      return false
    } else if (node1.isrelayed || node2.isrelayed) {
      return false
    }
    return true
  } // TODO: tell if nodes are connected or not

  const handleSetNode = (selected: Node) => {
    handleUnsetNode()
    setSelectedNode(selected)
  }

  const handleSetAlt = (selected : {
      id: string
      name: string
      type: 'extclient' | 'cidr' 
  }) => {
    handleUnsetNode()
    setSelectedAltData(selected)
  }

  const handleUnsetNode = () => { setSelectedNode({} as Node) 
    setSelectedAltData({} as {
        id: string
        name: string
        type: 'extclient' | 'cidr' 
    })
  }

  if (!!!listOfNodes || !!!listOfNodes.length) {
      return <div style={{marginTop: '5em', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h3>{t('node.none')}</h3>
      </div>
  }

  const data = {
    nodes: listOfNodes,
    edges: [] as {
      from: string
      to: string
    }[],
    nodeTypes: [] as { 
      type: ('normal' | '1&e' | 'ingress' | 'egress' | 'relay' | 'relayed' | 'extclient' | 'cidr'),
      id: string,
      name: string
    }[],
  }

  const extractEgressRanges = (node: Node) => {
    for (let i = 0; i < node.egressgatewayranges.length; i++) {
      data.nodeTypes.push({
        type: 'cidr',
        id: node.egressgatewayranges[i],
        name: node.egressgatewayranges[i],
      })
      data.edges.push({
        from: node.id,
        to: node.egressgatewayranges[i]
      })
    }
  }

  const extractIngressRanges = (node: Node) => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].ingressgatewayid === node.id) {
        data.nodeTypes.push({
          type: 'extclient',
          id: clients[i].clientid,
          name: clients[i].clientid,
        })
        data.edges.push({
          from: clients[i].clientid,
          to: node.id
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
        })
        data.edges.push({
          from: currentNode.id,
          to: node.id
        })
      }
    }
  }

  for (let i = 0; i < listOfNodes.length; i++) {
      const innerNode = listOfNodes[i]
      if (innerNode.isingressgateway || innerNode.isegressgateway) { // handle adding external cidr(s)
          if (innerNode.isingressgateway && innerNode.isegressgateway) { // and ext clients
            data.nodeTypes.push({
            type: '1&e',
            id: innerNode.id,
            name: innerNode.name
          })
          extractEgressRanges(innerNode)
          extractIngressRanges(innerNode)
        }
        else if (innerNode.isegressgateway) { // handle adding external cidr(s)
           data.nodeTypes.push({
             type: 'egress',
             id: innerNode.id,
             name: innerNode.name
            }) 
            extractEgressRanges(innerNode)
        } else { // handle adding ext client nodes
          data.nodeTypes.push({
            type: 'ingress',
            id: innerNode.id,
            name: innerNode.name
           })
           extractIngressRanges(innerNode)
        }  
      }
      else if (innerNode.isrelay) {
         data.nodeTypes.push({
          type: 'relay',
          id: innerNode.id,
          name: innerNode.name
        })
        extractRelayedNodes(innerNode)
      } else if (innerNode.isrelayed) { // skip edges for relayed nodes
        continue
      } else {
        data.nodeTypes.push({
          type: 'normal',
          id: innerNode.id,
          name: innerNode.name
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
            })
          }
      }
  }

  return (
        <Grid container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h5">
                    {`${t('network.graphview')}: ${netid}`}
                    </Typography>
                </div>
                {!!selectedNode && (
                        <CustomDialog
                            open={open}
                            handleClose={handleClose}
                            handleAccept={handleAccept}
                            message={t('hello there')}
                            title={t('networks.graph')}
                        />
                  )}
            </Grid>
            <Grid item xs={12} sm={8}>
              <React.StrictMode>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5em', width: '100%'}}>
                    <SigmaContainer style={{height: '35em', width: '600px'}}>
                      <NodeGraph data={data} handleViewNode={handleSetNode} handleViewAlt={handleSetAlt} />
                      <ControlsContainer position={"bottom-right"}>
                        <ZoomControl />
                        <ForceAtlasControl />
                      </ControlsContainer>
                      <ControlsContainer position={"top-right"}>
                        <SearchControl />
                      </ControlsContainer>
                    </SigmaContainer>
                </div>
              </React.StrictMode>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                  <NodeDetails data={selectedNode} handleClose={handleUnsetNode} altData={selectedAltData} />
              </div>
            </Grid>
        </Grid>
  )
}
