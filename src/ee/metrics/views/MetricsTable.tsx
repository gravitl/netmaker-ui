import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle,
  NotInterested as NotAllowedIcon,
  RemoveCircleOutline as DisabledIcon,
  Search,
  Sync,
} from '@mui/icons-material'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  serverSelectors,
  nodeSelectors,
  authSelectors,
  hostsSelectors,
} from '~store/selectors'
import { NodeMetric, MetricsContainer } from '~store/types'
import { MAX_ATTEMPTS } from '~components/utils'
import { getTimeMinHrs } from '../util'
import MetricButton from '../components/MetricButton'
import { getNetworkMetrics as getNetMetrics } from '~store/modules/server/actions'

const HIGHLIGHT = '#D7BE69'
type HoveredNode = {
  nodeID1: string
  nodeID2: string
}

type NameAndNetwork = {
  name: string
  network: string
}

const titleStyle = {
  textAlign: 'center',
} as any

export const MetricsTable: FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const hostsMap = useSelector(hostsSelectors.getHostsMap)
  const isProcessing = useSelector(serverSelectors.isFetchingServerConfig)
  const { netid } = useParams<{ netid: string }>()
  const allNodes = useSelector(nodeSelectors.getNodes)
  const metrics = useSelector(serverSelectors.getNetworkMetrics(netid))
  const extClients = useSelector(nodeSelectors.getExtClients)
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const attempts = useSelector(serverSelectors.getAttempts)
  const [currentMetrics, setCurrentMetrics] = useState({} as MetricsContainer)
  const [hoveredCell, setHoveredCell] = useState({
    nodeID1: '',
    nodeID2: '',
  } as HoveredNode)
  const [filterNodes, setFilterNodes] = useState(allNodes)

  var nodeNameMap: Map<string, NameAndNetwork> = useMemo(() => new Map(), [])

  const isNodeFiltered = (id: string) => {
    return !!~filterNodes.findIndex((node) => node.id === id)
  }

  const syncMetrics = useCallback(() => {
    dispatch(getNetMetrics.request())
  }, [dispatch])

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterNodes(allNodes)
    } else {
      setFilterNodes(
        allNodes.filter((node) =>
          `${hostsMap[node.hostid]?.name ?? ''}${node.address}${node.id}${
            node.network
          }`.includes(searchTerm)
        )
      )
    }
  }

  useEffect(() => {
    if (
      !!metrics &&
      Object.keys(currentMetrics).length !== Object.keys(metrics).length
    ) {
      setCurrentMetrics(metrics)
      setFilterNodes(allNodes)
    }
    if (!metrics) {
      syncMetrics()
    }
  }, [syncMetrics, currentMetrics, metrics, allNodes])

  useEffect(() => {
    if (!!allNodes) {
      allNodes.forEach((node) =>
        nodeNameMap.set(node.id, {
          name: hostsMap[node?.hostid]?.name,
          network: node.network,
        })
      )
    }
  }, [allNodes, hostsMap, nodeNameMap])

  useEffect(() => {
    if (!!extClients) {
      extClients.forEach((client) =>
        nodeNameMap.set(client.clientid, {
          name: client.clientid,
          network: client.network,
        })
      )
    }
  }, [extClients, nodeNameMap])

  const stickyColStyle = {
    position: 'sticky',
    left: 0,
    background: '#E8E8E8',
    zIndex: 1,
  }

  const getMetricsCellRender = (
    currMetric: NodeMetric | undefined,
    nodeID: string,
    loopID: string
  ) => {
    // if it's this node's index, render disabled thing
    if (nodeID === loopID) {
      // looking at self
      return <DisabledIcon color="inherit" />
    }

    return (
      <IconButton>
        {!!currMetric && currMetric.connected ? (
          <Tooltip
            title={`UP = ${getTimeMinHrs(currMetric.actualuptime).hours}h${
              getTimeMinHrs(currMetric.actualuptime).min
            }m : ${currMetric.percentup.toFixed(2)}% \t Latency = ${
              currMetric.latency
            }`}
          >
            <CheckCircle htmlColor="#2800ee" />
          </Tooltip>
        ) : (
          <Tooltip title={String(t('common.disconnected'))}>
            <NotAllowedIcon color="error" />
          </Tooltip>
        )}
      </IconButton>
    )
  }

  if (isProcessing || !!!nodeNameMap) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">
              {`${t('common.loading')} ${t('pro.metrics')}, ${t('node.none')}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={10} sx={{ marginTop: '3em' }}>
          <LinearProgress />
        </Grid>
      </Grid>
    )
  }
  if (
    !!!metrics ||
    !!!Object.keys(currentMetrics).length ||
    !!!Object.keys(currentMetrics.nodes).length
  )
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Grid item xs={12} style={{ marginTop: '5rem' }}>
          <Typography variant="h3">{t('pro.nometrics')}</Typography>
        </Grid>
      </Grid>
    )

  return (
    <Grid container justifyContent="center" alignItems="center">
      {!!netid && !!nodeNameMap && (
        <Grid item xs={6} md={4}>
          <div style={titleStyle}>
            <Typography variant="h5">
              {`${t('pro.metrics')} : ${netid}`}
            </Typography>
          </div>
        </Grid>
      )}
      <Grid item xs={3} md={4.5}>
        <div style={titleStyle}>
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
      <Grid item xs={3} md={2.5}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            component={Link}
            to={`/ec/metrics/${netid}`}
            sx={{ marginLeft: '1rem' }}
          >
            {t('extclient.extclients')}
          </Button>
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
      <Grid item xs={12} style={titleStyle}>
        {attempts >= MAX_ATTEMPTS && (
          <Typography color="red">{t('error.overload')}</Typography>
        )}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="metrics-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>{t('node.name')}</TableCell>
                  {!!currentMetrics &&
                    !!currentMetrics.nodes &&
                    Object.keys(currentMetrics.nodes).map((nodeID) => (
                      <TableCell align="center" key={nodeID}>
                        <MetricButton
                          sx={{
                            textTransform: 'none',
                            background:
                              hoveredCell.nodeID2 === nodeID ? HIGHLIGHT : '',
                          }}
                          link={`/metrics/${
                            netid || nodeNameMap.get(nodeID)?.network
                          }/${nodeID}`}
                          text={nodeNameMap.get(nodeID)?.name}
                        />
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!!currentMetrics &&
                  !!currentMetrics.nodes &&
                  Object.keys(currentMetrics.nodes).map((metricsID, index) => {
                    const currMetric = currentMetrics.nodes[metricsID]
                    return (nodeNameMap.size === 0 ||
                      nodeNameMap.has(metricsID)) &&
                      isNodeFiltered(metricsID) ? (
                      <TableRow
                        key={metricsID}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          background:
                            index % 2 === 0
                              ? inDarkMode
                                ? '#272727'
                                : '#f2f3f4'
                              : '',
                        }}
                      >
                        <TableCell
                          sx={{
                            ...stickyColStyle,
                            backgroundColor:
                              hoveredCell.nodeID1 === metricsID
                                ? HIGHLIGHT
                                : inDarkMode
                                ? '#272727'
                                : '',
                          }}
                          component="th"
                          scope="row"
                        >
                          <MetricButton
                            link={`/metrics/${
                              netid || nodeNameMap.get(metricsID)?.network
                            }/${metricsID}`}
                            text={nodeNameMap.get(metricsID)?.name}
                            sx={{ textTransform: 'none' }}
                          />
                        </TableCell>
                        {Object.keys(currentMetrics.nodes).map((loopID) => (
                          <TableCell
                            onMouseEnter={() =>
                              setHoveredCell({
                                nodeID1: metricsID,
                                nodeID2: loopID,
                              })
                            }
                            onMouseLeave={() =>
                              setHoveredCell({ nodeID1: '', nodeID2: '' })
                            }
                            key={`${loopID}-2`}
                            align="center"
                          >
                            {!!currMetric &&
                              !!currMetric.connectivity &&
                              getMetricsCellRender(
                                currMetric.connectivity[loopID],
                                metricsID,
                                loopID
                              )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ) : null
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
