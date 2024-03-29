import { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import LogsIcon from '@mui/icons-material/Terminal'
import MetricsIcon from '@mui/icons-material/Insights'
import { grey } from '@mui/material/colors'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { KeyboardArrowRight } from '@mui/icons-material'
import { Grid, useTheme } from '@mui/material'
import BottomIcon from '@mui/icons-material/HomeRepairService'
import { useSelector } from 'react-redux'
import { serverSelectors } from '~store/selectors'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function AdminCard() {
  const { t } = useTranslation()
  const theme = useTheme()
  const serverConfig = useSelector(serverSelectors.getServerConfig)
  const history = useHistory()

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
        <Link color="primary" to="/logs">
          <LogsIcon color="primary" />
        </Link>
      ),
      name: t('pro.logs'),
    },
  ]

  if (serverConfig.IsEE) {
    actions.push({
      icon: (
        <Link color="primary" to="/metrics/MetricsTable">
          <MetricsIcon color="primary" />
        </Link>
      ),
      name: t('pro.metrics'),
    })
  }

  const goToRoute = useCallback(
    (route: string) => {
      history.push(route)
    },
    [history]
  )

  return (
    <Card
      sx={{ minWidth: 275, backgroundColor: grey[200] }}
      variant="outlined"
      style={cardStyle}
      onClick={() => goToRoute('/users/admin')}
      className="clickable"
    >
      <CardContent>
        <Avatar
          sx={{ bgcolor: grey[900] }}
          aria-label={String(t('users.header'))}
        >
          <AdminPanelSettingsIcon sx={{ color: theme.palette.common.white }} />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div" color="black">
            {t('pro.admin')}
          </Typography>
          <Typography variant="body2" color="primary">
            {`${t('pro.admintools')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('pro.admintools')}`}
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
              aria-label={String(t('common.count'))}
            >
              <Typography variant="body1" color="white">
                <BottomIcon />
              </Typography>
            </Avatar>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}
