import { Tooltip } from '@mui/material'
import Typography from '@mui/material/Typography'
import copy from 'copy-to-clipboard'
import { Button } from '@mui/material'

export interface CopyProps {
  value: string
  color?: string
  type: 'subtitle1' | 'subtitle2'
}

export default function CopyText(Props: CopyProps) {
  return (
    <Tooltip title="Copy" placement="bottom-start">
      <div onClick={() => copy(Props.value)}>
        <Button variant="text">
          <Typography variant={Props.type} color={Props.color}>
            {Props.value}
          </Typography>
        </Button>
      </div>
    </Tooltip>
  )
}
