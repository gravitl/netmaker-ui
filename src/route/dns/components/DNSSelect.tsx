import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomSelect from '../../../components/CustomSelect'
import { Grid } from '@mui/material'

export const DNSSelect: React.FC<{
  nodeAddrs: Array<string>
  onSelect: (selected: string) => void
}> = ({ nodeAddrs, onSelect }) => {
  const { t } = useTranslation()

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid
        item
        xs={6}
        sx={{
          textAlign: 'center',
        }}
      >
        <CustomSelect
          placeholder={`${t('common.select')} ${t('dns.nodeaddress')}`}
          onSelect={(selected) => {
            onSelect(selected.split(' ')[0])
          }}
          items={nodeAddrs}
        />
      </Grid>
    </Grid>
  )
}
