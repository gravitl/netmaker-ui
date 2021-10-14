import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { NmForm } from "../../../components/form/Form";
import { NmFormInputSwitch } from "../../../components/form/FormSwitchInput";
import { NmFormInputText } from "../../../components/form/FormTextInput";
import { updateNetwork } from "../../../store/modules/network/actions";
import { Network } from "../../../store/modules/network/types";
import { networkToNetworkPayload } from "../../../store/modules/network/utils";

export const NetworkDetailsEdit: React.FC<{
  network: Network;
}> = ({ network }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (data: Network) => {
      dispatch(
        updateNetwork.request({
          network: networkToNetworkPayload(data),
        })
      );
    },
    [dispatch]
  );

  if (!network) {
    return <div>Not Found</div>;
  }

  return (
    <NmForm
      initialState={network}
      onSubmit={onSubmit}
      submitProps={{
        variant: "outlined",
      }}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <NmFormInputText
        name={"addressrange"}
        label={t("network.addressrange")}
      />
      <NmFormInputText
        name={"addressrange6"}
        label={t("network.addressrange6")}
      />
      <NmFormInputText name={"localrange"} label={t("network.localrange")} />
      <NmFormInputText name={"displayname"} label={t("network.displayname")} />
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
        name={"allowmanualsignup"}
        label={"Allow Node Signup Without Keys"}
      />
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
  );
};
