import React from 'react'
import { Tooltip } from '@mui/material'
import { i18n } from '../../../../../i18n/i18n'
import { ExternalClient } from '~store/types'
import { useRouteMatch } from 'react-router'
import { NmLink } from '~components/Link'

export const EditExtClientButtonVpn: React.FC<{
  client: ExternalClient
}> = ({ client }) => {
  const { url } = useRouteMatch()

  return (
    <Tooltip
      title={`${i18n.t('common.edit')} : ${client.clientid}`}
      placement="top"
    >
      <NmLink
        to={`${url}/${client.clientid}/edit`}
        variant="text"
        sx={{ textTransform: 'none' }}
      >
        {client.clientid}
      </NmLink>
    </Tooltip>
  )
}
