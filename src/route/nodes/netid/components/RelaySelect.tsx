import * as React from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import { Grid, IconButton, Tooltip } from '@mui/material'
import { AllOut } from '@mui/icons-material'

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

function getStyles(name: string, nodeName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      nodeName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

export default function RelaySelect(props: {
  onSelect: (value: string) => void
  names: { name: string; address: string, isserver: boolean }[]
}) {
  const theme = useTheme()
  const [nodeName, setNodeName] = React.useState<string[]>([])
  const { t } = useTranslation()

  const handleChange = (event: SelectChangeEvent<typeof nodeName>) => {
    const {
      target: { value },
    } = event
    setNodeName(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
    if (typeof value === 'string') {
      props.onSelect(value)
    } else {
      props.onSelect(value.join(','))
    }
  }

  const handleSelectAll = () => {
    const addresses = props.names.map((obj) => obj.address)
    const newValues = addresses.join(',')
    setNodeName(addresses)
    props.onSelect(newValues)
  }

  return (
    <Grid container justifyContent="space-evenly" alignItems="center">
      <Grid item xs={10}>
        <FormControl fullWidth>
          <InputLabel id="relay-select-label">{t('node.choose')}</InputLabel>
          <Select
            labelId="relay-select-label"
            id="relay-select"
            multiple
            fullWidth
            value={nodeName}
            onChange={handleChange}
            input={
              <OutlinedInput
                id="select-multiple-nodes"
                label={String(t('node.choose'))}
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {props.names.map(({ name, address, isserver }) => !isserver ? (
              <MenuItem
                key={name}
                value={address}
                style={getStyles(name, nodeName, theme)}
              >
                {name}
              </MenuItem>
            ) : null)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title={t('common.selectall') as string} placement="top">
          <IconButton onClick={handleSelectAll} color="primary">
            <AllOut />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
