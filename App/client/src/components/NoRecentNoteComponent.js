import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { ReactComponent as NoNoteImg } from "../resources/NoNote.svg";
import { useContext } from "react";
import { authorizationContext } from "../context";

export default function NoRecentNoteComponent({ isRequestInProgress = false }) {
  const authContext = useContext(authorizationContext);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="600px"
    >
      <Box
        display="flex"
        flexDirection="Column"
        justifyContent="center"
        alignItems="center"
        width="300px"
      >
        <Box sx={{ mb: "1rem" }}>
          <NoNoteImg width="200px" height="200px" />
        </Box>
        {authContext.isAuthorized === true ? (
          isRequestInProgress ? (
            <CircularProgress />
          ) : (
            <AuthorizedButNoNoteText></AuthorizedButNoNoteText>
          )
        ) : (
          <NotAuthorizedTextAndButton></NotAuthorizedTextAndButton>
        )}
      </Box>
    </Box>
  );
}

function AuthorizedButNoNoteText() {
  return (
    <Box
      display="flex"
      flexDirection="Column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5" gutterBottom>
        Please sign in!
      </Typography>
      <Button variant="contained">Sign in</Button>
    </Box>
  );
}

function NotAuthorizedTextAndButton() {
  return (
    <Box
      display="flex"
      flexDirection="Column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5" gutterBottom>
        Please sign in!
      </Typography>
      <Button variant="contained">Sign in</Button>
    </Box>
  );
}
