import React, { ReactNode } from 'react'
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
  Box,
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
  getRowId: (row: Row, index?: number) => React.Key
  rowsPerPageOptions?: Array<number>
  actions?: Array<(row: Row) => ActionIconProps>
  actionsHeader?: {
    width: number
    element: ReactNode
  }
  tableId?: string
  rowCellsStyles?: {[rowId: React.Key]: Object}
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

/**
 * @param tableId Needed when we have two tables in the same route,
 * e.g. `_extClients`
 */
export function NmTable<T>({
  actions,
  actionsHeader,
  columns,
  rows,
  getRowId,
  rowsPerPageOptions,
  tableId = '',
  rowCellsStyles,
}: Props<T>) {
  const { url } = useRouteMatch()
  const history = useHistory()
  const query = useQuery()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(authSelectors.getUser)
  const userSettings = useSelector(authSelectors.getUserSettings)

  const setQueryParams = (page: number, rowsPerPage: number) => {
    history.push(
      `${url}?page${tableId}=${page}&rowsPerPage${tableId}=${rowsPerPage}`
    )
    if (!!user && !!rowsPerPage) {
      dispatch(
        setUserSettings({
          rowsPerPage,
          username: user.name,
          mode: userSettings.mode,
        })
      )
    }
  }

  rowsPerPageOptions = rowsPerPageOptions || [10, 25, 100, 250]
  const page = query.has(`page${tableId}`)
    ? Number(query.get(`page${tableId}`))
    : 0
  const rowsPerPage = query.has(`rowsPerPage${tableId}`)
    ? Number(query.get(`rowsPerPage${tableId}`))
    : !!userSettings && !!userSettings.rowsPerPage
    ? userSettings.rowsPerPage
    : rowsPerPageOptions[0]

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="2vh"
      width="100%"
    >
      <Paper
        sx={{
          width: '100vw',
          overflow: 'hidden',
        }}
        style={{ paddingLeft: '0rem', paddingRight: '0' }}
      >
        <TableContainer
          sx={{ height: 'auto', maxHeight: '40rem' }}
          style={{
            justifyContent: 'flex-start',
            overflowX: 'auto',
            marginRight: 'auto',
            marginLeft: 'auto',
            padding: '10px',
          }}
        >
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
                  <TableCell width={actionsHeader?.width ?? 60} key={`a${i}`}>
                    {actionsHeader?.element ?? ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={getRowId(row, i)}
                    >
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={
                              rowCellsStyles ? rowCellsStyles[getRowId(row)] : undefined
                            }
                          >
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
    </Box>
  )
}
