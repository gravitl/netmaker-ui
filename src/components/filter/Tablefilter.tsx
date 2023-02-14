import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { useTranslation } from 'react-i18next'

export interface TablefilterProps {
  values: string[]
  onSelect: (selection: string) => void
  onAscendClick: () => void
  ascending: boolean
  currentValue: string
}

export function Tablefilter(props: TablefilterProps) {
  const { values, ascending, onSelect, onAscendClick, currentValue } = props
  const { t } = useTranslation()

  return (
    <Grid container justifyContent="space-around" alignItems="center">
      <Grid item xs={9.25}>
        <FormControl fullWidth>
          <InputLabel>{t('common.sortby')}</InputLabel>
          <Select
            label={t('common.sortby')}
            value={currentValue}
            onChange={(event: SelectChangeEvent) => {
              onSelect(event.target.value)
            }}
          >
            {!!values.length &&
              values.map((val) => <MenuItem value={val}>{val}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2.5}>
        <Tooltip
          title={
            !ascending
              ? String(t('common.ascend'))
              : String(t('common.descend'))
          }
        >
          <IconButton onClick={onAscendClick}>
            {ascending ? (
              <ArrowUpward color="primary" />
            ) : (
              <ArrowDownward color="primary" />
            )}
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
