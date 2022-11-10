import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { networkSelectors } from '~store/selectors'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { clearCurrentMetrics } from '~store/modules/server/actions'
import { Theme, useTheme } from '@mui/material/styles'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

export const NetworkSelect: React.FC<{
  selectAll?: boolean
}> = ({ selectAll }) => {
  const networks = useSelector(networkSelectors.getNetworks)
  const [networkNames, setNetworkNames] = useState<string[]>([])
  const { t } = useTranslation()
  const history = useHistory()
  const { netid } = useParams<{ netid?: string }>()
  const dispatch = useDispatch()
  const theme = useTheme()
  const [selectedNetworkName, setSelectedNetworkName] = useState('')

  const onNetworkChange = (networkId: string) => {
    setSelectedNetworkName(networkId)

    dispatch(clearCurrentMetrics())

    const netIndex = history.location.pathname.indexOf(netid!)
    if (netid === undefined) {
      history.push(`${history.location.pathname}/${networkId}`)
    } else if (selectAll && networkId === t('common.selectall')) {
      history.push(history.location.pathname.substr(0, netIndex - 1))
    } else if (netid !== undefined) {
      history.push(history.location.pathname.replace(netid!, networkId))
    }
  }

  // extract network ids and
  // auto-select network from url
  useEffect(() => {
    setNetworkNames(networks.map((n) => n.netid))

    if (netid) {
      onNetworkChange(netid)
    }
  }, [networks])

  if (
    selectAll &&
    netid &&
    networkNames.indexOf(t('common.selectall')) === -1
  ) {
    networkNames.push(t('common.selectall'))
  }

  return (
    <Grid container justifyContent="space-around" alignItems="center">
      <Grid item xs={12} sx={{ mt: 2, mx: 1 }}>
        <FormControl fullWidth>
          <Select
            displayEmpty
            value={selectedNetworkName}
            onChange={(e: SelectChangeEvent<string>) =>
              onNetworkChange(e.target.value)
            }
            input={<OutlinedInput />}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': t('common.select') }}
          >
            <MenuItem disabled value="">
              <em>{`${t('common.select')} ${t('network.network')}`}</em>
            </MenuItem>
            {networkNames.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, networkNames, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}
