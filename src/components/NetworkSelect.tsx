import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { networkSelectors } from '../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'
import { setCurrentNetwork } from '~store/modules/network/actions'

export const NetworkSelect: React.FC<{
  base: 'networks' | 'ext-clients' | 'access-keys' | 'dns'
  extension?: string
  selectAll? : boolean
}> = ({ base, extension, selectAll }) => {
  const dispatch = useDispatch()
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const networkNames = []
  if (listOfNetworks) {
    for (let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const { t } = useTranslation()
  const history = useHistory()
  if (selectAll) {
    networkNames.push(t('common.selectall'))
  }

  const handleCurrentNetChange = (newCurrentNetid : string) => {
    dispatch(setCurrentNetwork(newCurrentNetid))
  }

  return (
    <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '1em'}}>
      <CustomSelect
        placeholder={`${t('common.select')} ${t('network.network')}`}
        onSelect={(selected) => {
          if (selectAll && selected === t('common.selectall')) {
            handleCurrentNetChange(selected)
            history.push('/nodes')
          } else {
            handleCurrentNetChange(selected)
            history.push(
              `/${base}/${selected}${extension ? `/${extension}` : ''}`
            )
          }
        }}
        items={networkNames}
      />
    </div>
  )
}
