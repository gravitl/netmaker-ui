import { Grid, Typography, Container, Button } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { EnrollmentKey } from '~store/modules/enrollmentkeys'
import { getEnrollmentKeys } from '~store/modules/enrollmentkeys/actions'
import { enrollmentKeysSelectors } from '~store/selectors'
import { CreateEnrollmentKeyModal } from './components/CreateEnrollmentKeyModal'
import { EnrollmentKeysTable } from './components/EnrollmentKeysTable'

const titleStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
} as any

export const EnrollmentKeysPage: FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [shouldShowCreateModal, setShouldShowCreateModal] = useState(false)

  const hideCreateModal = useCallback(() => {
    setShouldShowCreateModal(false)
  }, [])

  const loadKeys = useCallback(() => {
    dispatch(getEnrollmentKeys.request())
  }, [dispatch])

  const keys: EnrollmentKey[] = useSelector(enrollmentKeysSelectors.getEnrollmentKeys)

  useLinkBreadcrumb({
    title: t('common.enrollmentkeys'),
  })

  useEffect(() => {
    loadKeys()
  }, [loadKeys])

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
            <Grid item xs={12} justifyContent="end" textAlign="right" style={{ marginBottom: '2rem' }}>
              <Button
                onClick={() => setShouldShowCreateModal(true)}
                variant="contained"
              >
                {t('common.create')}
              </Button>
            </Grid>
            <EnrollmentKeysTable keys={keys} />
          </Grid>
        </Route>
      </Switch>

      {/* modal */}
      <CreateEnrollmentKeyModal
        open={shouldShowCreateModal}
        onClose={hideCreateModal}
      />
    </Container>
  )
}
