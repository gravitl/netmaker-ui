import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'

export const HostsDetailPage: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.hosts'),
  })

  const titleStyle = {
    textAlign: 'center',
  } as any

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <div style={titleStyle}>
            <Typography variant="h5">{t('hosts.hosts')}</Typography>
          </div>
        </Grid>
      </Grid>
      
      Host details page
    </Container>
  )
}
