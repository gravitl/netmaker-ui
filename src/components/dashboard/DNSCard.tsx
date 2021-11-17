import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PreviewIcon from '@mui/icons-material/Preview'
import { grey } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar'
import { useSelector } from 'react-redux'
import { networkSelectors } from '~store/types'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { KeyboardArrowRight, Language } from '@mui/icons-material'
import { Button } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function NodeCard() {
  const { t } = useTranslation()
  const dnsEntries = useSelector(networkSelectors.getDnsEntries)
  const dnsCount = !!dnsEntries ? dnsEntries.length : 0

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

  const actions = [
    {
      icon: (
        <Link to="/dns">
          <PreviewIcon />
        </Link>
      ),
      name: t('common.view'),
    },
  ]

  return (
    <Button component={Link} to={'/dns'} color={'inherit'} fullWidth style={{textTransform: 'none'}}>
      <Card
        sx={{ minWidth: 275, backgroundColor: grey[200] }}
        variant="outlined"
        style={cardStyle}
      >
        <CardContent>
          <Avatar sx={{ bgcolor: grey[900] }} aria-label={t('breadcrumbs.dns')}>
            <Language />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div">
              {t('breadcrumbs.dns')}
            </Typography>
            <Typography variant="body2">
              {`${t('common.manage')} ${t('breadcrumbs.dns')}`}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Grid container justifyContent='space-around' alignItems='center'>
              <Grid item xs={10}>
              <StyledSpeedDial
                ariaLabel={`${t('common.manage')} ${t('breadcrumbds.dns')}`}
                icon={<KeyboardArrowRight />}
                direction={'right'}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    color="primary"
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                  />
                ))}
              </StyledSpeedDial>
              </Grid>
              <Grid item xs={1}>
                <Avatar
                  sx={{ bgcolor: grey[900] }}
                  aria-label={t('common.count')}
                >
                    {dnsCount}
                </Avatar>
              </Grid>
            </Grid>
        </CardActions>
      </Card>
    </Button>
  )
}
