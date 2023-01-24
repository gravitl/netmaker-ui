import React, { useCallback, useMemo } from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useDispatch } from 'react-redux'
import { Node } from '~modules/node'
import { NmTable, TableColumns } from '~components/Table'
import { Chip, Tooltip } from '@mui/material'
import { TableToggleButton } from '../netid/components/TableToggleButton'
import {
  // AltRoute,
  CallMerge,
  CallSplit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { i18n } from '../../../i18n/i18n'
import { deleteNode } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { MultiCopy } from '~components/CopyText'
import { useSelector } from 'react-redux'
import { hostsSelectors, serverSelectors } from '~store/selectors'
import { FailoverButton } from '../../../ee/nodes/FailoverButton'
import { getConnectivityStatus } from '~util/node'
import { useHistory } from 'react-router-dom'
import LoadingText from '~components/LoadingText'

type NodeTableDataType = Node & {
  version: string
  name: string
}

export const NodeTable: React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [selected, setSelected] = React.useState({} as Node)
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const history = useHistory()
  const hostsMap = useSelector(hostsSelectors.getHostsMap)

  const commonCols: TableColumns<NodeTableDataType> = useMemo(
    () => [
      {
        id: 'name',
        labelKey: 'hosts.name',
        minWidth: 100,
        format(value) {
          return <LoadingText text={value} />
        },
      },
      {
        id: 'network',
        labelKey: 'node.network',
        minWidth: 100,
        align: 'center',
        format: (value) => (
          <Tooltip
            disableTouchListener
            title={`${t('node.connected') as string}${value}`}
            placement="top"
          >
            <NmLink sx={{ textTransform: 'none' }} to={`/networks/${value}`}>
              {value}
            </NmLink>
          </Tooltip>
        ),
      },
      {
        id: 'address',
        labelKey: 'node.addresses',
        minWidth: 130,
        align: 'right',
        format: (_, node) => (
          <MultiCopy type="subtitle2" values={[node.address, node.address6]} />
        ),
      },
      {
        id: 'version',
        labelKey: 'common.version',
        minWidth: 50,
        align: 'center',
        format(value) {
          return <LoadingText text={value} />
        },
      },
      {
        id: 'isegressgateway',
        labelKey: 'node.statusegress',
        minWidth: 30,
        align: 'center',
        format: (isegress, row) =>
          row.pendingdelete ? (
            <></>
          ) : (
            <TableToggleButton
              which="egress"
              isOn={isegress}
              node={row}
              createText={`${i18n.t('node.createegress')} : ${
                hostsMap[row.hostid]?.name ?? 'N/A'
              }`}
              removeText={`${i18n.t('node.removeegress')} : ${
                hostsMap[row.hostid]?.name ?? 'N/A'
              }`}
              SignalIcon={<CallSplit />}
              withHistory
            />
          ),
      },
      {
        id: 'isingressgateway',
        labelKey: 'node.statusingress',
        minWidth: 30,
        align: 'center',
        format: (isingress, row) =>
          row.pendingdelete ? (
            <></>
          ) : (
            <TableToggleButton
              which="ingress"
              isOn={isingress}
              node={row}
              createText={`${i18n.t('node.createingress')} : ${
                hostsMap[row.hostid]?.name ?? 'N/A'
              }`}
              removeText={`${i18n.t('node.removeingress')} : ${
                hostsMap[row.hostid]?.name ?? 'N/A'
              }`}
              SignalIcon={<CallMerge />}
            />
          ),
      },
      {
        id: 'lastcheckin',
        labelKey: 'node.status',
        minWidth: 170,
        align: 'center',
        format: (lastCheckInTime, row) => {
          if (row.pendingdelete) {
            return <></>
          }

          const status = getConnectivityStatus(lastCheckInTime)
          switch (status) {
            case 'error':
              return (
                <Tooltip title={t('node.error') as string} placement="top">
                  <Chip color="error" label="ERROR" />
                </Tooltip>
              )
            case 'warning':
              return (
                <Tooltip title={t('node.warning') as string} placement="top">
                  <Chip color="warning" label="WARNING" />
                </Tooltip>
              )
            default:
              return (
                <Tooltip title={t('node.healthy') as string} placement="top">
                  <Chip color="success" label="HEALTHY" />
                </Tooltip>
              )
          }
        },
      },
    ],
    [hostsMap, t]
  )

  const columns: TableColumns<NodeTableDataType> = useMemo(
    () =>
      serverConfig.IsEE
        ? [
            ...commonCols.slice(0, commonCols.length - 1),
            {
              id: 'failover',
              labelKey: 'node.failover',
              minWidth: 30,
              align: 'center',
              format: (_, row) => <FailoverButton node={row} />,
            },
            commonCols[commonCols.length - 1],
          ]
        : commonCols,
    [commonCols, serverConfig.IsEE]
  )

  const tableData: NodeTableDataType[] = useMemo(
    () =>
      nodes.map((node) => ({
        name: hostsMap[node.hostid]?.name ?? '',
        version: hostsMap[node.hostid]?.version ?? '',
        ...node,
      })),
    [hostsMap, nodes]
  )

  const nodeRowStyles = useMemo(
    () =>
      tableData
        .filter((node) => node.pendingdelete)
        .reduce((acc, node) => {
          acc[node.id] = { color: 'grey' }
          return acc
        }, {} as { [rowId: React.Key]: Object }),
    [tableData]
  )

  useLinkBreadcrumb({
    title: t('breadcrumbs.nodes'),
  })

  const handleClose = () => {
    setSelected({} as Node)
  }

  const handleOpen = (node: Node) => {
    setSelected(node)
  }

  const handleViewDetails = useCallback(
    (node: Node) => {
      history.push(`/nodes/${node.network}/${encodeURIComponent(node.id)}`)
    },
    [history]
  )

  const handleDeleteNode = () => {
    if (selected.id) {
      dispatch(
        deleteNode.request({
          netid: selected.network,
          nodeid: selected.id,
        })
      )
      handleClose()
    }
  }

  return (
    <div>
      <hr />
      <NmTable
        columns={columns}
        rows={tableData}
        getRowId={(row, i) => row.id}
        actions={[
          (row) => ({
            tooltip: t('common.view'),
            icon: <Visibility />,
            onClick: () => {
              handleViewDetails(row)
            },
          }),
          (row) => ({
            tooltip: t('common.delete'),
            icon: <Delete />,
            onClick: () => {
              handleOpen(row)
            },
          }),
        ]}
        rowCellsStyles={nodeRowStyles}
      />
      <CustomizedDialogs
        open={!!selected.id}
        handleClose={handleClose}
        handleAccept={handleDeleteNode}
        message={t('node.deleteconfirm')}
        title={`${t('common.delete')} ${selected.id}`}
      />
    </div>
  )
}
