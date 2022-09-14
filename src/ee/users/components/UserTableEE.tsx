import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authSelectors } from '~store/selectors'
import { NmLink } from '~components/Link'
import { NmTable, TableColumns } from '~components/Table'
import { User } from '~store/types'
import { Delete } from '@mui/icons-material'
import { useDialog } from '~components/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { deleteUser } from '~store/modules/auth/actions'
import { Typography } from '@mui/material'

const columns: TableColumns<User> = [
  {
    id: 'name',
    labelKey: 'users.table.name',
    minWidth: 170,
    sortable: true,
    format: (username) => <NmLink to={`/users/${username}`}>{username}</NmLink>,
  },
  {
    id: 'isAdmin',
    labelKey: 'users.table.isAdmin',
    minWidth: 100,
    sortable: true,
    format: (isAdmin) => (isAdmin ? 'True' : 'False'),
  },
  {
    id: 'networks',
    labelKey: 'users.table.networks',
    minWidth: 150,
    sortable: false,
    format: (networks, user) => {
      if (user.isAdmin && (!networks || !networks.length)) return <span>*</span>
      return (
        <span>
          {networks?.map((network) => (
            <NmLink key={network} to={`/networks/${network}`}>
              {network}
            </NmLink>
          ))}
        </span>
      )
    },
  },
  {
    id: 'groups',
    labelKey: 'pro.networkusers.groups',
    minWidth: 150,
    sortable: false,
    format: (groups, user) => {
      if (user.isAdmin && (!groups || !groups.length)) return <span>*</span>
      return (
        <span>
          {groups?.map((g) => (
            <Typography key={g} variant="subtitle2">
              {g}
            </Typography>
          ))}
        </span>
      )
    },
  },
]

export const UserTableEE: React.FC = () => {
  const users = useSelector(authSelectors.getUsers)
  const { Component: Dialog, setProps } = useDialog()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <>
      <NmTable
        columns={columns}
        rows={users}
        getRowId={(row) => row.name}
        actions={[
          (row) => ({
            tooltip: t('common.delete'),
            disabled: false,
            icon: <Delete />,
            onClick: () => {
              setProps({
                message: t('users.delete'),
                title: t('users.deleteTitle'),
                onSubmit: () =>
                  dispatch(
                    deleteUser.request({
                      username: row.name,
                    })
                  ),
              })
            },
          }),
        ]}
      />
      <Dialog />
    </>
  )
}
