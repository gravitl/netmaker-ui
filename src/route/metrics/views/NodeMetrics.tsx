import {
    Grid, Typography,
  } from '@mui/material'
import React from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { UptimeChart } from './charts/Uptime'
import { SentChart } from './charts/SentChart'
import { ReceivedChart } from './charts/ReceivedChart'
import { useSelector, useDispatch } from 'react-redux'
import { serverSelectors } from '~store/selectors'
import { NodeMetricsContainer } from '~store/types'
import { useNodesByNetworkId } from '~util/network'
import { getNodeMetrics } from '~store/modules/server/actions'

const styles = {
  center: {
    textAlign: 'center'
  },
  start: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
} as any

export const NodeMetrics: React.FC = () => {
  const { path, url } = useRouteMatch()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { netid, nodeid } = useParams<{ nodeid: string; netid: string }>()
  const allNodes = useNodesByNetworkId(netid)
  const metrics = useSelector(serverSelectors.getNodeMetrics)
  const [currentNodeMetrics, setCurrentNodeMetrics] = React.useState({} as NodeMetricsContainer)
  var nodeNameMap: Map<string, string> = new Map()

  useLinkBreadcrumb({
      link: `/nodes/${netid}/${nodeid}`,
      title: nodeid,
  })

  useLinkBreadcrumb({
      link: `/metrics/${netid}`,
      title: netid,
  })

  console.log("PATH", path)
  console.log("URL", url)

  React.useEffect(() => {
    if (!!!Object.keys(currentNodeMetrics).length || !!!metrics ||
      Object.keys(currentNodeMetrics).length !== Object.keys(metrics).length) {
      dispatch(getNodeMetrics.request({ ID: nodeid, Network: netid }))
    }
    if (!!metrics &&
        Object.keys(currentNodeMetrics).length !== Object.keys(metrics).length) {
          console.log("Setting metrics", JSON.stringify(metrics))
        setCurrentNodeMetrics(metrics)
    }
    if (!!!metrics) {
      setCurrentNodeMetrics({} as NodeMetricsContainer)
    }
  }, [dispatch, currentNodeMetrics, metrics, netid, nodeid])

  if (!!allNodes) {
    allNodes.map((node) => nodeNameMap.set(node.id, node.name))
  }

  let totalSent = 0
  let duration = 0
  if (!!currentNodeMetrics && !!currentNodeMetrics.connectivity && !!Object.keys(currentNodeMetrics.connectivity).length) {
    Object.keys(currentNodeMetrics.connectivity).map(peerID => {
      totalSent += currentNodeMetrics.connectivity[peerID].totalsent
      if (!!!duration && currentNodeMetrics.connectivity[peerID].connected) {
        duration = currentNodeMetrics.connectivity[peerID].actualuptime
      }
      return null
    })
  }

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center"
    >
      <Grid item xs={8} style={styles.center}>
        <h1>Hello Metrics</h1>
      </Grid>
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={10} sm={3} md={3} style={styles.start}>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={6} style={styles.center}>
            <Typography variant='h4'>
              Uptime
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <UptimeChart chartData={[50,50]}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10} sm={4.5} md={4.5} style={styles.start}>
        <Grid container direction='column' justifyContent='flex-start' alignItems='center'>
          <Grid item xs={10} style={styles.center}>
            <Typography variant='h4'>
              Data Sent
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <SentChart totalSent={totalSent} duration={duration}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10} sm={4.5} md={4.5} style={styles.start}>
        <Grid container direction='column' justifyContent='flex-start' alignItems='center'>
          <Grid item xs={10} style={styles.center}>
            <Typography variant='h4'>
              Data Received
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <ReceivedChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={11} sm={10} md={10}>
      <Grid container direction='column' justifyContent='flex-start' alignItems='center'>
          <Grid item xs={10} style={styles.center}>
            <Typography variant='h4'>
              Peer Connections
            </Typography>
          </Grid>
          <Grid item xs={10}>
            Show Connections
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
  