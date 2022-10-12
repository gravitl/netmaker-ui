import {
    Grid,
    InputAdornment,
    TextField,
    Typography,
    Tooltip,
    IconButton,
  } from '@mui/material'
  import React from 'react'
  import { useParams } from 'react-router-dom'
  import { useTranslation } from 'react-i18next'
  import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
  import { UptimeChart } from './charts/Uptime'
  import { useSelector, useDispatch } from 'react-redux'
  import { serverSelectors } from '~store/selectors'
  import { NodeMetric } from '~store/types'
  import { NmTable, TableColumns } from '~components/Table'
  import { Search, Sync } from '@mui/icons-material'
  import Loading from '~components/Loading'
  import { getExtMetrics } from '~store/modules/server/actions'
  import CopyText from '~components/CopyText'
import { GenericError } from '~util/genericerror'
  
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
  
  export const ExtMetrics: React.FC = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { netid } = useParams<{ netid: string }>()
    const metrics = useSelector(serverSelectors.getNetworkExtMetrics(netid))
    const isFetching = useSelector(serverSelectors.isFetchingClientMetrics)
    const [filterString, setFilterString] = React.useState('')
    const [hasSynced, setHasSynced] = React.useState(false)
  
    const syncMetrics = () => {
      if (!hasSynced) {
        dispatch(getExtMetrics.request())
        setHasSynced(true)
      }
    }
  
    useLinkBreadcrumb({
      link: `/ec/metrics/${netid}`,
      title: t('extclient.extclients'),
    })
  
    useLinkBreadcrumb({
      link: `/metrics/${netid}`,
      title: netid,
    })
  
    const handleFilter = (event: { target: { value: string } }) => {
      const { value } = event.target
      const searchTerm = value.trim()
      if (!!!searchTerm) {
        setFilterString('')
      } else {
          setFilterString(value)
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
  
  
    const columns: TableColumns<NodeMetric> = [
      {
        id: 'node_name',
        label: t('extclient.extclient'),
        minWidth: 170,
        sortable: true,
        format: (_, metric) => (
         <CopyText value={metric.node_name} type='subtitle1' />
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
  
    if (hasSynced && (!metrics || !Object.keys(metrics).length)) {
        return <GenericError />
      }

    if (isFetching) {
      return <Grid container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
                <Loading />
            </Grid>
            <Grid item xs={12}>
                <div style={{textAlign: 'center'}}>
                    <Typography variant='h6' color={'warning'}>{t('pro.helpers.noclients')}</Typography>
                </div>
            </Grid>
        </Grid>
    }
  
    if (!hasSynced && (!metrics || !Object.keys(metrics).length)) {
      syncMetrics()
      return <GenericError />
    }

    const extMetrics = Object.keys(metrics).map(k => metrics[k])
  
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={10} md={8} style={styles.center}>
          <Typography variant="h3">{t('pro.extmetrics')}</Typography>
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
              {!!filterString ? (
                <NmTable
                  columns={columns}
                  rows={extMetrics.filter(
                    (e) => `${e.node_name}`.includes(filterString)
                  )}
                  getRowId={(row) => row.node_name}
                />
              ) : (
                <NmTable
                  columns={columns}
                  rows={extMetrics}
                  getRowId={(row) => row.node_name}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  