import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '@mui/material/Card'

// import CreateIcon from '@mui/icons-material/AddBox';
import { grey } from '@mui/material/colors'
import Avatar from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { VpnKey } from '@mui/icons-material'
import { Button, useTheme } from '@mui/material'

export default function ProAccessKeyCard() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { netid } = useParams<{ netid: string }>()

  const cardStyle = {
    marginBottom: '1em',
    marginTop: '1em',
    width: '100%',
    height: '100%',
    minHeight: '14em',
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
      to={`${netid}/accesskeys`}
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
            aria-label={String(t('breadcrumbs.accessKeys'))}
          >
            <VpnKey sx={{ color: theme.palette.common.white }} />
          </Avatar>
          <div style={cardContentStyle}>
            <Typography variant="h5" component="div" color="black">
              {t('breadcrumbs.accessKeys')}
            </Typography>
            <Typography variant="body2" color="primary">
              {`${t('common.manage')} ${t('breadcrumbs.accessKeys')}`}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Button>
  )
}
