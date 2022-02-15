import React, { useCallback, useEffect, useMemo } from 'react'
import { CircularProgress, Grid, Typography } from '@mui/material'
import { NmForm, NmFormInputText, validate } from '../form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { correctUserNameRegex, correctPasswordRegex } from '../../util/regex'
import { authSelectors, nodeSelectors } from '../../store/selectors'
import { createAdmin } from '../../store/modules/auth/actions'
import { Redirect } from 'react-router'
import { setShouldLogout } from '~store/modules/node/actions'

const styles = {
  centerText: {
    textAlign: 'center',
  },
  vertTabs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  center: {
    flex: 1,
    display: 'flex',
    textAlign: 'center',
  },
  margin: {
    marginBottom: '1em',
  },
} as any

export default function CreateAdmin() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [error, setError] = React.useState('')
  const [triedToCreate, setTriedToCreate] = React.useState(false)
  const isCreating = useSelector(authSelectors.isCreating)
  const hasAdmin = useSelector(authSelectors.hasAdmin)
  const hasNetworkError = useSelector(authSelectors.hasNetworkError)
  const shouldSignOut = useSelector(nodeSelectors.getShouldSignOut)

  const initialAdminForm = { username: '', password: '', confirmation: '' }

  useEffect(() => {
    if (hasNetworkError || shouldSignOut === 'network') {
      setError(t('error.network'))
      dispatch(setShouldLogout(''))
    }

    if (shouldSignOut === 'auth') {
      setError(t('error.unauthorized'))
      dispatch(setShouldLogout(''))
    }

    if (!triedToCreate) {
      return
    }

    if (isCreating) {
      setError('')
    }
  }, [isCreating, triedToCreate, setError, t, hasNetworkError, shouldSignOut, dispatch])

  const createAdminValidation = useMemo(
    () =>
      validate<typeof initialAdminForm>({
        username: (username) =>
          !correctUserNameRegex.test(username)
            ? {
                message: t('login.validation.username'),
                type: 'value',
              }
            : undefined,
        password: (password) =>
          !correctPasswordRegex.test(password)
            ? {
                message: t('login.validation.password'),
                type: 'value',
              }
            : undefined,
        confirmation: (confirmation, formData) =>
          confirmation !== formData.password
            ? {
                message: t('login.validation.confirmation'),
                type: 'value',
              }
            : undefined,
      }),
    [t]
  )

  const createSubmit = useCallback(
    (data: typeof initialAdminForm) => {
      dispatch(createAdmin.request(data))
      setTriedToCreate(true)
    },
    [dispatch, setTriedToCreate]
  )

  if (hasAdmin) return <Redirect to={'/'} />

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={styles.margin}
    >
      <Grid item xs={12}>
        <div style={styles.centerText}>
          {error && (
            <Typography variant="h5" color="error">
              {error}
            </Typography>
          )}
          {isCreating && <CircularProgress />}
        </div>
      </Grid>
      <Grid item xs={12} style={styles.centerText}>
        <h3>{t('login.admin.create')}</h3>
      </Grid>
      <Grid item xs={12}>
        <NmForm
          initialState={initialAdminForm}
          resolver={createAdminValidation}
          onSubmit={createSubmit}
          submitText={t('login.admin.creating')}
          showOauth
          submitProps={{
            type: 'submit',
            fullWidth: true,
            variant: 'contained',
            color: 'primary',
            style: styles.vertTabs,
          }}
          disabled={isCreating}
        >
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item sm={12} md={10}>
              <NmFormInputText
                name={'username'}
                label={t('login.label.username')}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                autoComplete="false"
                autoFocus
              />
            </Grid>
            <Grid item sm={12} md={10}>
              <NmFormInputText
                name={'password'}
                label={t('login.label.password')}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                placeholder=""
                type="password"
                id="password"
                autoComplete="false"
              />
            </Grid>
            <Grid item sm={12} md={10}>
              <NmFormInputText
                name={'confirmation'}
                label={t('login.label.confirmation')}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                placeholder=""
                type="password"
                id="confirmation"
                autoComplete="false"
              />
            </Grid>
          </Grid>
        </NmForm>
      </Grid>
    </Grid>
  )
}
