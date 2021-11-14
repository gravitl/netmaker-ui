import React from 'react'
import { Grid } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FormRef, NmForm, NmFormInputText, validate } from '~components/form'
import { updateUser } from '~modules/auth/actions'
import { useParams } from 'react-router-dom'
import { correctPasswordRegex, correctUserNameRegex } from '~util/regex'
import { useDialog } from '~components/ConfirmDialog'
import { authSelectors } from '~store/selectors'

export const UserChangePassword: React.FC = () => {
  const { t } = useTranslation()
  const { username } = useParams<{ username: string }>()
  const { Component: Dialog, setProps: setDialog } = useDialog()

  const dispatch = useDispatch()

  const user = useSelector(authSelectors.getUser)

  const initialState = {
    username: user?.name || '',
    password: '',
    confirmation: '',
  }

  const formRef = React.createRef<FormRef<typeof initialState>>()

  const onSubmit = useCallback(
    (data: typeof initialState) => {
      setDialog({
        message: t('users.update.password'),
        onSubmit: () => dispatch(
          updateUser.request({
            username: data.username,
            password: data.password,
          })
        ),
        title: t('users.update.passwordTitle')
      })
    },
    [dispatch, t, setDialog]
  )
  const validation = useMemo(
    () =>
      validate<typeof initialState>({
        username: (username) =>
          !correctUserNameRegex.test(username)
            ? {
                message: t('users.validation.username'),
                type: 'value',
              }
            : undefined,
        password: (password) =>
          !correctPasswordRegex.test(password)
            ? {
                message: t('users.validation.password'),
                type: 'value',
              }
            : undefined,
        confirmation: (confirmation, formData) =>
          confirmation !== formData.password
            ? {
                message: t('users.validation.confirmation'),
                type: 'value',
              }
            : undefined,
      }),
    [t]
  )

  if (username !== user?.name) 
      return null

  if (!username) {
    return <div>Not Found</div>
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <h3>{t('users.update.password')}</h3>
      </Grid>
      <Grid item xs={12}>
        <NmForm
          ref={formRef}
          initialState={initialState}
          resolver={validation}
          onSubmit={onSubmit}
          submitText={t('users.update.passwordSubmit')}
          submitProps={{
            type: 'submit',
            fullWidth: true,
            variant: 'contained',
            color: 'primary',
          }}
        >
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item sm={12} md={5}>
              <NmFormInputText
                name={'password'}
                label={t('users.label.password')}
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
            <Grid item sm={12} md={5}>
              <NmFormInputText
                name={'confirmation'}
                label={t('users.label.confirmation')}
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
      <Dialog />
    </Grid>
  )
}
