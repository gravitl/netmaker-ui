import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { proSelectors } from '~store/selectors'
import { NetAdminDashboard } from './NetAdminDashboard'
import { NodeAccessView } from './NodeAccessView'

import { ExtClients } from './vpnview/VpnViewHome'

const NET_ADMIN_ACCESS_LVL = 0
const NODE_ACCESS_LVL = 1
const CLIENT_ACCESS_LVL = 2

export default function NetUserView() {
  const { netid } = useParams<{ netid: string }>()
  const allUserData = useSelector(proSelectors.networkUserData)

  if (!!!allUserData || !!!allUserData[netid]) {
    ;<div>Not found</div>
  }

  const userData = allUserData[netid]

  switch (userData.user.accesslevel) {
    case NET_ADMIN_ACCESS_LVL:
      return <NetAdminDashboard />
    case NODE_ACCESS_LVL:
      return <NodeAccessView />
    case CLIENT_ACCESS_LVL:
      return <ExtClients />
    default:
      return <div>NO ACCESS</div>
  }
}
