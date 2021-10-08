import React from "react";
import { useSelector } from "react-redux";
import { networkSelectors } from "../../../store/selectors";
import { NmLink } from "../../../components";
import { Network } from "../../../store/modules/network";
import { datePickerConverter } from '../../../util/unixTime'
import { NmTable, TableColumns } from "../../../components/Table";
import { Delete } from '@mui/icons-material'

const columns: TableColumns<Network> = [
  { id: 'netid', label: 'NetId', minWidth: 170, sortable: true, format: (value) => <NmLink to={`/networks/${value}`}>{value}</NmLink>},
  { id: 'displayname', labelKey: 'network.displayname', minWidth: 100, sortable: true },
  {
    id: 'networklastmodified',
    labelKey: 'network.networklastmodified',
    minWidth: 170,
    align: 'right',
    format: (value) => datePickerConverter(value),
  },
  {
    id: 'nodeslastmodified',
    labelKey: 'network.nodeslastmodified',
    minWidth: 170,
    align: 'right',
    format: (value) => datePickerConverter(value),
  }
];

export const NetworkTable: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks);

  return (
    <NmTable 
      columns={columns}
      rows={listOfNetworks}
      getRowId={(row) => row.netid}
      actions={[{ icon: <Delete />, onClick: (row) => {console.log(`Delete network ${row.netid}`)} }]}
    />
  )
};
