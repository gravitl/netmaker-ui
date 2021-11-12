import React from 'react'
import { Grid, List, ListItem, ListSubheader } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FormRef, NmForm, NmFormInputCheckbox, NmFormInputText, NmFormList, validate } from '~components/form'
import { updateUserNetworks } from '~modules/auth/actions'
import { useParams } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { correctUserNameRegex } from '~util/regex'
import { useDialog } from '~components/ConfirmDialog'
import { authSelectors, networkSelectors } from '~store/selectors'

export const UserEdit: React.FC = () => {
  const { t } = useTranslation()
  const { username } = useParams<{ username: string }>()
  const { Component: Dialog, setProps: setDialog } = useDialog()

  useLinkBreadcrumb({
    title: username,
  })
  
  const dispatch = useDispatch()

  const user = useSelector(authSelectors.getUsers).find(u => u.name === username)
  const networks = useSelector(networkSelectors.getNetworks)

  const initialState = {
    username: user?.name || '',
    isadmin: !!user?.isAdmin,

    networks: networks.map(network => ({
      checked: !!user?.networks?.includes(network.netid),
      netid: network.netid
    })),
  }


  const formRef = React.createRef<FormRef<typeof initialState>>()

  const onSubmit = useCallback(
    (data: typeof initialState) => {
      const create = () => dispatch(
        updateUserNetworks.request({
          username: data.username,
          isadmin: data.isadmin,
          networks: data.networks
            .filter((network) => network.checked)
            .map((network) => network.netid),
        })
      )

      if(data.isadmin) {
        setDialog({
          message: t('users.update.createAdmin'),
          onSubmit: create,
          title: t('users.update.isAdminTitle')
        })
      } 
      else {
        create()
      }
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
      }),
    [t]
  )

  if (!username) {
    return <div>Not Found</div>
  }

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <h3>{t('users.update')}</h3>
      </Grid>
      <Grid item xs={12}>
        <NmForm
          ref={formRef}
          initialState={initialState}
          resolver={validation}
          onSubmit={onSubmit}
          submitText={t(user?.isAdmin ? 'users.updateAdminSubmit' : 'users.updateSubmit')}
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
                label={t('users.label.username')}
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
                label={t('users.update.isAdmin')}
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
                    }}
                  >
                    <ListSubheader>{t('users.update.networks')}</ListSubheader>
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
