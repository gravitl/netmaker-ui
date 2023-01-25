import { useCallback, useMemo, useEffect, FC, createRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid, List, ListSubheader } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  NmForm,
  NmFormInputCheckbox,
  NmFormInputText,
  validate,
  FormRef,
  NmFormList,
} from '~components/form'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { createUser } from '~modules/auth/actions'
import { Redirect, useLocation, useHistory } from 'react-router-dom'
import { authSelectors, networkSelectors } from '~store/selectors'
import { correctUserNameRegex, correctPasswordRegex } from '~util/regex'
import ListItem from '@mui/material/ListItem'
import { useDialog } from '~components/ConfirmDialog'

interface CreateUser {
  username: string
  password: string
  confirmation: string
  isadmin: boolean
  networks: { netid: string; checked: boolean }[]
}

const useStyles = makeStyles(() =>
  createStyles({
    center: {
      textAlign: 'center',
    },
    rowMargin: {
      marginTop: '1em',
      marginBottom: '1em',
    },
  })
)

export const UserCreate: FC = () => {
  const dispatch = useDispatch()
  const styles = useStyles()
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  const { t } = useTranslation()
  const location = useLocation<{ from?: Location }>()
  const history = useHistory()
  const isCreating = useSelector(authSelectors.isCreating)
  const formRef = createRef<FormRef<CreateUser>>()
  const { Component: Dialog, setProps: setDialog } = useDialog()
  const initialState: CreateUser = {
    username: '',
    password: '',
    confirmation: '',
    isadmin: false,
    networks: listOfNetworks.map((network) => ({
      netid: network.netid,
      checked: false,
    })),
  }

  useEffect(() => {
    formRef.current?.reset({
      username: '',
      password: '',
      confirmation: '',
      isadmin: false,
      networks: listOfNetworks.map((network) => ({
        netid: network.netid,
        checked: false,
      })),
    })
  }, [listOfNetworks, formRef])

  const onSubmit = useCallback(
    (data: CreateUser) => {
      // clear selection if admin. admins have access to all nets
      if (data.isadmin) {
        data.networks = []
      }

      const create = () =>
        dispatch(
          createUser.request({
            username: data.username,
            password: data.password,
            isadmin: data.isadmin,
            networks: data.networks
              .filter((network) => network.checked)
              .map((network) => network.netid),
          })
        )

      if (data.isadmin) {
        setDialog({
          message: t('users.create.createAdmin'),
          onSubmit: create,
          title: t('users.create.isAdminTitle'),
        })
      } else {
        create()
      }
    },
    [dispatch, setDialog, t]
  )

  useLinkBreadcrumb({
    title: t('common.create'),
  })

  const createAdminValidation = useMemo(
    () =>
      validate<CreateUser>({
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

  if (isCreating) return <Redirect to={location.state?.from || '/'} />

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <div className={styles.center}>
          {isCreating && <CircularProgress />}
        </div>
      </Grid>
      <Grid item xs={12}>
        <h3>{t('users.create.button')}</h3>
      </Grid>
      <Grid item xs={12}>
        <NmForm
          ref={formRef}
          initialState={initialState}
          resolver={createAdminValidation}
          onSubmit={onSubmit}
          onCancel={() => history.goBack()}
          submitText={t('users.create.button')}
          submitProps={{
            type: 'submit',
            fullWidth: true,
            variant: 'contained',
            color: 'primary',
          }}
          disabled={isCreating}
        >
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item sm={12} md={5}>
              <NmFormInputText
                name={'username'}
                label={String(t('users.label.username'))}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                autoComplete="false"
                autoFocus
              />
            </Grid>
            <Grid item sm={12} md={5}>
              <NmFormInputText
                name={'password'}
                label={String(t('users.label.password'))}
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
                label={String(t('users.label.confirmation'))}
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
            <Grid item sm={12} md={5}>
              <NmFormInputCheckbox
                name="isadmin"
                label={String(t('users.create.isAdmin'))}
              />
            </Grid>
            <Grid item sm={12} md={5}>
              <NmFormList<CreateUser['networks'][0]> name="networks">
                {(fields, disabled) => (
                  <List
                    dense
                    sx={{
                      width: '100%',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <ListSubheader>{t('users.create.networks')}</ListSubheader>
                    {fields.map((field) => (
                      <ListItem key={field.id}>
                        <NmFormInputCheckbox
                          name={field.getFieldName('checked')}
                          label={field.netid}
                          disabled={disabled}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </NmFormList>
            </Grid>
          </Grid>
        </NmForm>
      </Grid>
      <Dialog />
    </Grid>
  )
}
