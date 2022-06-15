import {
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
  } from '@mui/material'
import React from 'react'
import {
  // Block,
  CheckCircle,
  NotInterested as NotAllowedIcon,
  RemoveCircleOutline as DisabledIcon,
  // RestartAlt,
  // Search,
} from '@mui/icons-material'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useDispatch, useSelector } from 'react-redux'
import { serverSelectors, nodeSelectors, authSelectors } from '~store/selectors'
import { getMetrics } from '~store/modules/server/actions'
import { NodeMetric, MetricsContainer } from '~store/types'
import { NmLink } from '~components/Link'
  
const HIGHLIGHT = '#D7BE69'
type HoveredNode = {
  nodeID1: string
  nodeID2: string
}

export const MetricsTable: React.FC = () => {
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const metrics = useSelector(serverSelectors.getMetrics)
  const isProcessing = useSelector(serverSelectors.isFetchingServerConfig)
  const { netid } = useParams<{ netid: string }>()
  const { nodeid } = useParams<{ nodeid: string }>()
  const allNodes = useSelector(nodeSelectors.getNodes)
  const inDarkMode = useSelector(authSelectors.isInDarkMode)
  const [currentMetrics, setCurrentMetrics] = React.useState({} as MetricsContainer)
  const [hoveredCell, setHoveredCell] = React.useState({
    nodeID1: '',
    nodeID2: '',
  } as HoveredNode)
  var nodeNameMap: Map<string, string> = new Map()

  useLinkBreadcrumb({
    link: url,
    title: t('pro.metrics'),
  })

  React.useEffect(() => {
      if (!!!Object.keys(currentMetrics).length) {
          dispatch(getMetrics.request(undefined))
      }
      if (!!metrics &&
          Object.keys(currentMetrics).length !== Object.keys(metrics).length) {
          setCurrentMetrics(metrics)
      }
  }, [dispatch, currentMetrics, metrics])

  // if (!!currentMetrics && !!currentMetrics.nodes) {
  //   // Object.keys(currentMetrics.nodes).map(metric => console.log(currentMetrics.nodes.get(metric)))
  //   console.log(currentMetrics)
  // }

  allNodes.map((node) => nodeNameMap.set(node.id, node.name))

  const stickyColStyle = {
    position: 'sticky',
    left: 0,
    background: '#E8E8E8',
    zIndex: 1,
  }

  const getMetricsCellRender = (currMetric: NodeMetric | undefined, nodeID: string, loopID: string) => {
    // if it's this node's index, render disabled thing
    if (nodeID === loopID) {
      // looking at self
      return <DisabledIcon color="inherit" />
    }
    return (
      <IconButton onTouchMove={(e) => console.log(JSON.stringify(currMetric))}>
        {!!currMetric && currMetric.connected ? (
          <Tooltip title={`Percent UP ${currMetric.percentup}`}>
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

  if (isProcessing) {
    // || (!isProcessing && (!!!currentMetrics || !!!currentMetrics.nodes || !!!currentMetrics.nodes.size))) {
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

  return (
    <Grid container>
      <Grid item xs={12}>
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
                  {!!currentMetrics && !!currentMetrics.nodes && Object.keys(currentMetrics.nodes).map((nodeID) => (
                    <TableCell align="center" key={nodeID}>
                      <NmLink
                        sx={{
                          textTransform: 'none',
                          background:
                            hoveredCell.nodeID2 === nodeID ? HIGHLIGHT : '',
                        }}
                        to={`/metrics/${netid}/${nodeID}`}
                      >
                        {nodeNameMap.get(nodeID)}
                      </NmLink>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!!currentMetrics && !!currentMetrics.nodes && Object.keys(currentMetrics.nodes).map((metricsID, index) => {
                  // console.log("ALL METRICS ", JSON.stringify(currentMetrics.nodes))
                
                  const currMetric = currentMetrics.nodes[metricsID]
                  return (
                    nodeNameMap.size === 0 ||
                    nodeNameMap.has(metricsID) ? (
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
                          <NmLink
                            sx={{ textTransform: 'none' }}
                            // disabled={!!nodeid}
                            to={`${url}/${metricsID}`}
                          >
                            {nodeNameMap.get(metricsID)}
                          </NmLink>
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
                            {getMetricsCellRender(currMetric.connectivity[loopID], metricsID, loopID)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ) : null
                )})}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        </Grid>
      </Grid>
  )
}
