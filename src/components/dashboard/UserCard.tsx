import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PreviewIcon from '@mui/icons-material/Preview'
// import CreateIcon from '@mui/icons-material/AddBox'
import GroupsIcon from '@mui/icons-material/Groups'
import NetworkUsersIcon from '@mui/icons-material/Engineering'

import { grey } from '@mui/material/colors'
import { useSelector } from 'react-redux'
import { authSelectors } from '~store/types'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { KeyboardArrowRight, People as UsersIcon } from '@mui/icons-material'
import { Button, Grid, useTheme } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function UserCard() {
  const { t } = useTranslation()
  const users = useSelector(authSelectors.getUsers)
  const userCount = users.length
  const theme = useTheme()

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
        <Link color="primary" to="/users">
          <PreviewIcon />
        </Link>
      ),
      name: `${t('common.view')} ${t('header.users')}`,
    },
    {
      icon: (
        <Link color="primary" to="/user-permissions">
          <NetworkUsersIcon />
        </Link>
      ),
      name: `${t('common.manage')} ${t('pro.label.userpermissions')}`,
    },
    {
      icon: (
        <Link color="primary" to="/usergroups">
          <GroupsIcon />
        </Link>
      ),
      name: `${t('common.manage')} ${t('pro.label.usergroups')}`,
    },
  ]

  return (
    <Button component={Link} to={'/users'} color={'inherit'} fullWidth style={{textTransform: 'none'}}>
    <Card
      sx={{ minWidth: 275, backgroundColor: grey[200] }}
      variant="outlined"
      style={cardStyle}
    >
      <CardContent>
        <Avatar sx={{ bgcolor: grey[900] }} aria-label={String(t('users.header'))}>
          <UsersIcon sx={{color: theme.palette.common.white}} />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div" color='black'>
            {t('users.header')}
          </Typography>
          <Typography variant="body2" color='primary'>
            {`${t('common.manage')} ${t('users.header')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='space-around' alignItems='center'>
          <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('common.manage')} ${t('user.header')}`}
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
                <Typography variant="body1" color='white'>
                  {userCount}
                </Typography>
            </Avatar>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
    </Button>
  )
}
