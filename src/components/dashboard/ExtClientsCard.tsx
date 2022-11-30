import { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PreviewIcon from '@mui/icons-material/Preview'
import { grey } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar'
import { useSelector } from 'react-redux'
import { nodeSelectors } from '~store/types'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Devices, KeyboardArrowRight } from '@mui/icons-material'
import { Grid, useTheme } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function ExtClientsCard() {
  const { t } = useTranslation()
  const clients = useSelector(nodeSelectors.getExtClients)
  const clientCount = clients.length
  const theme = useTheme()
  const history = useHistory()

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    height: '100%',
    width: '100%',
  }

  const actions = [
    {
      icon: (
        <Link to="/ext-clients">
          <PreviewIcon color="primary" />
        </Link>
      ),
      name: t('common.view'),
    },
    // { icon: <Link to='/ext-clients/create' ><CreateIcon /></Link>, name: t('common.create')},
  ]

  const cardContentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  } as any

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
      onClick={() => goToRoute('/ext-clients')}
      className="clickable"
    >
      <CardContent>
        <Avatar
          sx={{ bgcolor: grey[900] }}
          aria-label={String(t('breadcrumbs.extClients'))}
        >
          <Devices sx={{ color: theme.palette.common.white }} />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div" color="black">
            {t('breadcrumbs.extClients')}
          </Typography>
          <Typography variant="body2" color="primary">
            {`${t('common.manage')} ${t('breadcrumbs.extClients')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('common.manage')} ${t('breadcrumbs.extClients')}`}
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
                {clientCount}
              </Typography>
            </Avatar>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}
