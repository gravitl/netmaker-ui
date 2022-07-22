import * as React from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTranslation } from 'react-i18next'

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

export default function ProCustomSelect(Props: {
  items: string[]
  onSelect: (s: string) => void
  placeholder: string
}) {
  const theme = useTheme()
  const [selectedItem, setSelectedItem] = React.useState<string[]>([])
  const { t } = useTranslation()
  const handleChange = (event: SelectChangeEvent<typeof selectedItem>) => {
    const {
      target: { value },
    } = event
    setSelectedItem(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
    Props.onSelect(value as string)
  }

  return (
    <div>
      <FormControl
        variant="outlined"
        sx={{
          m: 1,
          minWidth: '10rem',
          width: '25%',
          mt: 3,
          '& .MuiNativeSelect-select': {
            height: '90%',
            minHeight: '40vh',
          },
        }}
      >
        <InputLabel
          shrink
          htmlFor="select-multiple-native"
          style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#139da4' }}
        >
          {t('pro.label.selectnetwork')}
        </InputLabel>
        <Select
          style={{
            fontSize: '1.75rem',
            height: '100%',
            minHeight: '40vh',
          }}
          label={t('pro.label.selectnetwork')}
          multiple
          native
          value={selectedItem}
          onChange={handleChange}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{Props.placeholder}</em>
            }

            return selected.join(', ')
          }}
        >
          {Props.items.map((item) => (
            <option
              className="selected"
              key={item}
              value={item}
              style={getStyles(item, selectedItem, theme)}
            >
              {item}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
