import React, { useCallback, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { login } from "../../store/modules/api/actions";
import { authSelectors } from "../../store/selectors";
import { correctUserNameRegex, correctPasswordRegex } from "../../util/regex";

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
    position: 'absolute',
    display: "flex",
    flexDirection: "column",
    flex: 1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    // boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  },
} as any

const validate = (username: string, password: string) => {
  const isUserName = correctUserNameRegex.test(username);
  const isPassword = correctPasswordRegex.test(password);
  if (!isUserName) return { status: false, cause: "user" };
  if (!isPassword) return { status: false, cause: "password" };
  return { status: true };
};

export function Login() {
  const dispatch = useDispatch();
  const isLogginIn = useSelector(authSelectors.isLogginIn);
  const isLoggedIn = useSelector(authSelectors.getLoggedIn);

  const history = useHistory();
  const location = useLocation<{background?: Location}>();

  const [userName, setUserName] = React.useState("");
  const [error, setError] = React.useState("");
  const [triedToLogin, setTriedToLogin] = React.useState(false);
  const [password, setPassword] = React.useState("");

  useEffect(() => {
    if (!triedToLogin) {
      return;
    }

    if (isLogginIn) {
      setError("");
    } else if (!isLoggedIn) {
      setError("Failed to login, wrong username or password.");
    }
  }, [isLogginIn, isLoggedIn, triedToLogin, setError]);

  const handleSubmit = useCallback(() => {
    const { status, cause } = validate(userName, password);
    if (status) {
      // check if validated
      // send request
      dispatch(login.request({ username: userName, password }));
      setTriedToLogin(true);
      setUserName("");
      setPassword("");
    } else {
      if (cause === "user")
        setError(
          'Invalid user name provided. Must be between 3 to 40 alphanumeric characters with "-" or "." or an email address.'
        );
      else
        setError(
          "Invalid password provided. Must be between 5 to 64 characters with no white space."
        );
    }
  }, [
    userName,
    password,
    setTriedToLogin,
    setUserName,
    setPassword,
    setError,
    dispatch,
  ]);

  const handleUpdatePassword = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setPassword(event.target.value.trim());
  };

  const handleUpdateUserName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setUserName(event.target.value.trim());
  };


  if(isLoggedIn)
    return <Redirect to={location.state?.background?.href || "/"} />

  return (
    <Modal style={{display: "flex", flex: 1}} open={true} onClose={() => {
        history.goBack()
    }}>
    <Box style={styles.modal} >
        <div style={styles.center}>
            {error && (
            <Typography variant="h5" color="error">
                {error}
            </Typography>
            )}
            {isLogginIn && <CircularProgress />}
        </div>
        <h3 style={{ display: "flex", flex: 1, flexDirection: "row", textAlign: "center" }}>Login below:</h3>
        <form
          style={styles.vertTabs}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField

            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Username"
            name="userName"
            placeholder="username"
            autoComplete="false"
            autoFocus
            value={userName}
            onChange={handleUpdateUserName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            placeholder=""
            type="password"
            onChange={handleUpdatePassword}
            id="password"
            value={password}
            autoComplete="false"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={styles.vertTabs}
            disabled={isLogginIn}
            // style={{ marginTop: "1em" }}
          >
            Login
          </Button>
        </form>
    </Box>
    </Modal>
  );
}
