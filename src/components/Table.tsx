import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableCellProps, IconButton } from "@mui/material";
import { useRouteMatch, useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

type Column<Row> = {
  [Key in keyof Row]: {
    id: Key extends React.Key | null | undefined ? Key : never
    format?: (value: Row[Key], row: Row) => React.ReactChild
    minWidth: number
    align?: TableCellProps["align"]
    labelKey?: string
    label?: string

    sortable?: boolean
  }
}[keyof Row] 

export type TableColumns<Row> = Array<Column<Row>>

export interface Props<Row> {
  columns: TableColumns<Row>
  rows: Array<Row>
  getRowId: (row: Row) => React.Key
  rowsPerPageOptions?: Array<number>
  actions?: Array<{icon: JSX.Element, onClick: (row: Row) => void}>
}

export function NmTable<T>({actions, columns, rows, getRowId, rowsPerPageOptions}: Props<T>) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const query = useQuery();
  const { t } = useTranslation();

  const setQueryParams = (page: number, rowsPerPage: number) => history.push(`${url}?page=${page}&rowsPerPage=${rowsPerPage}`)
  
  rowsPerPageOptions = rowsPerPageOptions || [10, 25, 100]
  const page = query.has("page") ? Number(query.get("page")) : 0
  const rowsPerPage = query.has("rowsPerPage") ? Number(query.get("rowsPerPage")) : rowsPerPageOptions[0]
  
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setQueryParams(newPage, rowsPerPage)
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
    setQueryParams(0, Number(event?.target?.value));
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label ? column.label : column.labelKey ? t(column.labelKey ) : "No column label or key"}
                </TableCell>
              ))}
              {actions?.map((_, i) => <TableCell width={40} key={`a${i}`}/>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={getRowId(row)}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format !== undefined
                            ? column.format(value, row)
                            : value}
                        </TableCell>
                      );
                    })}
                    {actions?.map((action, i) => <TableCell width={40} key={`a${i}`}><IconButton onClick={() => action.onClick(row)}>{action.icon}</IconButton></TableCell>)}
                  </TableRow>
                );
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
};
