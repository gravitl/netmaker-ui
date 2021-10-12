import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { networkSelectors } from "../../../store/selectors";
import { NmLink } from "../../../components";
import { Network } from "../../../store/modules/network";
import { datePickerConverter } from "../../../util/unixTime";
import { NmTable, TableColumns } from "../../../components/Table";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { deleteNetwork } from "../../../store/modules/network/actions";

const columns: TableColumns<Network> = [
  {
    id: "netid",
    label: "NetId",
    minWidth: 170,
    sortable: true,
    format: (value) => <NmLink to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: "displayname",
    labelKey: "network.displayname",
    minWidth: 100,
    sortable: true,
  },
  {
    id: "networklastmodified",
    labelKey: "network.networklastmodified",
    minWidth: 170,
    align: "right",
    format: (value) => datePickerConverter(value),
  },
  {
    id: "nodeslastmodified",
    labelKey: "network.nodeslastmodified",
    minWidth: 170,
    align: "right",
    format: (value) => datePickerConverter(value),
  },
];

export const NetworkTable: React.FC = () => {
  const listOfNetworks = useSelector(networkSelectors.getNetworks);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <NmTable
      columns={columns}
      rows={listOfNetworks}
      getRowId={(row) => row.netid}
      actions={[
        (row) => ({
          tooltip: t("Delete"),
          disabled: false,
          icon: <Delete />,
          onClick: () => {
            dispatch(
              deleteNetwork.request({
                netid: row.netid,
              })
            );
          },
        }),
      ]}
    />
  );
};
