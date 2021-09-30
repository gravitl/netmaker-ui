import {
  Card,
  Grid,
  CardContent,
  Container,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  useRouteMatch,
  Switch,
  Route,
  useParams,
  useHistory,
} from "react-router-dom";
import { NmForm } from "../../components/form/Form";
import { NmFormInputSwitch } from "../../components/form/FormSwitchInput";
import { NmFormInputText } from "../../components/form/FormTextInput";
import { Network } from "../../store/modules/network/types";
import { authSelectors, networkSelectors } from "../../store/selectors";
import { NmLink } from "../../components/Link";
import { updateNetwork } from "../../store/modules/network/actions";
import { SubmitHandler } from "react-hook-form";
import { networkToNetworkPayload } from "../../store/modules/network/utils";
import { deleteNetwork } from "../../store/modules/network/actions";

const networkByNetIdPredicate = (netid: string) => (network: Network) =>
  network.netid === netid;

const NetworkDetailsEdit: React.FC<{
  network: Network;
  onSubmit: SubmitHandler<Network>;
}> = ({ network, onSubmit }) => {
  const { t } = useTranslation();

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <>
      <NmForm initialState={network} onSubmit={onSubmit}>
        <Grid item xs={12}>
          <div>
            <NmFormInputSwitch
              name={"allowmanualsignup"}
              label={"Allow Node Signup Without Keys"}
            />
          </div>
        </Grid>
        <NmFormInputText
          name={"addressrange"}
          label={t("network.addressrange")}
        />
        <NmFormInputText
          name={"addressrange6"}
          label={t("network.addressrange6")}
        />
        <NmFormInputText name={"localrange"} label={t("network.localrange")} />
        <NmFormInputText
          name={"displayname"}
          label={t("network.displayname")}
        />
        <NmFormInputText
          name={"defaultinterface"}
          label={t("network.defaultinterface")}
        />
        <NmFormInputText
          name={"defaultlistenport"}
          label={t("network.defaultlistenport")}
        />
        <NmFormInputText
          name={"defaultpostup"}
          label={t("network.defaultpostup")}
        />
        <NmFormInputText
          name={"defaultpostdown"}
          label={t("network.defaultpostdown")}
        />
        <NmFormInputText
          name={"defaultkeepalive"}
          label={t("network.defaultkeepalive")}
        />
        <NmFormInputText
          name={"checkininterval"}
          label={t("network.checkininterval")}
        />
        <NmFormInputText
          name={"defaultextclientdns"}
          label={t("network.defaultextclientdns")}
        />
        <NmFormInputText name={"defaultmtu"} label={t("network.defaultmtu")} />
        <NmFormInputSwitch
          name={"isdualstack"}
          label={t("network.isdualstack")}
        />
        <NmFormInputSwitch
          name={"defaultsaveconfig"}
          label={t("network.defaultsaveconfig")}
        />
        <NmFormInputSwitch
          name={"defaultudpholepunch"}
          label={t("network.defaultudpholepunch")}
        />
      </NmForm>
    </>
  );
};

const NetworkDetails: React.FC = () => {
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { networkId } = useParams<{ networkId: string }>();
  const network = useSelector(networkSelectors.getNetworks).find(
    networkByNetIdPredicate(networkId)
  );

  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken);
  const editNetworkSubmit = useCallback(
    (data: Network) => {
      dispatch(
        updateNetwork.request({
          token: token!,
          network: networkToNetworkPayload(data),
        })
      );
    },
    [dispatch, token]
  );

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <>
      <br />
      Nodes last modified:{" "}
      {new Date(network.nodeslastmodified * 1000).toUTCString()}
      <br />
      Network last modified:{" "}
      {new Date(network.networklastmodified * 1000).toUTCString()}
      <Switch>
        <Route path={`${path}/edit`}>
          <NetworkDetailsEdit network={network} onSubmit={editNetworkSubmit} />
          <Button
            variant="outlined"
            onClick={() => {
              history.push(
                url.replace(":networkId", network.netid).replace("/edit", "")
              );
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => console.log("removeNetwork(networkData.netid)")}
          >
            {t("common.delete")}
          </Button>
        </Route>
        <Route exact path={path}>
          <NmLink to={`${url}/edit`} variant="outlined">
            {t("common.edit")}
          </NmLink>
          <NmLink to={`${url}/accesskeys`} variant="outlined">
            {t("header.accessKeys")}
          </NmLink>
        </Route>
      </Switch>
    </>
  );
};

const NetworkCard: React.FC<{ url: string; networkId: string }> = ({
  url,
  networkId,
}) => {
  const network = useSelector(networkSelectors.getNetworks).find(
    networkByNetIdPredicate(networkId)
  );

  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken)!;
  const deleteNetworkCallback = useCallback(
    () =>
      dispatch(
        deleteNetwork.request({
          token,
          netid: network!.netid,
        })
      ),
    [dispatch, token, network]
  );

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <Card variant="outlined" sx={{ margin: "0.5em" }}>
      <CardContent>
        <NmLink to={`${url}/${networkId}/details`}>
          <Typography variant="h5" component="div">
            {network.displayname}
          </Typography>
        </NmLink>
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
      <Box>
        <IconButton aria-label="delete" onClick={deleteNetworkCallback}>
          <Delete />
        </IconButton>
      </Box>
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
            {listOfNetworks.map((network) => (
              <NetworkCard
                key={network.netid}
                url={url}
                networkId={network.netid}
              />
            ))}
          </Grid>
        </Route>
        <Route path={`${path}/create`}>
          {/* <NmForm initialState={{}} onSubmit={onSubmit}>
            
          </NmForm> */}
        </Route>
        <Route path={`${path}/:networkId/details`}>
          <NetworkDetails />
        </Route>
      </Switch>
    </Container>
  );
};
