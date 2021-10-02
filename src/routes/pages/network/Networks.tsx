import { Grid, Container, Card } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import PlusIcon from "@mui/icons-material/ControlPoint";
import { networkSelectors } from "../../../store/selectors";
import { NetworkCard } from "./NetworkCard";
import { NetworkCreate } from "./NetworkCreate";
import { NetworkDetails } from "./NetworkDetails";
import { NmLink } from "../../../components";
import { useTranslation } from "react-i18next";
import { useLinkBreadcrumb } from "../../../components/PathBreadcrumbs";

export const Networks: React.FC = () => {
  const { path, url } = useRouteMatch();
  const { t } = useTranslation();
  const listOfNetworks = useSelector(networkSelectors.getNetworks);


  useLinkBreadcrumb({
    link: url,
    title: t("Networks")
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <h2>{t("Networks")}</h2>
          <Grid container sx={{ flexWrap: "wrap", display: "flex", flex: 1 }}>
          <Grid item xs={12} md={1} sx={{ display: "flex", flex: 1 }}>

            <Card
              variant="outlined"
              sx={{
                margin: "0.5em",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
                <NmLink sx={{ height: "100%", width: "100%" }} to={`${url}/create`}>
                  <PlusIcon />
                </NmLink>
            </Card>
            </Grid>
            {listOfNetworks.map((network) => (
              <Grid item xs={12} md={5}>
                <NetworkCard
                  key={network.netid}
                  url={url}
                  networkId={network.netid}
                />
              </Grid>
            ))}
          </Grid>
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
