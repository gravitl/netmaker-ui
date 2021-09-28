import {
  Card,
  Grid,
  CardContent,
  Container,
  Typography,
  Button,
  FormControlLabel,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import {
  useRouteMatch,
  Link,
  Switch,
  Route,
  useParams,
  useHistory,
} from "react-router-dom";
import { NmForm } from "../../components/form/Form";
import { NmFormInputSwitch } from "../../components/form/FormSwitchInput";
import { NmFormInputText } from "../../components/form/FormTextInput";
import { Network } from "../../store/modules/network/types";
import { networkSelectors } from "../../store/selectors";

const networkByNetIdPredicate = (netid: string) => (network: Network) =>
  network.netid === netid;

const NetworkDetails: React.FC = () => {
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const { networkId } = useParams<{ networkId: string }>();
  const network = useSelector(networkSelectors.getNetworks).find(
    networkByNetIdPredicate(networkId)
  );

  const isEditing = !!useRouteMatch(`${path}/edit`);

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <>
      <Switch>
        <Route path={`${path}/edit`}>
          Editing network {network.netid}
          <Button variant="outlined" onClick={() => console.log("submit")}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              history.push(path);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => console.log("removeNetwork(networkData.netid)")}
          >
            Delete
          </Button>
        </Route>
        <Route exact path={path}>
          <Link to={`${url}/edit`}>Edit</Link>
        </Route>
      </Switch>
      <NmForm
        initialState={network}
        disabled={!isEditing}
        onSubmit={(data) => console.log(JSON.stringify(data))}
      >
        <Grid item xs={12}>
          <div>
            <NmFormInputSwitch
              name={"allowmanualsignup"}
              label={"Allow Node Signup Without Keys"}
            />
          </div>
        </Grid>
        <NmFormInputText
          disabled={!isEditing}
          name={"name"}
          label={"Label for my input"}
        />
      </NmForm>
      {/* <form >
            <Grid justify='center' alignItems='center' container>
                {error && 
                    <Grid item xs={10}>
                        <div className={classes.center}>
                            <Typography variant='body1' color='error'>{error}...</Typography>
                        </div>
                    </Grid>
                }
                <Grid item xs={12}>
                    <div >
                        <FormControlLabel
                            disabled={!isEditing}
                            control={<Switch checked={allowManual} disabled={!isEditing} onChange={toggleManual} color='primary' name="allowManual" />}
                            label={"Allow Node Signup Without Keys"}
                        />
                    </div>
                </Grid>
                { networkData && settings && Fields.NETWORK_FIELDS.map(fieldName => {
                    return fieldName !== 'accesskeys' ? 
                            <Grid item xs={12} md={5}>
                                {boolFields.indexOf(fieldName) >= 0 ? 
                                <div className={classes.center}>
                                    <Tooltip title={IS_UDP_ENABLED(fieldName) ? 
                                        'UDP Hole Punching disabled when client mode is off.' : ''} placement='top'>
                                    <FormControlLabel
                                        control={
                                        <Switch
                                            checked={settings[fieldName] === "yes"}
                                            onChange={(event) => handleBoolChange(event, fieldName)}
                                            name={fieldName}
                                            color="primary"
                                            disabled={!isEditing || readOnlyFields.indexOf(fieldName) >= 0 || IS_UDP_ENABLED(fieldName)}
                                            id={fieldName}
                                        />
                                        }
                                        label={Fields.NETWORK_DISPLAY_NAME[fieldName]}
                                    /></Tooltip></div> :
                                <TextField
                                    id={fieldName}
                                    label={Fields.NETWORK_DISPLAY_NAME[fieldName]}
                                    className={classes.textFieldLeft}
                                    placeholder={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                    value={timeFields.indexOf(fieldName) >= 0 ? Fields.timeConverter(settings[fieldName]) : settings[fieldName]}
                                    key={fieldName}
                                    fullWidth
                                    disabled={!isEditing || readOnlyFields.indexOf(fieldName) >= 0 || (settings.isdualstack === "no" && fieldName === 'addressrange6')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    onChange={handleChange}
                                />}
                            </Grid> : null
                    })}
            </Grid>
        </form> */}
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
