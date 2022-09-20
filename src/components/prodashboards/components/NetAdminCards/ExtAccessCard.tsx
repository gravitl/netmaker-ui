import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '@mui/material/Card'

// import CreateIcon from '@mui/icons-material/AddBox';
import { grey } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar'
import { ExternalClient } from '~store/types'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Devices } from '@mui/icons-material'
import { Button, useTheme } from '@mui/material'

export default function ExtAccessCard(Props: { clients: ExternalClient[] }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { netid } = useParams<{ netid: string }>()

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    height: '100%',
    width: '100%',
    minHeight: '14em',
  }

  const cardContentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  } as any

  return (
    <Button
      component={Link}
      to={`${netid}/vpnview`}
      color={'inherit'}
      fullWidth
      style={{ textTransform: 'none' }}
    >
      <Card
        sx={{ minWidth: 275, backgroundColor: grey[200] }}
        variant="outlined"
        style={cardStyle}
      >
        <CardContent>
          <Avatar
            sx={{ bgcolor: grey[900] }}
            aria-label={String(t('pro.label.vpnaccess'))}
          >
            <Devices sx={{ color: theme.palette.common.white }} />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div" color="black">
              {t('pro.label.vpnaccess')}
            </Typography>
            <Typography variant="body2" color="primary">
              {`${t('pro.label.clientconfig')}`}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Button>
  )
}
