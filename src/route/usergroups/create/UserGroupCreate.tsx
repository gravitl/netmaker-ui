import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress, Grid, Typography } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  NmForm,
  NmFormInputText,
  validate,
  FormRef,
} from '~components/form'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { createUserGroup } from '~modules/pro/actions'
import { Redirect, useLocation, useHistory } from 'react-router-dom'
import { proSelectors } from '~store/selectors'
import { useDialog } from '~components/ConfirmDialog'

interface CreateGroup {
  groupName: string
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

export const UserGroupCreate: React.FC = () => {
  const dispatch = useDispatch()
  const styles = useStyles()
  const { t } = useTranslation()
  const location = useLocation<{ from?: Location }>()
  const history = useHistory()
  const isCreating = useSelector(proSelectors.isProcessing)
  const formRef = React.createRef<FormRef<CreateGroup>>()
  const { Component: Dialog, setProps: setDialog } = useDialog()
  const initialState: CreateGroup = {
    groupName: '',
  }

  React.useEffect(() => {
    formRef.current?.reset({
      groupName: '',
    })
  }, [formRef])

  const onSubmit = useCallback(
    (data: CreateGroup) => {
      const create = () => {
        dispatch(
          createUserGroup.request({
            groupName: data.groupName
          })
        )
        history.push('/usergroups')
      }
        setDialog({
          message: `${t('common.create')} ${t('pro.label.usergroup')} ${data.groupName}`,
          onSubmit: create,
          title: t('common.submit'),
        })
    },
    [dispatch, setDialog, t, history]
  )

  useLinkBreadcrumb({
    title: t('common.create'),
  })

  const userGroupNameValidation = useMemo(
    () =>
      validate<CreateGroup>({
        groupName: (groupName) => !!!groupName ? {
          message: t('pro.validation.groupname'),
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
        <div className={styles.center}>
          <Typography variant='h4'>{`${t('common.create')} ${t('pro.label.usergroup')}`}</Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <NmForm
          ref={formRef}
          initialState={initialState}
          resolver={userGroupNameValidation}
          onSubmit={onSubmit}
          onCancel={() => history.goBack()}
          submitText={`${t('common.create')} ${t('pro.label.usergroup')}`}
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
                name={'groupName'}
                label={String(t('pro.label.usergroup'))}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                autoComplete="false"
                autoFocus
              />
            </Grid>
          </Grid>
        </NmForm>
      </Grid>
      <Dialog />
    </Grid>
  )
}
