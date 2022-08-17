import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { proSelectors } from '~store/selectors'
import { NetAdminDashboard } from '../dashboards/NetAdminDashboard'
import { NodeUserDashboard } from '../dashboards/NodeUserDashboard'
import {
  NET_ADMIN_ACCESS_LVL,
  NODE_ACCESS_LVL,
  CLIENT_ACCESS_LVL,
} from '../ProConsts'

import { NotFound } from '~util/errorpage'
import { VpnDashboard } from '../dashboards/VpnDashboard'

export default function NetUserView() {
  const { netid } = useParams<{ netid: string }>()
  const allUserData = useSelector(proSelectors.networkUserData)

  if (!!!allUserData || !!!allUserData[netid]) {
    return <NotFound />
  }

  const userData = allUserData[netid]

  switch (userData.user.accesslevel) {
    case NET_ADMIN_ACCESS_LVL:
      return <NetAdminDashboard />
    case NODE_ACCESS_LVL:
      return <NodeUserDashboard />
    case CLIENT_ACCESS_LVL:
      return <VpnDashboard />
    default:
      return <div>NO ACCESS</div>
  }
}
