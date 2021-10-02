import { Grid, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNetwork, datePickerConverter } from "./utils";

export const NetworkModifiedStats: React.FC<{ netid: string }> = ({
  netid,
}) => {
  const network = useNetwork(netid);
  const { t } = useTranslation();

  if (!network) {
    return null;
  }
  return (
    <Grid container spacing={0} direction="row" flexShrink="initial"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}> 
      <Grid item >
        <TextField
        label={t("Last modified nodes:")}
        type="datetime-local"
        disabled
        value={datePickerConverter(network.nodeslastmodified)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      </Grid>

      <Grid item >
        <TextField
        label={t("Last modified network:")}
        type="datetime-local"
        disabled
        value={datePickerConverter(network.networklastmodified)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      </Grid>
    </Grid>
  );
};
