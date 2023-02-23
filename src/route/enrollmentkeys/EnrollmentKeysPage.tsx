import { Grid, Typography, Container } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { EnrollmentKey } from '~store/modules/enrollmentkeys'
import { EnrollmentKeysTable } from './components/EnrollmentKeysTable'

const titleStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
} as any

export const EnrollmentKeysPage: FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const keys: EnrollmentKey[] = [
    {
      value: '1',
      expiration: 0,
      unlimited: true,
      networks: [],
      tags: ['test-key'],
      token: 'abc',
      uses_remaining: 0,
    },
  ]

  useLinkBreadcrumb({
    title: t('common.enrollmentkeys'),
  })

  return (
    <Container>
      <Switch>
        {/* all keys page */}
        <Route exact path={path}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <div style={titleStyle}>
                <Typography variant="h5">
                  {t('common.enrollmentkeys')}
                </Typography>
              </div>
            </Grid>
            <EnrollmentKeysTable keys={keys} />
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
