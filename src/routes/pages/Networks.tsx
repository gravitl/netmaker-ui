import {
  Card,
  Grid,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import {
  useRouteMatch,
  Link,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import { Network } from "../../store/modules/network/types";
import { networkSelectors } from "../../store/selectors";

const networkByNetIdPredicate = (netid: string) => (network: Network) =>
  network.netid === netid;

const NetworkDetails: React.FC = () => {
  const { path, url } = useRouteMatch();

  const { networkId } = useParams<{ networkId: string }>();
  const network = useSelector(networkSelectors.getNetworks).find(
    networkByNetIdPredicate(networkId)
  );

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Link to={`${url}/edit`}>Edit</Link>
        <pre>{JSON.stringify(network, null, 2)}</pre>
      </Route>

      <Route path={`${path}/edit`}>
        Editing network {network.netid}
      </Route>
    </Switch>
  );
};

const NetworkCard: React.FC<{ url: string; networkId: string }> = ({
  url,
  networkId,
}) => {
  const network = useSelector(networkSelectors.getNetworks).find(
    networkByNetIdPredicate(networkId)
  );

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <Card variant="outlined" sx={{ margin: "0.5em" }}>
      <CardContent>
        <Link to={`${url}/${networkId}/details`}>
          <Typography variant="h5" component="div">
            {network.displayname}
          </Typography>
        </Link>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Id: {network.netid}
          <br />
          Range ipv4: {network.addressrange}
          <br />
          Node last modified:{" "}
          {new Date(network.nodeslastmodified * 1000).toUTCString()}
          <br />
          Network last modified:{" "}
          {new Date(network.networklastmodified * 1000).toUTCString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Networks: React.FC = () => {
  const { path, url } = useRouteMatch();
  const listOfNetworks = useSelector(networkSelectors.getNetworks);

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <h2>Networks</h2>
          <Grid sx={{ flexWrap: "wrap", display: "flex", flex: 1 }}>
            {listOfNetworks.map((network, index) => (
              <NetworkCard
                key={network.netid}
                url={url}
                networkId={network.netid}
              />
            ))}
          </Grid>
        </Route>
        <Route path={`${path}/:networkId/details`}>
          <NetworkDetails />
        </Route>
      </Switch>
    </Container>
  );
};
