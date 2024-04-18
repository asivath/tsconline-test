import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { TSCButton } from "./components";
import { useTheme } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";
import { GoogleLogin } from "@react-oauth/google";
import { devSafeUrl, fetcher } from "./util";
import { actions, context } from "./state";
import { ErrorCodes, ErrorMessages } from "./util/error-codes";
import { useNavigate } from "react-router";
import { HttpError } from "./util";
import { displayServerError } from "./state/actions/util-actions";

import "./Login.css";

export const Login: React.FC = observer(() => {
  const { state } = useContext(context);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      actions.pushError(ErrorCodes.INVALID_FORM);
      return;
    }
    const data = new FormData(event.currentTarget);
    const formData = {
      username: data.get("username"),
      password: data.get("password")
    };
    try {
      const login = await fetcher("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });
      if (login.ok) {
        await actions.sessionCheck();
        if (!state.isLoggedIn) {
          displayServerError(
            login.status,
            ErrorCodes.UNABLE_TO_LOGIN_SERVER,
            ErrorMessages[ErrorCodes.UNABLE_TO_LOGIN_SERVER]
          );
        } else {
          actions.removeError(ErrorCodes.UNABLE_TO_LOGIN_SERVER);
          actions.pushSnackbar("Succesfully signed in", "success");
          navigate("/");
        }
      } else {
        displayServerError(login.status, ErrorCodes.UNABLE_TO_LOGIN_SERVER, ErrorMessages[ErrorCodes.UNABLE_TO_LOGIN_SERVER]);
      }
    } catch (error) {
      if (error instanceof HttpError) {
        const status = error.status;
        if (status === 401) {
          actions.pushError(ErrorCodes.UNABLE_TO_LOGIN_USERNAME_OR_PASSWORD);
        } else if (status === 400) {
          actions.pushError(ErrorCodes.INVALID_FORM);
        }
      } else {
        displayServerError(error, ErrorCodes.UNABLE_TO_LOGIN_SERVER, ErrorMessages[ErrorCodes.UNABLE_TO_LOGIN_SERVER]);
      }
    }
  };

  return (
    <Box className="login-box">
      <Avatar sx={{ "& .MuiSvgIcon-root": { mr: 0 }, bgcolor: theme.palette.navbar.dark }}>
        <LockOutlinedIcon sx={{ color: theme.palette.selection.main }} />
      </Avatar>
      <Typography variant="h5">{"Sign In"}</Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} className="form-box">
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <TSCButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} endIcon={<LoginIcon />}>
          Sign In
        </TSCButton>
        <Grid container className="grid-container">
          <Grid item xs>
            <Link href="/account-recovery" sx={{ color: "black" }}>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" sx={{ color: "black" }}>
              Don&apos;t have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
        <Box className="divider-box">
          <Box className="divider-line"></Box>
          <Box sx={{ px: 2 }}>
            <Typography variant="caption" sx={{ color: "black" }}>
              or
            </Typography>
          </Box>
          <Box className="divider-line"></Box>
        </Box>
        <GoogleLogin
          onSuccess={() => console.log("Logged in with Google")}
          ux_mode="redirect"
          login_uri={devSafeUrl("/auth/oauth")}
          onError={() => actions.pushError(ErrorCodes.UNABLE_TO_LOGIN_SERVER)}
          width="400px"
        />
      </Box>
    </Box>
  );
});
