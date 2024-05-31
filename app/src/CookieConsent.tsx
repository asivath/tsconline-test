import React, { useState, useEffect } from "react";
import { useTheme, Button, Typography, Box } from "@mui/material";
import styled from "@mui/material/styles/styled";

const CookieConsentContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: theme.palette.background.paper, // Use the background color from the theme
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 1000 // Ensure it's above everything else
}));

interface CookieConsentProps {
  persistent?: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ persistent = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  // uncomment the following line to see the cookie consent banner
  // localStorage.removeItem('cookieConsent');

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    if (!persistent) {
      setIsVisible(false);
    }
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    if (!persistent) {
      setIsVisible(false);
    }
  };

  if (!isVisible && !persistent) {
    return null;
  }

  return (
    <CookieConsentContainer>
      <Typography variant="body1">
        <div>
          This site uses cookies for the purpose of user logins and keeping track of user sessions. To see these
          settings again, please visit the &apos;Sign in&apos; page.
        </div>
        <div>Note: If you reject, you will not be able to sign in, but other features will still work.</div>
      </Typography>
      <Box>
        <Button
          onClick={handleAccept}
          variant="contained"
          style={{ marginRight: theme.spacing(1), color: "white", backgroundColor: "green" }}>
          Accept
        </Button>
        <Button onClick={handleReject} variant="outlined" style={{ color: "red", borderColor: "red" }}>
          Reject
        </Button>
      </Box>
    </CookieConsentContainer>
  );
};

export default CookieConsent;
