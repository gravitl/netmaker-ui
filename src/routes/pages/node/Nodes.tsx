import { Container } from "@mui/material";
import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NodeTable } from "./NodeTable";

export const Nodes: React.FC = () => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <h2>{t("node.nodes")}</h2>
          <NodeTable />
        </Route>
        {/* <Route path={`${path}/create`}>
          <NetworkCreate />
        </Route>
        <Route path={`${path}/:networkId`}>
          <NetworkDetails />
        </Route> */}
      </Switch>
    </Container>
  );
};
