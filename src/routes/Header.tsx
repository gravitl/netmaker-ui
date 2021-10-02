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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../netmaker.png";
import Info from "@material-ui/icons/Info";
import {
  NETWORK_DETAIL_TAB_NAME,
  NODE_DETAIL_TAB_NAME,
  OTK_DETAIL_TAB_NAME,
  DNS_DETAIL_TAB_NAME,
  EXTERNAL_CLIENTS_TAB_NAME,
  UI_VERSION,
} from "../config";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { authSelectors, serverSelectors } from "../store/selectors";
import { logout } from "../store/modules/auth/actions";

const useStyles = makeStyles((theme) => ({
  topBarMain: {
    marginLeft: "1em",
    marginRight: "1em",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
}));

export const LoginLink: React.FC = ({ children }) => {
  let location = useLocation();

  return (
    <Button color="inherit">
      <Link
        style={{ color: "inherit" }}
        to={{
          pathname: "/login",
          // This is the trick! This link sets
          // the `background` in location state.
          state: { background: location },
        }}
      >
        {children}
      </Link>
    </Button>
  );
};

export function Header() {
  const classes = useStyles();

  const match = useRouteMatch("/login");
  const showAuthButton = !match;

  const user = useSelector(authSelectors.getUser);
  const serverConfig = useSelector(serverSelectors.getServerConfig);
  const isLoggedIn = useSelector(authSelectors.getLoggedIn);
  const dispatch = useDispatch();

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Grid container className={classes.topBarMain}>
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
                Users
              </Button>
            ) : null}
            <div className={classes.central}>
              <Typography
                variant="h3"
                className={classes.title}
                onClick={() => window.location.reload()}
              >
                <img
                  className={classes.logo}
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
                    className={classes.subTitle}
                    // onClick={() => setIsUpdatingUser(true)}
                  >
                    <strong>{user!.name}</strong>
                  </Typography>
                  <Button color="inherit" onClick={() => dispatch(logout())}>
                    Logout
                  </Button>
                </>
              ) : (
                <LoginLink>Login</LoginLink>
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
              <Tab label={NETWORK_DETAIL_TAB_NAME} tabIndex={0} />
              <Tab label={NODE_DETAIL_TAB_NAME} tabIndex={1} />
              <Tab label={OTK_DETAIL_TAB_NAME} tabIndex={2} />
              <Tab
                label={
                  "DNS" + serverConfig.DNSMode
                    ? `${DNS_DETAIL_TAB_NAME} (DISABLED)`
                    : DNS_DETAIL_TAB_NAME
                }
                tabIndex={3}
                disabled={serverConfig.DNSMode}
              />
              <Tab label={EXTERNAL_CLIENTS_TAB_NAME} tabIndex={4} />
              <div className={classes.central2}>
                <Tooltip
                  title={
                    serverConfig.Version
                      ? "VERSIONS\nServer: " +
                        serverConfig.Version +
                        ", UI: " +
                        UI_VERSION
                      : "VERSIONS\nServer: not found, UI:" + UI_VERSION
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
