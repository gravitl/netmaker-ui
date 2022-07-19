import React, { useCallback, useMemo } from 'react'
import {
  Modal,
  Box,
  Grid,
  FormHelperText,
  useFormControl,
  FormControl,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useRouteMatch, useParams } from 'react-router-dom'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { createEgressNode } from '~modules/node/actions'
import { useNodeById } from '~util/node'
import { NmForm, NmFormInputText, validate, NmFormInputSwitch} from '~components/form'
import { correctIPv4CidrRegex, correctIpv6Regex } from '~util/regex'
import { convertStringToArray } from '~util/fields'
import { makeStyles, createStyles } from '@mui/styles'

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
  mainContainer: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    display: 'flex',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    backgroundColor: 'white',
    border: '1px solid #000',
    minWidth: '33%',
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any

function HelperText(props: { text: string; focusText: string }) {
  const { focused } = useFormControl() || {}

  const helperText = React.useMemo(() => {
    if (focused) {
      return props.focusText
    }

    return props.text
  }, [focused, props.text, props.focusText])

  return <FormHelperText>{helperText}</FormHelperText>
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

export function CreateEgress() {
  const history = useHistory()
  const theme = useTheme()
  const { t } = useTranslation()
  const { netid, nodeId } = useParams<{ netid: string; nodeId: string }>()
  const { url } = useRouteMatch()
  const node = useNodeById(nodeId)
  const dispatch = useDispatch()
  const classes = useStyles()

  useLinkBreadcrumb({
    link: url,
    title: t('breadcrumbs.createegress'),
  })

  interface EgressData {
    ranges: string
    iface: string
    natEnabled: boolean
  }

  const initialState: EgressData = {
    ranges: '',
    iface: '',
    natEnabled: true,
  }

  const onSubmit = useCallback(
    (data: EgressData) => {
      const newRanges = data.ranges.split(',')
      for (let i = 0; i < newRanges.length; i++) {
        newRanges[i] = newRanges[i].trim()
      }
      dispatch(
        createEgressNode.request({
          netid: netid,
          nodeid: nodeId,
          payload: {
            ranges: newRanges,
            interface: data.iface,
            natEnabled: data.natEnabled 
          },
        })
      )
      history.goBack()
    },
    [dispatch, netid, nodeId, history]
  )
  const createIPValidation = useMemo(
    () =>
      validate<EgressData>({
        ranges: (ranges, formData) => {
          if (!formData.ranges) {
            return undefined
          }

          if (typeof ranges === 'string') {
            ranges = convertStringToArray(ranges)
          }

          for (let i = 0; i < ranges.length; i++) {
            const correctIPv4 = correctIPv4CidrRegex.test(ranges[i])
            const correctIPv6 = correctIpv6Regex.test(ranges[i])
            if (!correctIPv4 && !correctIPv6) {
              return {
                message: t('node.validation.egressgatewayrange'),
                type: 'value',
              }
            }
          }
          return undefined
        },
      }),
    [t]
  )

  if (!node) {
    return <h2>{t('error.notfound')}</h2>
  }

  return (
    <Modal
      style={{ display: 'flex', flex: 1 }}
      open={true}
      onClose={() => {
        history.goBack()
      }}
    >
      <Box
        style={{
          ...styles.modal,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <NmForm
          initialState={initialState}
          resolver={createIPValidation}
          onSubmit={onSubmit}
          submitProps={{
            fullWidth: true,
            variant: 'contained',
          }}
          submitText={t('common.create')}
          sx={{ margin: '2em 0 2em 0' }}
        >
          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            sx={{ margin: '1em 0 1em 0' }}
          >
            <Grid
              item
              xs={12}
              sm={8}
              sx={{ textAlign: 'center', margin: '1em 0 1em 0' }}
            >
              <Typography variant="h4">{t('node.createegress')}</Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <NmFormInputText
                multiline
                minRows={2}
                fullWidth
                name={'ranges'}
                label={String(t('node.egressgatewayranges'))}
                sx={{ height: '100%', margin: '1em 0 1em 0' }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <NmFormInputText
                  fullWidth
                  name={'iface'}
                  label={String(t('node.interface'))}
                />
                <HelperText
                  text={t('helper.egress')}
                  focusText={t('helper.egressiface')}
                />
              </FormControl>
            </Grid>
            <Grid
            item
            xs={12}
            sm={10}
            md={10}
            className={classes.center + ' ' + classes.rowMargin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <Tooltip
                  title={t('helper.defaultnatenabled') as string}
                  placement="top"
                >
                  <div>
                    <NmFormInputSwitch
                      name={'natEnabled'}
                      label={String(t('network.defaultnatenabled'))}
                    />
                  </div>
              </Tooltip>
            </Grid>
          </Grid>
        </NmForm>
      </Box>
    </Modal>
  )
}
