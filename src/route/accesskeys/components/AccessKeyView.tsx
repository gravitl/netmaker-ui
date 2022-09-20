import React from 'react'
import { useSelector } from 'react-redux'
import { networkSelectors } from '~store/types'
import { useHistory, useParams } from 'react-router'
import AccessKeyDetails from './AccessKeyDetails'
import { useTranslation } from 'react-i18next'
import { NotFound } from '~util/errorpage'

export const AccessKeyView: React.FC<{}> = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { netid, keyname } = useParams<{ netid: string; keyname: string }>()
  const networks = useSelector(networkSelectors.getNetworks)
  const netIndex = networks.findIndex((network) => network.netid === netid)

  if (!~netIndex) {
    return <NotFound />
  }

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
      netID={netid}
    />
  )
}
