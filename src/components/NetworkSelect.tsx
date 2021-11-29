import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { networkSelectors } from '../store/selectors'
import { useTranslation } from 'react-i18next'
import CustomSelect from '~components/select/CustomSelect'

export const NetworkSelect: React.FC<{
  selectAll? : boolean
}> = ({ selectAll }) => {
  const networkNames = useSelector(networkSelectors.getNetworks).map(n => n.netid)
  const { t } = useTranslation()
  const history = useHistory()
  const { netid } = useParams<{netid?: string}>()

  if (selectAll && !!netid) {
    networkNames.push(t('common.selectall'))
  }

  return (
    <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '1em'}}>
      <CustomSelect
        placeholder={`${t('common.select')} ${t('network.network')}`}
        onSelect={(selected) => {
          const netIndex = history.location.pathname.indexOf(netid!)
          if(netid === undefined) {
            history.push(`${history.location.pathname}/${selected}`)
          } else if (selectAll && selected === t('common.selectall')) {
            history.push(history.location.pathname.substr(0, netIndex))
          } else if(netid !== undefined) {
            history.push(history.location.pathname.replace(netid!, selected))
          }
        }}
        items={networkNames}
      />
    </div>
  )
}
