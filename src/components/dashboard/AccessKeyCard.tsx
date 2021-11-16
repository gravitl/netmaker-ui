import * as React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PreviewIcon from '@mui/icons-material/Preview'
// import CreateIcon from '@mui/icons-material/AddBox';
import { grey } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar'
import { networkSelectors } from '~store/selectors'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { KeyboardArrowRight, VpnKey } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function AccessKeyCard() {
  const { t } = useTranslation()

  const networks = useSelector(networkSelectors.getNetworks)
  let accessKeyCount = 0
  for (let i = 0; i < networks.length; i++) {
    accessKeyCount += networks[i].accesskeys.length
  }

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    width: '100%',
    height: '100%',
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
        <Link to="/access-keys">
          <PreviewIcon />
        </Link>
      ),
      name: t('common.view'),
    },
    // { icon: <Link to='/access-keys/create' ><CreateIcon /></Link>, name: t('common.create')},
  ]

  return (
    <Button component={Link} to={'/access-keys'} color={'inherit'} fullWidth style={{textTransform: 'none'}}>
      <Card
        sx={{ minWidth: 275, backgroundColor: grey[200] }}
        variant="outlined"
        style={cardStyle}
      >
        <CardContent>
          <Avatar
            sx={{ bgcolor: grey[900] }}
            aria-label={t('breadcrumbs.accessKeys')}
          >
            <VpnKey />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div">
              {t('breadcrumbs.accessKeys')}
            </Typography>
            <Typography variant="body2">
              {`${t('common.manage')} ${t('breadcrumbs.accessKeys')}`}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Grid container justifyContent='space-around' alignItems='center'>
            <Grid item xs={10}>
                <StyledSpeedDial
                  ariaLabel={`${t('common.manage')} ${t('breadcrumbs.accessKeys')}`}
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
                  {accessKeyCount}
              </Avatar>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Button>
  )
}
