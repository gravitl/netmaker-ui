import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
// import PreviewIcon from '@mui/icons-material/Preview'
import { grey } from '@mui/material/colors'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { DeviceHub, KeyboardArrowRight, ViewList as ACLIcon, VpnLockOutlined } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function ACLCard() {
  const { t } = useTranslation()

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
        <Link color="primary" to="/acls">
          <DeviceHub />
        </Link>
      ),
      name: `${t('common.view')} ${t('acls.nodes')}`,
    },
  ]

  return (
    <Button component={Link} to={'/acls'} color={'inherit'} fullWidth style={{textTransform: 'none'}}>
    <Card
      sx={{ minWidth: 275, backgroundColor: grey[200] }}
      variant="outlined"
      style={cardStyle}
    >
      <CardContent>
        <Avatar sx={{ bgcolor: grey[900] }} aria-label={String(t('users.header'))}>
          <ACLIcon />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div">
            {t('acls.fullname')}
          </Typography>
          <Typography variant="body2">
            {`${t('common.manage')} ${t('header.acls')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='space-around' alignItems='center'>
          <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('common.manage')} ${t('header.acls')}`}
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
              aria-label={String(t('acl.aclicon'))}
            >
                <VpnLockOutlined />
            </Avatar>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
    </Button>
  )
}
