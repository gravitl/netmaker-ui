import React from "react";
import {
  AppBar,
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Logo from "../netmaker.png";
import Info from "@mui/icons-material/Info";
import {
  UI_VERSION,
} from "../config";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useRouteMatch } from "react-router-dom";
import { authSelectors, serverSelectors } from "../store/selectors";
import { logout } from "../store/modules/auth/actions";
import { NmLink } from "../components"

const styles = {
  topBarMain: {
    marginLeft: "1em",
    marginRight: "1em",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: "2em",
  },
  title: {
    textAlign: "center",
    flexGrow: 1,
  },
  title2: {
    textAlign: "center",
    flexGrow: 1,
  },
  subTitle: {
    paddingRight: "3em",
    cursor: "pointer",
  },
  logo: {
    objectFit: "cover",
    width: "50%",
    height: "100%",
    minWidth: "2em",
  },
  central: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  central2: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
} as any;

export const LoginLink: React.FC = ({ children }) => {
  let location = useLocation();

  return (
      <NmLink
        color="inherit"
        to={{
          pathname: "/login",
          // This is the trick! This link sets
          // the `background` in location state.
          state: { background: location },
        }}
      >
        {children}
      </NmLink>
  );
};

export function Header() {
  const { t } = useTranslation();

  const match = useRouteMatch("/login");
  const showAuthButton = !match;

  const user = useSelector(authSelectors.getUser);
  const serverConfig = useSelector(serverSelectors.getServerConfig);
  const isLoggedIn = useSelector(authSelectors.getLoggedIn);
  const dispatch = useDispatch();

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Grid container style={styles.topBarMain}>
        <AppBar position="static">
          <Toolbar>
            <Button
              color="inherit"
              href={"https://docs.netmaker.org"}
              target="_blank"
            >
              Docs
            </Button>
            {isLoggedIn && user!.isAdmin ? (
              <Button
                style={{ marginLeft: "1em" }}
                color="inherit"
                // onClick={() => setCreatingUser(true)}
              >
                {t("header.users")}
              </Button>
            ) : null}
            <div style={styles.central}>
              <Typography
                variant="h3"
                style={styles.title}
                onClick={() => window.location.reload()}
              >
                <img
                  style={styles.logo}
                  src={Logo}
                  alt="Netmaker makes networks."
                />
              </Typography>
            </div>
            {showAuthButton &&
              (isLoggedIn ? (
                <>
                  <Typography
                    component="p"
                    style={styles.subTitle}
                    // onClick={() => setIsUpdatingUser(true)}
                  >
                    <strong>{user!.name}</strong>
                  </Typography>
                  <Button color="inherit" onClick={() => dispatch(logout())}>
                  {t("header.logout")}
                  </Button>
                </>
              ) : (
                <LoginLink>{t("header.login")}</LoginLink>
              ))}
          </Toolbar>
        </AppBar>
        {isLoggedIn ? (
          <AppBar position="relative" color="default">
            <Tabs
              value={0}
              centered
              aria-label="main table"
              textColor="primary"
              indicatorColor="primary"
              // onChange={handleChange}
            >
              <Tab label={t("header.networks")} tabIndex={0} />
              <Tab label={t("header.nodes")} tabIndex={1} />
              <Tab label={t("header.accessKeys")} tabIndex={2} />
              <Tab
                label={
                  "DNS" + serverConfig.DNSMode
                    ? `${t("header.dns")} (${t("common.disabled")})`
                    : t("header.dns")
                }
                tabIndex={3}
                disabled={serverConfig.DNSMode}
              />
              <Tab label={t("header.externalClients")} tabIndex={4} />
              <div style={styles.central2}>
                <Tooltip
                  title={
                    serverConfig.Version
                      ? `${t("common.version")} ${t("common.server")}: ${serverConfig.Version}, UI: ${UI_VERSION}`
                      : `${t("common.version")} ${t("common.server")}: ${t("common.notFound")}, UI: ${UI_VERSION}`
                  }
                  placement="bottom"
                >
                  <Info color="primary" />
                </Tooltip>
              </div>
            </Tabs>
          </AppBar>
        ) : null}
      </Grid>
    </Box>
  );
}
