import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import "./custom.css";
import Nav from "./components/Nav";

import "./App.css";
import NewNotesComp from "./components/NewNotesComponents";
import TaskCards from "./components/TaskCards";
import ShortcutCards from "./components/ShortcutCards";
import LinearWithValueLabel from "./components/LinearWithValueLabel";
import { authorizationContext } from "./context";
import axios from "axios";
import { useState, useEffect } from "react";

const theme = createTheme({
  palette: {
    primary: {
      light: "#9C51E0",
      main: "#7719AA",
      dark: "#9332BF",
    },
    secondary: {
      main: "#191838",
    },
    warning: {
      main: "#ECC488",
    },
  },
});

const testingStyle = {
  "&:hover": {
    backgroundColor: "primary.main",
    opacity: [0.9, 0.8, 0.7],
  },
};

export default function Home() {
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    async function fetchState() {
      const res = await axios.get("/api/auth/state");
      if (res.data === undefined) {
        setAuthState({ isAuthorized: false });
      } else {
        setAuthState(res.data);
      }
    }
    fetchState();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <authorizationContext.Provider value={authState}>
        <Box sx={{ display: "flex", flexFlow: "column wrap" }}>
          <Nav />
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Quick Access
                </Typography>
                <ShortcutCards />
                <Typography variant="h4" gutterBottom>
                  Recently Edited Notes
                </Typography>
                <Paper
                  className="contentPaper"
                  sx={{ ...testingStyle }}
                  elevation={3}
                >
                  <NewNotesComp />
                </Paper>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  Tasks
                </Typography>
                <Paper
                  className="contentPaper"
                  sx={{ ...testingStyle, height: "100%" }}
                  elevation={3}
                >
                  <Container>
                    <Box sx={{ mt: "8px", mb: "8px" }}>
                      <LinearWithValueLabel></LinearWithValueLabel>
                    </Box>
                    <TaskCards />
                  </Container>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </authorizationContext.Provider>
    </ThemeProvider>
  );
}
