import { Container, Grid } from "@mui/material";
import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLinkBreadcrumb } from "~components/PathBreadcrumbs";

export const Dashboard: React.FC = () => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  useLinkBreadcrumb({
    title: t("breadcrumbs.dashboard")
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container 
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <h2>{t("dashboard.title")}</h2>
            </Grid>
          </Grid>
        </Route>  
      </Switch>
    </Container>
  );
};
