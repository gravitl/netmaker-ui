import React, { useCallback, useEffect } from "react";
import { Typography, CircularProgress, Modal, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { login } from "../../store/modules/api/actions";
import { authSelectors } from "../../store/selectors";
import { correctUserNameRegex, correctPasswordRegex } from "../../util/regex";
import { NmForm } from "../../components/form/Form";
import { NmFormInputText } from "../../components/form/FormTextInput";
import { useTranslation } from "react-i18next";

const styles = {
  vertTabs: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  mainContainer: {
    marginTop: "2em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    display: "flex",
    textAlign: "center",
  },
  modal: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any;

const initialLoginForm = { username: "", password: "" };

export function Login() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLogginIn = useSelector(authSelectors.isLogginIn);
  const isLoggedIn = useSelector(authSelectors.getLoggedIn);

  const history = useHistory();
  const location = useLocation<{ background?: Location }>();

  const [error, setError] = React.useState("");
  const [triedToLogin, setTriedToLogin] = React.useState(false);

  useEffect(() => {
    if (!triedToLogin) {
      return;
    }

    if (isLogginIn) {
      setError("");
    } else if (!isLoggedIn) {
      setError(t("login.loginFailed"));
    }
  }, [isLogginIn, isLoggedIn, triedToLogin, setError, t]);

  const loginSubmit = useCallback(
    (data: typeof initialLoginForm) => {
      dispatch(login.request(data));
      setTriedToLogin(true);
    },
    [dispatch, setTriedToLogin]
  );

  const loginResolver = useCallback((data: typeof initialLoginForm) => {
    const usernameError = !correctUserNameRegex.test(data.username)
      ? {
          message: t("login.validation.username"),
          type: "value",
        }
      : undefined;
    const passwordError = !correctPasswordRegex.test(data.password)
      ? {
          message: t("login.validation.password"),
          type: "value",
        }
      : undefined;

    if (usernameError || passwordError) {
      return {
        errors: {
          username: usernameError,
          password: passwordError,
        },
        values: {},
      };
    }

    return {
      values: {
        username: data.username,
        password: data.password,
      },
      errors: {},
    };
  }, [t]);

  if (isLoggedIn)
    return <Redirect to={location.state?.background?.href || "/"} />;

  return (
    <Modal
      style={{ display: "flex", flex: 1 }}
      open={true}
      onClose={() => {
        history.goBack();
      }}
    >
      <Box style={styles.modal}>
        <div style={styles.center}>
          {error && (
            <Typography variant="h5" color="error">
              {error}
            </Typography>
          )}
          {isLogginIn && <CircularProgress />}
        </div>
        <h3
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            textAlign: "center",
          }}
        >
          {t("login.header")}
        </h3>
        <NmForm
          initialState={initialLoginForm}
          resolver={loginResolver}
          onSubmit={loginSubmit}
          submitText={t("login.login")}
          submitProps={{
            type: "submit",
            fullWidth: true,
            variant: "contained",
            color: "primary",
            style: styles.vertTabs,
          }}
          disabled={isLogginIn}
        >
          <NmFormInputText
            name={"username"}
            label={t("login.label.username")}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoComplete="false"
            autoFocus
          />
          <NmFormInputText
            name={"password"}
            label={t("login.label.password")}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            placeholder=""
            type="password"
            id="password"
            autoComplete="false"
          />
        </NmForm>
      </Box>
    </Modal>
  );
}
