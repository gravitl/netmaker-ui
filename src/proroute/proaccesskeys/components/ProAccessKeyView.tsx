import React from 'react'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/types'
import { useHistory, useParams } from 'react-router'
import AccessKeyDetails from '../../../route/accesskeys/components/AccessKeyDetails'
import { useTranslation } from 'react-i18next'
import { NotFound } from '~util/errorpage'

export const ProAccessKeyView: React.FC<{}> = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { netid, keyname } = useParams<{ netid: string; keyname: string }>()
  const userData = useSelector(proSelectors.networkUserData)[netid]
  if (!!!userData) {
    return <NotFound />
  }
  const networks = userData.networks
  const netIndex = networks.findIndex((network) => network.netid === netid)
  const accessKeys = networks[netIndex].accesskeys
  const keyIndex = accessKeys.findIndex(
    (accessKey) => accessKey.name === keyname
  )
  const accessKeyInfo = accessKeys[keyIndex]

  const handleClose = () => history.goBack()

  return (
    <AccessKeyDetails
      title={`${t('accesskey.details')} : ${keyname} `}
      open
      handleOpen={() => {}}
      handleClose={handleClose}
      accessString={accessKeyInfo.accessstring}
      keyValue={accessKeyInfo.value}
    />
  )
}
