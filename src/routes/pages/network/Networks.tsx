import { Container, Grid } from "@mui/material";
import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { NetworkCreate } from "./NetworkCreate";
import { NetworkDetails } from "./NetworkDetails";
import { useTranslation } from "react-i18next";
import { NetworkTable } from "./NetworkTable";
import { useLinkBreadcrumb } from "../../../components/PathBreadcrumbs";
import { NmLink } from "../../../components";

export const Networks: React.FC = () => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  useLinkBreadcrumb({
    title: t("breadcrumbs.networks")
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container 
  direction="row"
  justifyContent="space-between"
  alignItems="center">
            <Grid item>
          <h2>{t("network.networks")}</h2>
          </Grid>
            <Grid item>
          <NmLink to={{pathname: '/networks/create'}}>{t("New Network")}</NmLink>
          </Grid>
          </Grid>
          <NetworkTable />
        </Route>
        <Route path={`${path}/create`}>
          <NetworkCreate />
        </Route>
        <Route path={`${path}/:networkId`}>
          <NetworkDetails />
        </Route>
      </Switch>
    </Container>
  );
};
