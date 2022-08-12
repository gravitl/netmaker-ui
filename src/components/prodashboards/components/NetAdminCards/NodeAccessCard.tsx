import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'

import { grey } from '@mui/material/colors'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { DeviceHub } from '@mui/icons-material'
import { Button, Grid, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { nodeSelectors } from '~store/types'

export default function NodeAccessCard() {
  const { t } = useTranslation()
  const nodes = useSelector(nodeSelectors.getNodes)
  const nodeCount = nodes.length
  const theme = useTheme()
  const { netid } = useParams<{ netid: string }>()

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    height: '100%',
    width: '100%',
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
      to={`${netid}/nodeview`}
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
            aria-label={String(t('node.nodes'))}
          >
            <DeviceHub sx={{ color: theme.palette.common.white }} />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div" color="black">
              {t('node.nodes')}
            </Typography>
            <Typography variant="body2" color="primary">
              {`${t('common.manage')} ${t('node.nodes')}`}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={10}></Grid>
            <Grid item xs={1}>
              <Avatar
                sx={{ bgcolor: grey[900] }}
                aria-label={String(t('common.count'))}
              >
                <Typography variant="body1" color="white">
                  {nodeCount}
                </Typography>
              </Avatar>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Button>
  )
}
