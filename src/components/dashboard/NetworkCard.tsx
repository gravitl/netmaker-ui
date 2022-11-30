import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PreviewIcon from '@mui/icons-material/Preview'
import CreateIcon from '@mui/icons-material/AddBox'
import { grey } from '@mui/material/colors'
import { useSelector } from 'react-redux'
import { networkSelectors } from '~store/selectors'
import { useHistory } from 'react-router-dom'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { AccountTree, KeyboardArrowRight, Wifi } from '@mui/icons-material'
import { Grid, useTheme } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function NetworkCard() {
  const { t } = useTranslation()
  const networks = useSelector(networkSelectors.getNetworks)
  const networkCount = !!networks ? networks.length : 0
  const theme = useTheme()
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
        <Link color="primary" to="/networks" onClick={ev => ev.stopPropagation()}>
          <PreviewIcon color="primary" />
        </Link>
      ),
      name: t('common.view'),
    },
    {
      icon: (
        <Link color="primary" to="/networks/create" onClick={ev => ev.stopPropagation()}>
          <CreateIcon color="primary" />
        </Link>
      ),
      name: t('common.create'),
    },
    {
      icon: (
        <Link color="primary" to="/graphs" onClick={ev => ev.stopPropagation()}>
          <AccountTree color="primary" />
        </Link>
      ),
      name: t('breadcrumbs.graphs'),
    },
  ]

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
      onClick={() => goToRoute('/networks')}
      className="clickable"
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
            {t('network.networks')}
          </Typography>
          <Typography variant="body2" color="primary">
            {`${t('common.manage')} ${t('network.networks')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('common.manage')} ${t('network.networks')}`}
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
                {networkCount}
              </Typography>
            </Avatar>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}
