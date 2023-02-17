import React from 'react'
import { Grid, List, ListItem, ListSubheader } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  FormRef,
  NmForm,
  NmFormInputCheckbox,
  NmFormInputText,
  NmFormList,
  validate,
} from '~components/form'
import { updateUserNetworks } from '~modules/auth/actions'
import { useParams } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { correctUserNameRegex } from '~util/regex'
import { useDialog } from '~components/ConfirmDialog'
import { authSelectors, networkSelectors } from '~store/selectors'
import { NmLink } from '~components/Link'
import { User } from '~store/types'
import { getNetworkUsers } from '~store/modules/pro/actions'

export const UserEditEE: React.FC = () => {
  const { t } = useTranslation()
  const { username } = useParams<{ username: string }>()
  const { Component: Dialog, setProps: setDialog } = useDialog()
  const currentUser = useSelector(authSelectors.getUser)
  const [stateUser, setStateUser] = React.useState({} as User)

  useLinkBreadcrumb({
    title: username,
  })

  const dispatch = useDispatch()

  const user = useSelector(authSelectors.getUsers).find(
    (u) => u.name === username
  )
  const networks = useSelector(networkSelectors.getNetworks)

  const initialState = useMemo(
    () => ({
      username: user?.name || '',
      isadmin: !!user?.isAdmin,

      networks: networks.map((network) => ({
        checked: !!user?.networks?.includes(network.netid),
        netid: network.netid,
      })),
      groups: user?.groups,
    }),
    [networks, user]
  )

  const formRef = React.createRef<FormRef<typeof initialState>>()

  const onSubmit = useCallback(
    (data: typeof initialState) => {
      const create = () => {
        dispatch(
          updateUserNetworks.request({
            username: data.username,
            isadmin: data.isadmin,
            networks: data.networks
              .filter((network) => network.checked)
              .map((network) => network.netid),
            groups: user?.groups || [],
          })
        )

        setTimeout(() => dispatch(getNetworkUsers.request()), 100)
      }

      if (data.isadmin) {
        setDialog({
          message: t('users.update.createAdmin'),
          onSubmit: create,
          title: t('users.update.isAdminTitle'),
        })
      } else {
        create()
      }
    },
    [dispatch, t, setDialog, user]
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
      }),
    [t]
  )

  React.useEffect(() => {
    if (stateUser !== currentUser && !!currentUser) {
      setStateUser(currentUser)
    }
  }, [currentUser, stateUser])

  if (!currentUser?.isAdmin) return null

  if (!username) {
    return <div>Not Found</div>
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <h3>{t('users.update.header')}</h3>
      </Grid>
      <Grid item xs={12}>
        {initialState?.username && (
          <NmForm
            ref={formRef}
            initialState={initialState}
            resolver={validation}
            onSubmit={onSubmit}
            submitText={t(
              user?.isAdmin ? 'users.update.adminSubmit' : 'users.update.submit'
            )}
            submitProps={{
              type: 'submit',
              fullWidth: true,
              variant: 'contained',
              color: 'primary',
            }}
            disabled={user?.isAdmin}
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
                  disabled
                />
              </Grid>
              <Grid item sm={12} md={5}>
                <NmFormInputCheckbox
                  name="isadmin"
                  label={String(t('users.update.isAdmin'))}
                />
              </Grid>
              <Grid item sm={12} md={5}>
                <NmFormList<typeof initialState['networks'][0]> name="networks">
                  {(fields, disabled) => (
                    <List
                      dense
                      sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        overflowY: 'scroll',
                        maxHeight: '22em',
                      }}
                    >
                      <ListSubheader>
                        {t('users.update.networks')}
                      </ListSubheader>
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
            <Grid
              container
              justifyContent={'space-evenly'}
              alignItems="center"
              sx={{ marginTop: '1rem' }}
            >
              <Grid item xs={12} md={8} style={{ textAlign: 'center' }}>
                <NmFormInputText
                  fullWidth
                  name="groups"
                  label={String(t('pro.networkusers.groups'))}
                  disabled
                />
              </Grid>
              <Grid item xs={8} md={3.75} style={{ textAlign: 'center' }}>
                <NmLink
                  variant="outlined"
                  fullWidth
                  sx={{ textTransform: 'none' }}
                  to={`/users/${username}/groups`}
                  disabled={user?.isAdmin}
                >
                  {`${t('common.edit')} ${t('pro.networkusers.groups')}`}
                </NmLink>
              </Grid>
            </Grid>
          </NmForm>
        )}
      </Grid>

      <Dialog />
    </Grid>
  )
}
