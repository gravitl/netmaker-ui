import React from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useDispatch } from 'react-redux'
import { Node } from '~modules/node'
import { NmTable, TableColumns } from '~components/Table'
import { Chip } from '@mui/material'
import { encode64 } from '~util/fields'
import { TableToggleButton } from '../netid/components/TableToggleButton'
import { AltRoute, CallMerge, CallSplit, Delete } from '@mui/icons-material'
import { i18n } from '../../../i18n/i18n'
import { deleteNode } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'

const columns: TableColumns<Node> = [
  {
    id: 'name',
    labelKey: 'node.name',
    minWidth: 100,
    sortable: true,
    format: (value, node) => (
      <NmLink
        to={`/nodes/${node.network}/${encodeURIComponent(
          encode64(node.id)
        )}`}
        sx={{textTransform: 'none'}}
      >
        {value}{`${node.ispending === 'yes' ? ` (${i18n.t('common.pending')})` : ''}`}
      </NmLink>
    ),
  },
  {
    id: 'address',
    labelKey: 'node.address',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'network',
    labelKey: 'node.network',
    minWidth: 170,
    align: 'right',
    format: (value) => <NmLink sx={{textTransform: 'none'}} to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: 'isegressgateway',
    labelKey: 'node.statusegress',
    minWidth: 30,
    align: 'center',
    format: (isegress, row) => (
      <TableToggleButton
        which="egress"
        isOn={isegress}
        node={row}
        createText={`${i18n.t('node.createegress')} : ${row.name}`}
        removeText={`${i18n.t('node.removeegress')} : ${row.name}`}
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
    format: (isingress, row) => (
      <TableToggleButton
        which="ingress"
        isOn={isingress}
        node={row}
        createText={`${i18n.t('node.createingress')} : ${row.name}`}
        removeText={`${i18n.t('node.removeingress')} : ${row.name}`}
        SignalIcon={<CallMerge />}
      />
    ),
  },
  {
    id: 'isrelay',
    labelKey: 'node.statusrelay',
    minWidth: 30,
    align: 'center',
    format: (isrelay, row) => (
      <TableToggleButton
        which="relay"
        isOn={isrelay}
        node={row}
        createText={`${i18n.t('node.createrelay')} : ${row.name}`}
        removeText={`${i18n.t('node.removerelay')} : ${row.name}`}
        SignalIcon={<AltRoute />}
        withHistory
      />
    ),
  },
  {
    id: 'lastcheckin',
    labelKey: 'node.status',
    minWidth: 130,
    align: 'center',
    format: (lastcheckin) => {
      const time = Date.now() / 1000
      if (time - lastcheckin >= 1800)
        return <Chip color="error" label="ERROR" />
      if (time - lastcheckin >= 300)
        return <Chip color="warning" label="WARNING" />
      return <Chip color="success" label="HEALTHY" />
    },
  },
]

export const NodeTable: React.FC<{nodes: Node[]}> = ({nodes}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [selected, setSelected] = React.useState({} as Node)

  useLinkBreadcrumb({
    title: t('breadcrumbs.nodes'),
  })

  const handleClose = () => {
    setSelected({} as Node)
  }

  const handleOpen = (node: Node) => {
    setSelected(node)
  }

  const handleDeleteNode = () => {
    if (!!selected.name) {
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
    <NmTable 
      columns={columns} 
      rows={nodes} 
      getRowId={(row) => row.id} 
      actions={[(row) => ({
        tooltip: t('common.delete'),
        disabled: false,
        icon: <Delete />,
        onClick: () => {
          handleOpen(row)
        },
      }),
      ]}
    />
    <CustomizedDialogs
      open={!!selected.name}
      handleClose={handleClose}
      handleAccept={handleDeleteNode}
      message={t('node.deleteconfirm')}
      title={`${t('common.delete')} ${selected.name}`}
    />
    </div>
  )
}
