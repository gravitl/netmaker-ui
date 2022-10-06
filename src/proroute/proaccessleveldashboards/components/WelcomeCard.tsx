import * as React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import { grey } from '@mui/material/colors'
import { useSelector } from 'react-redux'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import ThreePIcon from '@mui/icons-material/ThreeP'
import { Button, useTheme } from '@mui/material'
import { authSelectors } from '~store/selectors'

export default function WelcomeCard() {
  const { t } = useTranslation()
  const theme = useTheme()
  const user = useSelector(authSelectors.getUser)

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    height: '100%',
    width: '50%',
    MaxWidth: '50%',
    minHeight: '15em',
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
      to={'/prouser'}
      color={'inherit'}
      fullWidth
      style={{
        textTransform: 'none',
        maxWidth: '100%',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{ minWidth: 275, backgroundColor: grey[200] }}
        variant="outlined"
        style={cardStyle}
      >
        <CardContent>
          <Avatar
            sx={{ bgcolor: grey[900] }}
            aria-label={String(t('pro.label.welcomcard'))}
          >
            <ThreePIcon sx={{ color: theme.palette.common.white }} />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div" color="black">
              {`${t('pro.label.welcome')} ${user?.name}`}
            </Typography>
            <Typography variant="body2" color="primary">
              {`${t('pro.label.welcomecard')}`}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Button>
  )
}
