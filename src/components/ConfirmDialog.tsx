import React, { useCallback, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { TFunctionResult } from 'i18next'

interface Props {
  title?: string
  message: string | React.ReactChild | TFunctionResult
  onCancel?: () => void
  onSubmit: () => void
}

const ConfirmDialog: React.FC<Props & { visible: boolean }> = ({
  visible,
  title,
  message,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation()
  return (
    <Dialog open={visible} maxWidth="sm" fullWidth onClose={onCancel}>
      <DialogTitle>{title ? title : t('dialog.title')}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onCancel}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        {typeof message === 'string' ? (
          <Typography>{message}</Typography>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={onCancel}>
          {t('dialog.cancel')}
        </Button>
        <Button color="primary" variant="contained" onClick={onSubmit}>
          {t('dialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const useDialog = () => {
  const [props, setProps] = useState<Props | undefined>(undefined)

  const onCancel = useCallback(() => {
    if (props) {
      props.onCancel?.()
      setProps(undefined)
    }
  }, [props, setProps])

  const onSubmit = useCallback(() => {
    if (props) {
      props.onSubmit()
      setProps(undefined)
    }
  }, [props, setProps])

  if (props) {
    return {
      Component: () => (
        <ConfirmDialog
          {...props}
          onSubmit={onSubmit}
          onCancel={onCancel}
          visible={true}
        />
      ),
      setProps,
    }
  }
  return {
    Component: () => (
      <ConfirmDialog
        {...props!}
        onSubmit={onSubmit}
        onCancel={onCancel}
        visible={false}
      />
    ),
    setProps,
  }
}
