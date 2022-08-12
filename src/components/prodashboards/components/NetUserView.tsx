import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { proSelectors } from '~store/selectors'
import { NetAdminDashboard } from './NetAdminDashboard'
import { NodeUserDashboard } from '../NodeUserDashboard'

import { NotFound } from '~util/errorpage'

const NET_ADMIN_ACCESS_LVL = 0
const NODE_ACCESS_LVL = 1
const CLIENT_ACCESS_LVL = 2

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
      return <NodeUserDashboard />
    default:
      return <div>NO ACCESS</div>
  }
}
