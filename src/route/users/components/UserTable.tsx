import React from 'react'
import { useSelector } from 'react-redux'
import { authSelectors } from '~store/selectors'
import { NmLink } from '~components/Link'
import { NmTable, TableColumns } from '~components/Table'
import { User } from '~store/types'

const columns: TableColumns<User> = [
  {
    id: 'name',
    labelKey: 'users.name',
    minWidth: 170,
    sortable: true,
    format: (value) => <NmLink to={`/users/${value}`}>{value}</NmLink>,
  },
  {
    id: 'isAdmin',
    labelKey: 'users.isAdmin',
    minWidth: 100,
    sortable: true,
    format: (isAdmin) => (isAdmin ? 'True' : 'False'),
  },
  {
    id: 'networks',
    labelKey: 'users.networks',
    minWidth: 150,
    sortable: false,
    format: (networks, user) => {
      if (user.isAdmin && (!networks || !networks.length))
        return <span>*</span>
      return (
      <span>
        {networks?.map((network) => (
          <NmLink key={network} to={`/networks/${network}`}>
            {network}
          </NmLink>
        ))}
      </span>
    )},
  },
]

export const UserTable: React.FC = () => {
  const users = useSelector(authSelectors.getUsers)

  return (
    <>
      <NmTable columns={columns} rows={users} getRowId={(row) => row.name} />
    </>
  )
}
