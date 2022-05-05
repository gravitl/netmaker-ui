import { Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import { TypographyVariant } from '@mui/material'
import copy from 'copy-to-clipboard'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

// const { t } = useTranslation()

export interface CopyProps {
  value: string
  color?: string
  type: TypographyVariant
  align?: 'center' | 'inherit' | 'justify' | 'left' | 'right'
}

export default function CopyText(Props: CopyProps) {
  const { t } = useTranslation()

  return (
    <Tooltip title={`${t('network.copytext')}`} placement="bottom-start">
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
