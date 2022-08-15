import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'

import { grey } from '@mui/material/colors'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Wifi } from '@mui/icons-material'
import { Button, Grid, useTheme } from '@mui/material'

export default function AdminNetworkCard() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { netid } = useParams<{ netid: string }>()

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    height: '100%',
    minHeight: '14em',
    width: '100%',
    padding: '.5em',
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
      to={`${netid}/proedit`}
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
            aria-label={String(t('network.networks'))}
          >
            <Wifi sx={{ color: theme.palette.common.white }} />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div" color="black">
              {t('pro.network.networkedit')}
            </Typography>
            <Typography variant="body2" color="primary">
              {`${t('pro.network.managenetwork')}`}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Button>
  )
}
