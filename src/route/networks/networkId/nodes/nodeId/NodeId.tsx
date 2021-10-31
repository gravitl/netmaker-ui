import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useRouteMatch,
  useHistory,
  useParams,
  Switch,
  Route,
} from "react-router-dom";
import { NmLink } from "~components/index";
import { useLinkBreadcrumb } from "~components/PathBreadcrumbs";
import { useNode } from "~util/node";
import { datePickerConverter } from '~util/unixTime'

export const NodeId: React.FC = () => {
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const { t } = useTranslation();

  const { nodeId } = useParams<{ nodeId: string }>();
  const node = useNode(decodeURIComponent(nodeId));

  useLinkBreadcrumb({
    link: url,
    title: decodeURIComponent(nodeId),
  });

  if (!node) {
    return <div>Not Found</div>;
  }

  return (
    <Switch>
      <Route path={`${path}/edit`}>
        {/* <NodeEdit node={node} /> */}
        <Button
          variant="outlined"
          onClick={() => {
            history.push(
              url
                .replace(":networkId", node.network)
                .replace(":nodeId", node.id)
                .replace("/edit", "")
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
        <Grid
          container
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
        >
          <TextField disabled value={node.id} label={t("node.id")} />
          <TextField disabled value={node.address} label={t("node.address")} />
          <TextField
            disabled
            value={node.address6}
            label={t("node.address6")}
          />
          <TextField
            disabled
            value={node.localaddress}
            label={t("node.localaddress")}
          />
          <TextField disabled value={node.name} label={t("node.name")} />
          <TextField
            disabled
            value={node.listenport}
            label={t("node.listenport")}
          />
          <TextField
            disabled
            value={node.publickey}
            label={t("node.publickey")}
          />
          <TextField
            disabled
            value={node.endpoint}
            label={t("node.endpoint")}
          />
          <TextField disabled value={node.postup} label={t("node.postup")} />
          <TextField
            disabled
            value={node.postdown}
            label={t("node.postdown")}
          />
          allowedips: [ ],
          <TextField
            disabled
            value={node.persistentkeepalive}
            label={t("node.persistentkeepalive")}
          />
          <TextField
            disabled
            value={node.accesskey}
            label={t("node.accesskey")}
          />
          <TextField
            disabled
            value={node.interface}
            label={t("node.interface")}
          />
          <TextField
            disabled
            value={datePickerConverter(node.lastmodified)}
            label={t("node.lastmodified")}
          />
          <TextField
            disabled
            value={datePickerConverter(node.keyupdatetimestamp)}
            label={t("node.keyupdatetimestamp")}
          />
          <TextField
            disabled
            value={datePickerConverter(node.expdatetime)}
            label={t("node.expdatetime")}
          />
          <TextField
            disabled
            value={datePickerConverter(node.lastpeerupdate)}
            label={t("node.lastpeerupdate")}
          />
          <TextField
            disabled
            value={datePickerConverter(node.lastcheckin)}
            label={t("node.lastcheckin")}
          />
          <TextField
            disabled
            value={node.macaddress}
            label={t("node.macaddress")}
          />
          <TextField
            disabled
            value={node.checkininterval}
            label={t("node.checkininterval")}
          />
          <TextField
            disabled
            value={node.password}
            label={t("node.password")}
          />
          <TextField disabled value={node.network} label={t("node.network")} />
          <TextField
            disabled
            value={node.ispending}
            label={t("node.ispending")}
          />
          egressgatewayranges: [ ],
          <TextField
            disabled
            value={node.ingressgatewayrange}
            label={t("node.ingressgatewayrange")}
          />
          <TextField disabled value={node.action} label={t("node.action")} />
          <TextField
            disabled
            value={node.localrange}
            label={t("node.localrange")}
          />
          <TextField disabled value={node.os} label={t("node.os")} />
          <TextField disabled value={node.mtu} label={t("node.mtu")} />
          <FormControlLabel
            label={t("node.saveconfig")}
            control={<SwitchField checked={node.saveconfig} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.isegressgateway")}
            control={<SwitchField checked={node.isegressgateway} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.isingressgateway")}
            control={<SwitchField checked={node.isingressgateway} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.isstatic")}
            control={<SwitchField checked={node.isstatic} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.udpholepunch")}
            control={<SwitchField checked={node.udpholepunch} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.pullchanges")}
            control={<SwitchField checked={node.pullchanges} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.dnson")}
            control={<SwitchField checked={node.dnson} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.isdualstack")}
            control={<SwitchField checked={node.isdualstack} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.isserver")}
            control={<SwitchField checked={node.isserver} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.islocal")}
            control={<SwitchField checked={node.islocal} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.roaming")}
            control={<SwitchField checked={node.roaming} disabled />}
            disabled
          />
          <FormControlLabel
            label={t("node.ipforwarding")}
            control={<SwitchField checked={node.ipforwarding} disabled />}
            disabled
          />
        </Grid>

        <NmLink to={`${url}/edit`} variant="outlined">
          {t("common.edit")}
        </NmLink>
      </Route>
    </Switch>
  );
};
