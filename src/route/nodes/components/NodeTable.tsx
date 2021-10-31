import React from "react";
import { useSelector } from "react-redux";
import { nodeSelectors } from "~store/selectors";
import { NmLink } from "~components/index";
import { useTranslation } from "react-i18next";
import { useLinkBreadcrumb } from "~components/PathBreadcrumbs";
import { Node } from "~modules/node";
import { NmTable, TableColumns } from "~components/Table";
import { Chip } from "@mui/material";

const columns: TableColumns<Node> = [
  {
    id: "id",
    label: "Id",
    minWidth: 170,
    sortable: true,
    format: (value, node) => <NmLink to={`/networks/${node.network}/nodes/${encodeURIComponent(value)}`}>{value}</NmLink>,
  },
  { id: "name", labelKey: "node.name", minWidth: 100, sortable: true },
  {
    id: "address",
    labelKey: "node.address",
    minWidth: 170,
    align: "right",
  },
  {
    id: "network",
    labelKey: "node.network",
    minWidth: 170,
    align: "right",
    format: (value) => <NmLink to={`/networks/${value}`}>{value}</NmLink>,
  },
  {
    id: "lastcheckin",
    labelKey: "node.status",
    minWidth: 170,
    align: "right",
    format: (lastcheckin) => {
      const time = (Date.now()/1000)
      if(time - lastcheckin >= 1800)
        return <Chip color="error" label="ERROR" />
      if(time - lastcheckin >= 300)
        return <Chip color="warning" label="WARNING" />
        return <Chip color="success" label="HEALTHY" />
    }
  },
];

export const NodeTable: React.FC = () => {
  const { t } = useTranslation();
  const listOfNodes = useSelector(nodeSelectors.getNodes);

  useLinkBreadcrumb({
    title: t("breadcrumbs.nodes"),
  });

  return (
    <NmTable columns={columns} rows={listOfNodes} getRowId={(row) => row.id} />
  );
};
