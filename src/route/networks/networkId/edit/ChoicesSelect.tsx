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

export default function ChoicesSelect(props: {
  onSelect: (value: string) => void
  options: string[]
}) {
  const theme = useTheme()
  const [choices, setChoices] = React.useState<string[]>([])
  const { t } = useTranslation()

  const handleChange = (event: SelectChangeEvent<typeof choices>) => {
    const {
      target: { value },
    } = event
    setChoices(
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
    const newValues = props.options.join(',')
    setChoices(props.options)
    props.onSelect(newValues)
  }

  return (
    <Grid container justifyContent="space-evenly" alignItems="center">
      <Grid item xs={10}>
        <FormControl fullWidth>
          <InputLabel id="choice-select-label">{t('pro.choose')}</InputLabel>
          <Select
            labelId="choice-select-label"
            id="choice-select"
            multiple
            fullWidth
            value={choices}
            onChange={handleChange}
            input={
              <OutlinedInput
                id="select-multiple-values"
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
            {props.options.map((option) => (
              <MenuItem
                key={option}
                value={option}
                style={getStyles(option, choices, theme)}
              >
                {option}
              </MenuItem>
            ))}
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
