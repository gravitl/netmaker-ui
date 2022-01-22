import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomDialog from '~components/dialog/CustomDialog'
// import { Node } from '~store/types'
import { useParams } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'
import { useNodesByNetworkId } from '~util/network'
import { Node } from '~store/types'
import NodeGraph from './graph-components/NodeGraph'
import NodeDetails from './graph-components/NodeDetails'
import { SigmaContainer } from "react-sigma-v2";

export const NetworkGraph: React.FC = () => {
  // const networks = useSelector(networkSelectors.getNetworks)
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const { netid } = useParams<{ netid: string }>()
  const listOfNodes = useNodesByNetworkId(netid)
  const [selectedNode, setSelectedNode] = React.useState({} as Node)

  const handleClose = () => {
    setOpen(false)
  }

  const handleAccept = () => {
      setOpen(false)
  }

  const isConnected = (node1: Node, node2: Node) => true // TODO: tell if nodes are connected or not

  const handleSetNode = (selected: Node) => {
    console.log(`Selected: ${selected.id} ${selected.name}`)
    setSelectedNode(selected)
  }

  const handleUnsetNode = () => setSelectedNode({} as Node)

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
    }[]
  }

  for (let i = 0; i < listOfNodes.length; i++) {
      for (let j = 0; j < listOfNodes.length; j++) {
          if (listOfNodes[j].id === listOfNodes[i].id) {
              continue
          }
          if (isConnected(listOfNodes[i], listOfNodes[j])) {
            data.edges.push({
              from: listOfNodes[i].id,
              to: listOfNodes[j].id,
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
                      <NodeGraph data={data} handleViewNode={handleSetNode} />
                    </SigmaContainer>
                </div>
              </React.StrictMode>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                  <NodeDetails data={selectedNode} handleClose={handleUnsetNode}/>
              </div>
            </Grid>
        </Grid>
  )
}
