import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import { NmTable, TableColumns } from '~components/Table'
import { Delete } from '@mui/icons-material'
import { useDialog } from '~components/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { deleteUserGroup, getUserGroups } from '~store/modules/pro/actions'
import { IconButton, Tooltip } from '@mui/material'

type UserGroup = {
  groupname: string;
  action?: any;
}

export const UserGroupsTable: React.FC = () => {
  const userGroups = useSelector(proSelectors.userGroups)
  const { Component: Dialog, setProps } = useDialog()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentGroups = [] as UserGroup[]

  if (!!userGroups && !!userGroups.length) {
    for (let i = 0; i < userGroups.length; i++) {
      currentGroups.push({groupname: userGroups[i]})
    }
  }

  React.useEffect(() => {
    if (!!!userGroups || !!!userGroups.length) {
      dispatch(getUserGroups.request())
    }
  }, [userGroups, dispatch])

  const columns: TableColumns<UserGroup> = [
    {
      id: 'groupname',
      labelKey: 'pro.label.usergroup',
      minWidth: 200,
      sortable: true,
      align: 'center',
    },
    {
      id: 'action',
      labelKey: 'common.delete',
      minWidth: 100,
      align: 'center',
      format: ((_, row) => <Tooltip title={String(t('common.delete'))} placement='top'>
        <IconButton
          color='secondary'
          onClick={() => {
            setProps({
              message: `${t('common.delete')} ${t('pro.label.usergroup')} "${row.groupname}"`,
              title: t('common.submit'),
              onSubmit: () => {
                dispatch(
                  deleteUserGroup.request({
                    groupName: row.groupname
                  })
                )},
            })
          }} >
          <Delete />
        </IconButton>
      </Tooltip>)
    },
  ]

  return (
    <>
      <NmTable
        columns={columns}
        rows={currentGroups}
        getRowId={(row, i) => `${row.groupname}-${i}`}
      />
      <Dialog />
    </>
  )
}
