import { Box, Grid, Button, Card, CardContent } from '@mui/material'
import React from 'react'
import { makeStyles } from '@mui/styles'
import { Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  useRouteMatch,
  //  useHistory,
  useParams,
  Route,
  Switch,
} from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNetwork } from '~util/network'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: '60%',
    backgroundColor: '#f5f5f5',
    outline: 0, // Disable browser on-focus borders
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  center: {
    textAlign: 'center',
  },
  cardMain: {
    width: '100%',
    marginTop: '1em',
  },
  container: {
    maxHeight: '38em',
    overflowY: 'scroll',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  button: {
    marginLeft: '0.25em',
    marginRight: '0.25em',
    '&:hover': {
      backgroundColor: '#0000e4',
    },
  },
  button2: {
    marginLeft: '0.25em',
    marginRight: '0.25em',
    '&:hover': {
      backgroundColor: '#e40000',
    },
  },
  main: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backDrop: {
    background: 'rgba(255,0,0,1.0)',
  },
}))

export const ProAccessKeys: React.FC = () => {
  const { path, url } = useRouteMatch()
  // const history = useHistory()
  const { t } = useTranslation()

  const classes = useStyles()

  const { netid } = useParams<{ netid: string }>()
  const network = useNetwork(netid)

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.accessKeys'),
  })

  if (!network) {
    return <div>{t('Not found!')}</div>
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Box
          justifyContent="center"
          alignItems="center"
          className={classes.container}
        >
          <Grid className={classes.main} container>
            <Grid item xs={12}>
              <div className={classes.center}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={() => console.log('setIsCreating(true)')}
                >
                  Add New Access Key
                </Button>
              </div>
            </Grid>
            <Grid item xs={12}>
              {network.accesskeys.map((accessKey) => (
                <Card key={accessKey.name} className={classes.cardMain}>
                  <CardContent>
                    <Grid
                      container
                      sx={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Grid item xs={4} className={classes.center}>
                        <h3>Name: {accessKey.name}</h3>
                      </Grid>
                      <Grid item xs={4} className={classes.center}>
                        <h3>Uses: {accessKey.uses}</h3>
                      </Grid>
                      <Grid item xs={4} className={classes.center}>
                        <Button
                          className={classes.button2}
                          onClick={() =>
                            console.log('deleteKey(accessKey.name)')
                          }
                          variant="outlined"
                        >
                          Delete Key <Delete />
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Route>
    </Switch>
  )
}
