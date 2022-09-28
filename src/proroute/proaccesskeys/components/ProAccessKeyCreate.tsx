import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom'
import { proSelectors } from '../../../store/selectors'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@mui/material'
import { NmForm, NmFormInputText } from '~components/form'
import {
  clearCurrentAccessKey,
  proCreateAccessKey,
} from '~store/modules/pro/actions'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import AccessKeyDetails from '../../../route/accesskeys/components/AccessKeyDetails'

export const ProAccessKeyCreate: React.FC = () => {
  const tempKey = useSelector(proSelectors.getCurrentAccessKey)
  const history = useHistory()
  const { netid } = useParams<{ netid: string }>()
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = React.useState(false)

  useLinkBreadcrumb({
    title: t('common.create'),
  })
  useLinkBreadcrumb({
    link: url.replace('/create', ''),
    title: netid,
  })

  const handleOpen = () => setModalOpen(true)

  const handleClose = useCallback(() => {
    dispatch(clearCurrentAccessKey())
    setModalOpen(false)
    history.goBack()
  }, [dispatch, history])

  if (tempKey.accessString && tempKey.value && !modalOpen) {
    handleOpen()
  }

  const centerStyle = {
    textAlign: 'center',
    marginBottom: '1em',
  } as any

  interface CreateAccessKey {
    name: string
    uses: number
  }

  const initialState: CreateAccessKey = {
    name: '',
    uses: 0,
  }

  const onSubmit = useCallback(
    (data: CreateAccessKey) => {
      dispatch(
        proCreateAccessKey.request({
          netid,
          newAccessKey: {
            name: data.name || '',
            uses: data.uses || 0,
          },
        })
      )
    },
    [dispatch, netid]
  )

  return (
    <Grid container justifyContent="center" alignItems="center">
      {tempKey.accessString && tempKey.value && (
        <AccessKeyDetails
          title={t('accesskey.details')}
          keyValue={tempKey.value as string}
          accessString={tempKey.accessString as string}
          open={modalOpen}
          handleClose={handleClose}
          handleOpen={handleOpen}
        />
      )}
      <Grid item xs={10} style={centerStyle}>
        <Typography variant="h4">{t('accesskey.create')}</Typography>
        <hr />
      </Grid>
      <Grid item xs={10} style={centerStyle}>
        <Typography variant="h6">
          {`${t('network.network')}: ${netid}`}
        </Typography>
      </Grid>
      <Grid item xs={10} style={centerStyle}>
        <NmForm
          initialState={initialState}
          onSubmit={onSubmit}
          submitProps={{
            variant: 'contained',
            fullWidth: true,
          }}
          submitText={t('common.create')}
        >
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <NmFormInputText
                name={'name'}
                label={`${t('accesskey.name')} (${t('common.optional')})`}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NmFormInputText
                name={'uses'}
                label={String(t('accesskey.uses'))}
                type="number"
              />
            </Grid>
          </Grid>
        </NmForm>
      </Grid>
    </Grid>
  )
}
