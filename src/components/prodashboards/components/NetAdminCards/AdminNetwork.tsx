import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'

import { grey } from '@mui/material/colors'
import { useSelector } from 'react-redux'
import { networkSelectors } from '~store/selectors'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Wifi } from '@mui/icons-material'
import { Button, Grid, useTheme } from '@mui/material'

export default function AdminNetworkCard() {
  const { t } = useTranslation()
  const networks = useSelector(networkSelectors.getNetworks)
  const networkCount = !!networks ? networks.length : 0
  const theme = useTheme()
  const { netid } = useParams<{ netid: string }>()

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    height: '100%',
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
      to={`/networks/${netid}/edit`}
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
        <CardActions>
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={10.5}></Grid>
            <Grid item xs={1}>
              <Avatar
                sx={{ bgcolor: grey[900] }}
                aria-label={String(t('common.count'))}
              >
                <Typography variant="body1" color="white">
                  {networkCount}
                </Typography>
              </Avatar>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Button>
  )
}
