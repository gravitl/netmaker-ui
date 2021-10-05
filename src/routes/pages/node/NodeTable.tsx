import React from "react";
import { useSelector } from "react-redux";
import { nodeSelectors } from "../../../store/selectors";
import { NmLink } from "../../../components";
import { useTranslation } from "react-i18next";
import { useLinkBreadcrumb } from "../../../components/PathBreadcrumbs";
import { Node } from "../../../store/modules/node";
import { NmTable, TableColumns } from "../../../components/Table";

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
