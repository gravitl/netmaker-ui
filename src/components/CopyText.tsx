import { Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import { TypographyVariant } from '@mui/material'
import copy from 'copy-to-clipboard'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

export interface CopyProps {
  value: string
  color?: string
  type: TypographyVariant
}

export default function CopyText(Props: CopyProps) {
  const { t } = useTranslation()

  return (
    <Tooltip title={`${t('common.copytext')}`} placement="bottom">
      <div onClick={() => copy(Props.value)}>
        <Button variant="text" sx={{ color: 'inherit' }}>
          <Typography variant={Props.type} color={Props.color}>
            {Props.value}
          </Typography>
        </Button>
      </div>
    </Tooltip>
  )
}
