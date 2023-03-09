import { FC, useState, useCallback, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { NmTable, TableColumns } from '~components/Table'
import CopyText from '~components/CopyText'
import { Button, Chip, Grid, TextField } from '@mui/material'
import CustomizedDialogs from '~components/dialog/CustomDialog'
import { EnrollmentKey } from '~store/modules/enrollmentkeys'
import { DeleteOutline } from '@mui/icons-material'
import { isEnrollmentKeyValid } from '~util/enrollmentkeys'
import { EnrollmentKeyDetailsModal } from './EnrollmentKeyDetailsModal'
import { useDispatch } from 'react-redux'
import { deleteEnrollmentKey } from '~store/modules/enrollmentkeys/actions'

interface EnrollmentKeysTableProps {
  keys: EnrollmentKey[]
}

type EnrollmentKeyTableData = EnrollmentKey & { status?: boolean }

export const EnrollmentKeysTable: FC<EnrollmentKeysTableProps> = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [searchFilter, setSearchFilter] = useState('')
  const [shouldShowConfirmDeleteModal, setShouldShowConfirmDeleteModal] =
    useState(false)
  const [shouldShowKeyDetailsModal, setShouldShowKeyDetailsModal] =
    useState(false)
  const [targetKey, setTargetKey] = useState<EnrollmentKey | null>(null)

  const tableData = useMemo(
    () =>
      props.keys.map((key) => ({ ...key, status: isEnrollmentKeyValid(key) })),
    [props.keys]
  )

  const columns: TableColumns<EnrollmentKeyTableData> = [
    {
      id: 'tags',
      labelKey: 'common.tags',
      minWidth: 150,
      sortable: true,
      format: (value, key) => (
        <Button variant="text" onClick={() => openKeyDetailsModal(key)}>
          {value.map((tag, i) => (
            <Fragment key={`tag-${i}`}>{tag} </Fragment>
          ))}
        </Button>
      ),
    },
    {
      id: 'networks',
      labelKey: 'common.networks',
      minWidth: 200,
      format: (value) => `${value.join(', ')}`,
    },
    {
      id: 'token',
      labelKey: 'common.token',
      minWidth: 50,
      maxWidth: 100,
      format: (value) => <CopyText type="subtitle2" value={value} />,
    },
    {
      id: 'status',
      labelKey: 'common.status',
      minWidth: 100,
      format: (isValid, key) => {
        return (
          <Chip
            label={
              isValid ? <>{t('common.valid')}</> : <>{t('common.invalid')}</>
            }
            size="small"
            color={isValid ? 'success' : 'error'}
          />
        )
      },
    },
  ]

  const filteredKeys = useMemo(() => {
    return tableData.filter((key) =>
      key.tags
        .concat(key.networks)
        .join('')
        .toLocaleLowerCase()
        .includes(searchFilter.toLocaleLowerCase())
    )
  }, [searchFilter, tableData])

  const openConfirmDeleteModal = useCallback((key: EnrollmentKey) => {
    setTargetKey(key)
    setShouldShowConfirmDeleteModal(true)
  }, [])

  const hideConfirmDeleteModal = useCallback(() => {
    setShouldShowConfirmDeleteModal(false)
  }, [])

  const deleteKey = (key: EnrollmentKey) => {
    dispatch(deleteEnrollmentKey.request({ id: key.value }))
  }

  const openKeyDetailsModal = useCallback((key: EnrollmentKey) => {
    setTargetKey(key)
    setShouldShowKeyDetailsModal(true)
  }, [])

  const hideKeyDetailsModal = useCallback(() => {
    setShouldShowKeyDetailsModal(false)
  }, [])

  return (
    <>
      {/* search row */}
      <Grid item xs={12} style={{ marginBottom: '1rem' }}>
        <TextField
          fullWidth
          size="small"
          label={t('common.search')}
          placeholder={t('common.searchbytag')}
          value={searchFilter}
          onInput={(ev: any) => setSearchFilter(String(ev.target.value).trim())}
        />
      </Grid>

      {props.keys.length === 0 ? (
        <div>{t('enrollmentkeys.nokeysavailable')}</div>
      ) : (
        <NmTable
          columns={columns}
          rows={filteredKeys}
          getRowId={(host) => host.value}
          actions={[
            (key) => ({
              tooltip: String(t('common.delete')),
              disabled: false,
              icon: <DeleteOutline />,
              onClick: () => {
                openConfirmDeleteModal(key)
              },
            }),
          ]}
        />
      )}

      {/* modals */}
      {!!targetKey ? (
        <CustomizedDialogs
          open={shouldShowConfirmDeleteModal}
          handleClose={hideConfirmDeleteModal}
          handleAccept={() => deleteKey(targetKey)}
          message={t('common.confirmdeletequestion')}
          title={t('common.confirmdelete')}
        />
      ) : null}

      {!!targetKey ? (
        <EnrollmentKeyDetailsModal
          enrollmentKey={targetKey}
          open={shouldShowKeyDetailsModal}
          onClose={hideKeyDetailsModal}
        />
      ) : null}
    </>
  )
}
