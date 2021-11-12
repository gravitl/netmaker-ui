import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ minWidth: '25%',m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

export interface DialogProps {
  title: string
  message: string
  handleAccept: () => void
  handleClose: () => void
  open: boolean
}

export default function CustomizedDialogs(Props: DialogProps) {
  const { t } = useTranslation()

  return (
    <div>
      <BootstrapDialog
        onClose={Props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={Props.open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={Props.handleClose}
        >
          {Props.title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{Props.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              Props.handleAccept()
              Props.handleClose()
            }}
          >
            {t('common.accept')}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
