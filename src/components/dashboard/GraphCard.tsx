import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import Avatar from '@mui/material/Avatar'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import { grey } from '@mui/material/colors'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { AccountTree, EditLocationAlt, KeyboardArrowRight, PreviewOutlined } from '@mui/icons-material'
import { Button, Grid, useTheme } from '@mui/material'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function GraphCard() {
  const { t } = useTranslation()
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
        <Link to="/graphs">
          <PreviewOutlined />
        </Link>
      ),
      name: t('common.view'),
    },
  ]

  return (
    <Button component={Link} to={'/graphs'} color={'inherit'} fullWidth style={{textTransform: 'none'}}>
    <Card
      sx={{ minWidth: 275, backgroundColor: grey[200] }}
      variant="outlined"
      style={cardStyle}
    >
      <CardContent>
        <Avatar sx={{ bgcolor: grey[900] }} aria-label={String(t('network.graphs'))}>
          <AccountTree sx={{color: theme.palette.common.white}} />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div" color='black'>
            {t('network.graphs')}
          </Typography>
          <Typography variant="body2" color='primary'>
            {`${t('common.manage')} ${t('node.nodevisual')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='space-around' alignItems='center'>
            <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('common.manage')} ${t('node.nodevisual')}`}
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
                aria-label={`${t('network.graphs')}-icon`}
              >
                  <EditLocationAlt sx={{color: theme.palette.common.white}} />
              </Avatar>
            </Grid>
          </Grid>
      </CardActions>
    </Card>
    </Button>
  )
}
