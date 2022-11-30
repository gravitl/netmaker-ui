import { useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
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
import { Grid, useTheme } from '@mui/material'
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
        <Link to="/nodes">
          <PreviewIcon color="primary" />
        </Link>
      ),
      name: t('common.view'),
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
      onClick={() => goToRoute('/nodes')}
      className="clickable"
    >
      <CardContent>
        <Avatar
          sx={{ bgcolor: grey[900] }}
          aria-label={String(t('node.nodes'))}
        >
          <DeviceHub sx={{ color: theme.palette.common.white }} />
        </Avatar>
        <div style={cardContentStyle}>
          <Typography variant="h5" component="div" color="black">
            {t('node.nodes')}
          </Typography>
          <Typography variant="body2" color="primary">
            {`${t('common.manage')} ${t('node.nodes')}`}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-around" alignItems="center">
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
              aria-label={String(t('common.count'))}
            >
              <Typography variant="body1" color="white">
                {nodeCount}
              </Typography>
            </Avatar>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}
