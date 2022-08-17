import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { UptimeChart } from './charts/Uptime'
import { SentChart } from './charts/SentChart'
import { ReceivedChart } from './charts/ReceivedChart'
import { useSelector, useDispatch } from 'react-redux'
import { nodeSelectors, serverSelectors } from '~store/selectors'
import { NodeMetric, NodeMetricsContainer } from '~store/types'
import { useNodesByNetworkId } from '~util/network'
import {
  clearCurrentMetrics,
  getNodeMetrics,
} from '~store/modules/server/actions'
import { NmTable, TableColumns } from '~components/Table'
import { Modify } from 'src/types/react-app-env'
import MetricButton from '../components/MetricButton'
import { Search, Sync } from '@mui/icons-material'
import { MAX_ATTEMPTS } from '../util'

const styles = {
  center: {
    textAlign: 'center',
  },
  start: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  halfSize: {
    minWidth: '10rem',
    width: '50%',
  },
  topMargin: {
    marginTop: '1.5rem',
  },
} as any

type NodeMetricID = Modify<
  NodeMetric,
  {
    id: string
    name: string
  }
>

export const NodeMetrics: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { netid, nodeid } = useParams<{ nodeid: string; netid: string }>()
  const allNodes = useNodesByNetworkId(netid)
  const extClients = useSelector(nodeSelectors.getExtClients)
  const metrics = useSelector(serverSelectors.getNodeMetrics)
  const isFetching = useSelector(serverSelectors.isFetchingServerConfig)
  const attempts = useSelector(serverSelectors.getAttempts)
  const [initialLoad, setInitialLoad] = React.useState(true)
  const [currentNodeMetrics, setCurrentNodeMetrics] = React.useState(
    {} as NodeMetricsContainer
  )
  const [currentPeerMetrics, setCurrentPeerMetrics] = React.useState(
    [] as NodeMetricID[]
  )
  var nodeNameMap: Map<string, string> = new Map()
  const [filterNodes, setFilterNodes] = React.useState(allNodes)

  const syncMetrics = () => {
    dispatch(clearCurrentMetrics())
  }

  useLinkBreadcrumb({
    link: `/nodes/${netid}/${nodeid}`,
    title: nodeid,
  })

  useLinkBreadcrumb({
    link: `/metrics/${netid}`,
    title: netid,
  })

  if (!!allNodes) {
    allNodes.map((node) => nodeNameMap.set(node.id, node.name))
  }
  if (!!extClients) {
    extClients.map((client) =>
      nodeNameMap.set(client.clientid, client.clientid)
    )
  }

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterNodes(allNodes)
    } else {
      if (!!allNodes) {
        setFilterNodes(
          allNodes.filter((node) =>
            `${node.name}${node.address}${node.id}${node.network}`.includes(
              searchTerm
            )
          )
        )
      }
    }
  }

  const handleGetBytesLabel = (bytes: number) => {
    if (bytes > 1000000000000) {
      return 'TiB'
    }
    if (bytes > 1000000000) {
      return 'GiB'
    }
    if (bytes > 1000000) {
      return 'MiB'
    }
    if (bytes > 1000) {
      return 'KiB'
    }
    return 'B'
  }

  const handleGetBytesValue = (bytes: number) => {
    if (bytes > 1000000000000) {
      return (bytes / 1000000000000).toFixed(2)
    }
    if (bytes > 1000000000) {
      return (bytes / 1000000000).toFixed(2)
    }
    if (bytes > 1000000) {
      return (bytes / 1000000).toFixed(2)
    }
    if (bytes > 1000) {
      return (bytes / 1000).toFixed(2)
    }
    return bytes
  }

  React.useEffect(() => {
    if (initialLoad) {
      dispatch(clearCurrentMetrics())
      setInitialLoad(false)
    }
    window.onpopstate = () => {
      if (!!metrics) {
        dispatch(clearCurrentMetrics())
      }
    }

    if (
      (!!!currentNodeMetrics && !isFetching) ||
      !!!Object.keys(currentNodeMetrics).length ||
      !!!metrics ||
      Object.keys(currentNodeMetrics).length !== Object.keys(metrics).length ||
      (!!Object.keys(currentNodeMetrics.connectivity).length &&
        !!~Object.keys(currentNodeMetrics.connectivity).findIndex(
          (currID) => currID === nodeid
        ))
    ) {
      if (attempts < MAX_ATTEMPTS)
        dispatch(getNodeMetrics.request({ ID: nodeid, Network: netid }))
      setCurrentPeerMetrics([])
    }
    if (
      !!metrics &&
      Object.keys(currentNodeMetrics).length !== Object.keys(metrics).length
    ) {
      setCurrentNodeMetrics(metrics)
    }
    if (
      !!Object.keys(currentNodeMetrics).length &&
      !!!currentPeerMetrics.length &&
      !!Object.keys(currentNodeMetrics.connectivity).length &&
      !!nodeNameMap &&
      !!nodeNameMap.get &&
      nodeNameMap.size === allNodes?.length
    ) {
      const newPeerMetrics = [] as NodeMetricID[]
      Object.keys(currentNodeMetrics.connectivity).map((peerID) => {
        const name = nodeNameMap.get(peerID)
        if (!!name) {
          newPeerMetrics.push({
            ...currentNodeMetrics.connectivity[peerID],
            id: peerID,
            name,
          })
        }
        return null
      })
      setCurrentPeerMetrics(newPeerMetrics)
    }
    if (!!!metrics) {
      setCurrentNodeMetrics({} as NodeMetricsContainer)
    }
    // eslint-disable-next-line
  }, [
    dispatch,
    currentNodeMetrics,
    metrics,
    netid,
    nodeid,
    allNodes,
    currentPeerMetrics,
    attempts,
    isFetching,
  ])

  let totalSent = 0
  let duration = 0
  let totalReceived = 0
  if (
    !!currentNodeMetrics &&
    !!currentNodeMetrics.connectivity &&
    !!Object.keys(currentNodeMetrics.connectivity).length
  ) {
    Object.keys(currentNodeMetrics.connectivity).map((peerID) => {
      totalSent += currentNodeMetrics.connectivity[peerID].totalsent
      totalReceived += currentNodeMetrics.connectivity[peerID].totalreceived
      if (!!!duration && currentNodeMetrics.connectivity[peerID].connected) {
        duration = currentNodeMetrics.connectivity[peerID].actualuptime
      }
      return null
    })
  }

  const columns: TableColumns<NodeMetricID> = [
    {
      id: 'name',
      label: t('node.name'),
      minWidth: 170,
      sortable: true,
      format: (_, node) => (
        <MetricButton
          link={`/metrics/${netid}/${node.id}`}
          text={node.name}
          sx={{ textTransform: 'none' }}
        />
      ),
      align: 'center',
    },
    {
      id: 'percentup',
      labelKey: 'pro.metrickeys.uptime',
      minWidth: 200,
      sortable: true,
      align: 'center',
      format: (_, node) => (
        <div style={styles.halfSize}>
          <UptimeChart
            actualUptime={node.actualuptime}
            chartData={[node.percentup, 100 - node.percentup]}
          />
        </div>
      ),
    },
    {
      id: 'latency',
      labelKey: 'pro.metrickeys.latency',
      minWidth: 100,
      align: 'center',
      format: (value) =>
        value === 0 ? (
          <Typography variant="h5">
            {String(t('pro.metrickeys.lessthanone'))}
          </Typography>
        ) : (
          <Typography variant="h5">{value}</Typography>
        ),
    },
    {
      id: 'totalsent',
      labelKey: 'pro.metrickeys.totalsent',
      minWidth: 100,
      align: 'center',
      format: (value) => (
        <Typography variant="h5">
          {handleGetBytesValue(value)} ({handleGetBytesLabel(value)})
        </Typography>
      ),
    },
    {
      id: 'totalreceived',
      labelKey: 'pro.metrickeys.totalreceived',
      minWidth: 100,
      align: 'center',
      format: (value) => (
        <Typography variant="h5">
          {handleGetBytesValue(value)} ({handleGetBytesLabel(value)})
        </Typography>
      ),
    },
  ]

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={10} md={8} style={styles.center}>
        <Typography variant="h3">{t('pro.metrics')}</Typography>
      </Grid>
      <Grid item xs={12} style={styles.center}>
        <hr />
        {attempts >= MAX_ATTEMPTS && (
          <Typography color="red">{t('error.overload')}</Typography>
        )}
        {isFetching && <LinearProgress />}
      </Grid>
      <Grid item xs={10} sm={4.5} md={4.5} style={styles.start}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={10} style={styles.center}>
            <Typography variant="h4">
              {String(t('pro.metrickeys.datasent'))}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SentChart totalSent={totalSent} duration={duration} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10} sm={4.5} md={4.5} style={styles.start}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={10} style={styles.center}>
            <Typography variant="h4">
              {String(t('pro.metrickeys.datareceived'))}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ReceivedChart totalReceived={totalReceived} duration={duration} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={11} sm={10} md={10}>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          style={styles.topMargin}
        >
          <Grid item xs={6.5} md={5.5} style={styles.center}>
            <Typography variant="h4">
              {String(t('pro.metrickeys.peerconnections'))}
            </Typography>
          </Grid>
          <Grid item xs={5} md={5.5}>
            <div style={styles.center}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                label={`${t('common.search')} ${t('node.nodes')}`}
                onChange={handleFilter}
              />
            </div>
          </Grid>
          <Grid item xs={1} md={1}>
            <Tooltip
              title={t('pro.metrickeys.syncmetrics') as string}
              placement="top"
            >
              <IconButton color="primary" onClick={syncMetrics}>
                <Sync />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} style={styles.topMargin}>
            {!!filterNodes && filterNodes.length ? (
              <NmTable
                columns={columns}
                rows={currentPeerMetrics.filter(
                  (node) => !!~filterNodes.findIndex((n) => n.id === node.id)
                )}
                getRowId={(row) => row.name}
              />
            ) : (
              <NmTable
                columns={columns}
                rows={currentPeerMetrics}
                getRowId={(row) => row.name}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
