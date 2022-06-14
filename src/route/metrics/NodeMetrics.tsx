import {
    Container,
    Grid,
  } from '@mui/material'
  import React from 'react'
  import { useRouteMatch, useParams, Switch, Route } from 'react-router-dom'
  import { useTranslation } from 'react-i18next'
  import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'

  
  export const NodeMetrics: React.FC = () => {
    const { path, url } = useRouteMatch()
    const { t } = useTranslation()
    const { netid, nodeId } = useParams<{ nodeId: string; netid: string }>()


    useLinkBreadcrumb({
        link: url,
        title: nodeId,
    })

    useLinkBreadcrumb({
        link: url,
        title: netid,
    })

    useLinkBreadcrumb({
      link: url,
      title: t('pro.metrics'),
    })
    console.log("PATH", path)
    console.log("URL", url)
  
    return (
      <Container>
        <Switch>
          <Route exact path={path}>
            <Grid container justifyContent="space-around" alignItems="center">
              <h1>Hello Metrics</h1>
            </Grid>
          </Route>
        </Switch>
      </Container>
    )
  }
  