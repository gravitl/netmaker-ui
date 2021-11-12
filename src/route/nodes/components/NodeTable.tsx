import React from 'react'
import { useSelector } from 'react-redux'
import { nodeSelectors } from '~store/selectors'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { Node } from '~modules/node'
import { NmTable, TableColumns } from '~components/Table'
import { Chip } from '@mui/material'
import { encode64 } from '~util/fields'
import { TableToggleButton } from '../../networks/networkId/nodes/components/TableToggleButton'
import { AltRoute, CallMerge, CallSplit } from '@mui/icons-material'
import { i18n } from '../../../i18n/i18n'

const columns: TableColumns<Node> = [
  { id: 'name',
    labelKey: 'node.name',
    minWidth: 100,
    sortable: true,
    format: (value, node) => (
      <NmLink
        to={`/networks/${node.network}/nodes/${encodeURIComponent(encode64(node.id))}`}
      >
        {value}
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
    format: (value) => <NmLink to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: 'isegressgateway',
    labelKey: 'node.statusegress',
    minWidth: 30,
    align: 'center',
    format: (isegress, row) =>
    <TableToggleButton 
      which='egress'
      isOn={isegress}
      node={row}
      createText={`${i18n.t('node.createegress')} : ${row.name}`}
      removeText={`${i18n.t('node.removeegress')} : ${row.name}`}
      SignalIcon={<CallSplit />}
      withHistory
    />
  },
  {
    id: 'isingressgateway',
    labelKey: 'node.statusingress',
    minWidth: 30,
    align: 'center',
    format: (isingress, row) =>
    <TableToggleButton 
      which='ingress'
      isOn={isingress}
      node={row}
      createText={`${i18n.t('node.createingress')} : ${row.name}`}
      removeText={`${i18n.t('node.removeingress')} : ${row.name}`}
      SignalIcon={<CallMerge />}
    />
  },
  {
    id: 'isrelay',
    labelKey: 'node.statusrelay',
    minWidth: 30,
    align: 'center',
    format: (isrelay, row) =>
      <TableToggleButton
        which='relay'
        isOn={isrelay}
        node={row}
        createText={`${i18n.t('node.createrelay')} : ${row.name}`}
        removeText={`${i18n.t('node.removerelay')} : ${row.name}`}
        SignalIcon={<AltRoute />}
        withHistory
      />
  },
  {
    id: 'lastcheckin',
    labelKey: 'node.status',
    minWidth: 170,
    align: 'right',
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

export const NodeTable: React.FC = () => {
  const { t } = useTranslation()
  const listOfNodes = useSelector(nodeSelectors.getNodes)

  useLinkBreadcrumb({
    title: t('breadcrumbs.nodes'),
  })

  return (
    <NmTable columns={columns} rows={listOfNodes} getRowId={(row) => row.id} />
  )
}
