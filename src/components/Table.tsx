import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableCellProps,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '~util/query'
import { authSelectors } from '~store/types'
import { setUserSettings } from '~store/modules/auth/actions'

type Column<Row> = {
  [Key in keyof Row]: {
    id: Key extends React.Key | null | undefined ? Key : never
    format?: (value: Row[Key], row: Row) => React.ReactChild
    minWidth: number
    align?: TableCellProps['align']
    labelKey?: string
    label?: string

    sortable?: boolean
  }
}[keyof Row]

export type TableColumns<Row> = Array<Column<Row>>

export interface ActionIconProps {
  icon: JSX.Element
  onClick: () => void
  disabled?: boolean
  tooltip?: string
}
export interface Props<Row> {
  columns: TableColumns<Row>
  rows: Array<Row>
  getRowId: (row: Row) => React.Key
  rowsPerPageOptions?: Array<number>
  actions?: Array<(row: Row) => ActionIconProps>
}

function renderActionIcon(
  { onClick, icon, disabled, tooltip }: ActionIconProps,
  i: number
) {
  return (
    <TableCell width={40} key={`a${i}`}>
      <Tooltip title={tooltip || ''}>
        <span>
          <IconButton disabled={disabled} onClick={onClick}>
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    </TableCell>
  )
}

export function NmTable<T>({
  actions,
  columns,
  rows,
  getRowId,
  rowsPerPageOptions,
}: Props<T>) {
  const { url } = useRouteMatch()
  const history = useHistory()
  const query = useQuery()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(authSelectors.getUser)
  const userSettings = useSelector(authSelectors.getUserSettings)

  const setQueryParams = (page: number, rowsPerPage: number) => {
    history.push(`${url}?page=${page}&rowsPerPage=${rowsPerPage}`)
    if (!!user && !!rowsPerPage) {
      dispatch(setUserSettings({
        rowsPerPage,
        username: user.name,
      }))
    }
  }
  

  rowsPerPageOptions = rowsPerPageOptions || [10, 25, 100, 250]
  const page = query.has('page') ? Number(query.get('page')) : 0
  const rowsPerPage = query.has('rowsPerPage')
    ? Number(query.get('rowsPerPage'))
    : !!userSettings && !!userSettings.rowsPerPage 
    ? userSettings.rowsPerPage 
    :rowsPerPageOptions[0]

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setQueryParams(newPage, rowsPerPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    setQueryParams(0, Number(event?.target?.value))
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ height: 'auto', maxHeight: '32rem' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label
                    ? column.label
                    : column.labelKey
                    ? t(column.labelKey)
                    : 'No column label or key'}
                </TableCell>
              ))}
              {actions?.map((_, i) => (
                <TableCell width={40} key={`a${i}`} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={getRowId(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id]
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format !== undefined
                            ? column.format(value, row)
                            : value}
                        </TableCell>
                      )
                    })}
                    {actions?.map((action, i) =>
                      renderActionIcon(action(row), i)
                    )}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
