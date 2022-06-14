import { Container, Grid, InputAdornment, TextField } from '@mui/material'
import React from 'react'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import { NetworkCreate } from './create/NetworkCreate'
import { NetworkId } from './networkId/NetworkId'
import { useTranslation } from 'react-i18next'
import { NetworkTable } from './components/NetworkTable'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { NmLink } from '~components/index'
import { useSelector } from 'react-redux'
import { networkSelectors } from '~store/types'
import { Search } from '@mui/icons-material'

export const Networks: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const [filterNetworks, setFilterNetworks] = React.useState(listOfNetworks)

  useLinkBreadcrumb({
    title: t('breadcrumbs.networks'),
  })

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterNetworks(listOfNetworks)
    } else {
      setFilterNetworks(
        listOfNetworks.filter((network) =>
          `${network.netid}${network.addressrange}`.includes(searchTerm)
        )
      )
    }
  }

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="right"
            alignItems="center"
          >
            <Grid item xs={8} md={5}>
              <div style={{textAlign: "center"}}>
              <h2>{t('network.networks')}</h2>
              </div>
            </Grid>
            <Grid item xs={10} md={5} style={{textAlign: "center"}}>
              <Grid container justifyContent="space-around" alignItems="center">
                <Grid item xs={6} md={5}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    label={`${t('common.search')} ${t('network.networks')}`}
                    onChange={handleFilter}
                  />
                </Grid>
                <Grid item xs={5.5} md={5}>
                  <NmLink
                    variant="contained"
                    to={{ pathname: '/networks/create' }}
                  >
                    {t('network.create')}
                  </NmLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <NetworkTable
            networks={
              filterNetworks.length &&
              filterNetworks.length < listOfNetworks.length
                ? filterNetworks
                : listOfNetworks
            }
          />
        </Route>
        <Route path={`${path}/create`}>
          <NetworkCreate />
        </Route>
        <Route path={`${path}/:netid`}>
          <NetworkId />
        </Route>
      </Switch>
    </Container>
  )
}
