import { observer } from "mobx-react-lite";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import { NavBar } from "./NavBar";
import { Home } from "./Home";
import { Settings } from "./Settings";
import { Chart } from "./Chart";
import { Help } from "./Help";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { originalDarkTheme, originalLightTheme } from "./theme";
import { useContext, useEffect } from "react";
import { context } from "./state";
import { About } from "./About";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { ForgotPassword } from "./ForgotPassword";
import { AccountVerify } from "./AccountVerify";
import { AccountRecovery } from "./AccountRecovery";
import { TSCPopupDialog, TSCError, TSCSnackbar } from "./components";
import { CssBaseline } from "@mui/material";
import "./App.css";
import { DatapackProfile } from "./DatapackProfile";
import { Profile } from "./account_settings/Profile";
import { Admin } from "./admin/Admin";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TSCLoadingDatapacks } from "./components/TSCLoadingDatapacks";
import { toJS } from "mobx";

export default observer(function App() {
  const { state, actions } = useContext(context);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = state.user.settings.darkMode ? originalDarkTheme : originalLightTheme;
  useEffect(() => {
    const backgroundColor = theme.palette.backgroundColor.main;
    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
  }, [theme]);
  const checkOpen =
    location.pathname === "/settings" &&
    state.settingsTabs.selected !== "datapacks" &&
    JSON.stringify(state.config.datapacks) !== JSON.stringify(state.unsavedDatapackConfig);

  return (
    <StyledEngineProvider injectFirst>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {location.pathname != "/verify" && <NavBar />}
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<AccountVerify />} />
            <Route path="/account-recovery" element={<AccountRecovery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/datapack/:id" element={<DatapackProfile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          {Array.from(state.errors.errorAlerts.entries()).map(([context, error], index) => (
            <TSCError
              key={context}
              errorContext={context}
              message={error.errorText}
              index={index}
              count={error.errorCount}
            />
          ))}
          <TSCPopupDialog
            open={state.showSuggestedAgePopup}
            title="Use default age range?"
            onYes={() => actions.handlePopupResponse(true, navigate)}
            onNo={() => actions.handlePopupResponse(false, navigate)}
            onClose={() => actions.fetchChartFromServer(navigate)}
          />
          <TSCLoadingDatapacks open={state.isProcessingDatapacks} />
          <TSCPopupDialog
            open={checkOpen}
            title="Confirm Datapack Selection Change"
            message="You have unsaved changes! Do you want to save your changes?"
            onNo={async () => {
              actions.setUnsavedDatapackConfig(state.config.datapacks);
            }}
            onYes={async () => {
              await actions.processDatapackConfig(toJS(state.unsavedDatapackConfig));
            }}
            onClose={async () => {
              actions.setUnsavedDatapackConfig(state.config.datapacks);
            }}
            customNo="Discard"
            customYes="Save"
          />
          {state.snackbars.map((info, index) => (
            <TSCSnackbar
              key={info.snackbarText}
              text={info.snackbarText}
              count={info.snackbarCount}
              index={index}
              severity={info.severity}
            />
          ))}
        </ThemeProvider>
      </LocalizationProvider>
    </StyledEngineProvider>
  );
});
