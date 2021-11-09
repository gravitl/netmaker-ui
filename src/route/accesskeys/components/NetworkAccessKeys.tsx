import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom'
import { networkSelectors } from '../../../store/selectors'
import { useTranslation } from 'react-i18next'
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useNetwork } from '~util/network'
import { Delete } from '@mui/icons-material'
import { deleteAccessKey } from '~store/modules/network/actions'
import CustomDialog from '~components/dialog/CustomDialog'

export const NetworkAccessKeys: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks)
  // const dispatch = useDispatch()
  const networkNames = []
  if (listOfNetworks) {
    for(let i = 0; i < listOfNetworks.length; i++) {
      networkNames.push(listOfNetworks[i].netid)
    }
  }
  const history = useHistory()
  const { url } = useRouteMatch()
  const { t } = useTranslation()
  const { netid } = useParams<{ netid: string }>()
  let network = useNetwork(netid)
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [keyName, setKeyName] = React.useState('')

  useLinkBreadcrumb({
    link: url,
    title: netid,
  })

  const styles = {
    titleStyle: {
        textAlign: 'center'
    },
    centerStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonMargin: {
        marginTop: '1em'
    }
  } as any

  const handleClose = () => {
      setKeyName('')
      setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleDeleteNetwork = () => {
    dispatch(
        deleteAccessKey.request({
            netid,
            name: keyName,
        })
    )
  }

  return (
    <Grid container justifyContent='space-around' alignItems='center'>
        {open && 
            <CustomDialog
                open={open}
                handleClose={handleClose}
                handleAccept={handleDeleteNetwork}
                message={t('accesskey.deleteconfirm')}
                title={`${t('common.delete')} ${keyName}`}
            />                
        }
        <Grid item xs={12}>
            <div style={styles.titleStyle}>
                <Typography variant='h4'>
                    {`${t('accesskey.viewing')} ${netid}`}
                </Typography>
            </div>
            <hr />
        </Grid>
        <Grid item xs={10}>
            <div style={styles.titleStyle}>
            {network && network?.accesskeys ?
                <Grid container justifyContent='center' alignItems='center'>
                        <Grid item xs={5}>
                            <Typography variant='h6'>
                                {t('common.name')}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant='h6'>
                            {t('accesskey.usesremaining')}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                        <Grid item xs={12}>
                        {network?.accesskeys.map(accesskey => <Grid container key={accesskey.name} style={styles.buttonMargin}>
                            <Grid item xs={5}>
                                {accesskey.name}
                            </Grid>
                            <Grid item xs={5}>
                                {accesskey.uses}
                            </Grid>
                            <Grid item xs={2}>
                                <Tooltip title={t('common.delete') as string} placement='top'>
                                    <IconButton color='error' onClick={() => {handleOpen(); setKeyName(accesskey.name);}}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>)}
                    </Grid>
                </Grid>
                :
                <Typography variant='h6'>
                    {t('accesskey.none')}
                </Typography>
            }
            </div> 
        </Grid>
        <Grid item xs={6}>
            <div style={styles.centerStyle}>
                <Button style={styles.buttonMargin} fullWidth variant='contained' onClick={
                    () => history.push(`${url}/create`)
                }>
                    {`${t('common.create')} ${t('accesskey.accesskey')}`}
                </Button>
            </div>
        </Grid>
    </Grid>
  )
}
