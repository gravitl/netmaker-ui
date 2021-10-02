import { Delete } from "@mui/icons-material";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NmLink } from "../../../components";
import { deleteNetwork } from "../../../store/modules/network/actions";
import { authSelectors } from "../../../store/selectors";
import { NetworkModifiedStats } from "./NetworkModifiedStats";
import { useNetwork } from "./utils";

export const NetworkCard: React.FC<{ url: string; networkId: string }> = ({
  url,
  networkId,
}) => {
  const network = useNetwork(networkId)

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
        <NmLink to={`${url}/${networkId}`}>
          <Typography variant="h5" component="div">
            {network.displayname}
          </Typography>
        </NmLink>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Id: {network.netid}
          <br />
          Range ipv4: {network.addressrange}
          <br />
          <NetworkModifiedStats netid={networkId} />
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
