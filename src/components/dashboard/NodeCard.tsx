import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import SpeedDial from '@mui/material/SpeedDial'
import Avatar from '@mui/material/Avatar'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import PreviewIcon from '@mui/icons-material/Preview'
import { grey } from '@mui/material/colors'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { DeviceHub, KeyboardArrowRight } from '@mui/icons-material'
import { Button, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { nodeSelectors } from '~store/types'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  '&.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}))

export default function NodeCard() {
  const { t } = useTranslation()
  const nodes = useSelector(nodeSelectors.getNodes)
  const nodeCount = nodes.length

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
        <Link to="/nodes">
          <PreviewIcon />
        </Link>
      ),
      name: t('common.view'),
    },
  ]

  return (
    <Button component={Link} to={'/nodes'} color={'inherit'} fullWidth style={{textTransform: 'none'}}>
    <Card
      sx={{ minWidth: 275, backgroundColor: grey[200] }}
      variant="outlined"
      style={cardStyle}
    >
      <CardContent>
        <Avatar sx={{ bgcolor: grey[900] }} aria-label={t('node.nodes')}>
          <DeviceHub />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div">
            {t('node.nodes')}
          </Typography>
          <Typography variant="body2">
            {`${t('common.manage')} ${t('node.nodes')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='space-around' alignItems='center'>
            <Grid item xs={10}>
            <StyledSpeedDial
              ariaLabel={`${t('common.manage')} ${t('node.nodes')}`}
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
                  {nodeCount}
              </Avatar>
            </Grid>
          </Grid>
      </CardActions>
    </Card>
    </Button>
  )
}
