import React from 'react'
import { NmLink } from '~components/index'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useDispatch } from 'react-redux'
import { Node } from '~modules/node'
import { NmTable, TableColumns } from '~components/Table'
import { Chip } from '@mui/material'
import { TableToggleButton } from '../netid/components/TableToggleButton'
import { AltRoute, CallMerge, CallSplit, Delete } from '@mui/icons-material'
import { i18n } from '../../../i18n/i18n'
import { deleteNode } from '~store/modules/node/actions'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import CopyText from '~components/CopyText'

export const NodeTable: React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [selected, setSelected] = React.useState({} as Node)

  const columns: TableColumns<Node> = [
    {
      id: 'name',
      labelKey: 'node.name',
      minWidth: 100,
      sortable: true,
      format: (value, node) => (
        <NmLink
          to={`/nodes/${node.network}/${encodeURIComponent(node.id)}`}
          sx={{ textTransform: 'none' }}
        >
          {value}
          {`${
            node.ispending === 'yes' ? ` (${i18n.t('common.pending')})` : ''
          }`}
        </NmLink>
      ),
    },
    {
      id: 'address',
      labelKey: 'node.addresses',
      minWidth: 130,
      align: 'right',
      format: (_, node) => (
        <>
          <CopyText
            value={`${!!node.address ? node.address : ''}${' '}${
              !!node.address6 ? node.address6 : ''
            }`}
            type="subtitle2"
          />
        </>
      ),
    },
    {
      id: 'version',
      labelKey: 'node.version',
      minWidth: 50,
      align: 'center',
      format: (value) => <>{!!value ? value : 'N/A'}</>,
    },
    {
      id: 'network',
      labelKey: 'node.network',
      minWidth: 100,
      align: 'center',
      format: (value) => (
        <NmLink sx={{ textTransform: 'none' }} to={`/networks/${value}`}>
          {value}
        </NmLink>
      ),
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
      minWidth: 170,
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
      <hr />
      <NmTable
        columns={columns}
        rows={nodes}
        getRowId={(row) => row.id}
        actions={[
          (row) => ({
            tooltip: !row.isserver ? t('common.delete') : t('common.disabled'),
            disabled: row.isserver,
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
