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
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import NoRecentNoteComponent from "./components/NoRecentNoteComponent";

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
  const [authState, setAuthState] = useState({ isAuthorized: false });
  const [notes, setNotes] = useState([]);
  const [isFetchNoteInProgress, setIsFetchNoteInProgress] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasksNum,setCompleteTasksNum] =useState(0);

  useEffect(() => {
    async function checkAuth() {
      const response = await axios.get("/api/auth/state");
      console.log(response);
      if (response.data.isAuthorized === true) {
        setAuthState({ isAuthorized: true });
      } else {
        setAuthState({ isAuthorized: false });
      }
    }
    try {
      checkAuth();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // for testing
  const queryDateString = "2023-05-17";
  const authContext = useContext(authorizationContext);

  // maybe should change the dependency list.
  useEffect(() => {
    setIsFetchNoteInProgress(true);
    axios
      .get("/api/notes/recentlyModifiedNotes", {
        params: { lastModifiedDateTime: queryDateString },
      })
      .then((res) => {
        setIsFetchNoteInProgress(false);

        if (res.data?.value !== undefined) {
          setNotes(res.data.value);
        }
      })
      .catch((err) => {
        setIsFetchNoteInProgress(false);

        console.log(err);
      });
  }, [authContext.isAuthorized]);

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
                  {notes.length === 0 ? (
                    <NoRecentNoteComponent
                      isRequestInProgress={isFetchNoteInProgress}
                    ></NoRecentNoteComponent>
                  ) : (
                    <NewNotesComp notes={notes} setNotes={setNotes} />
                  )}
                  {/* <NewNotesComp notes={notes} setNotes={setNotes} /> */}
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
                      <LinearWithValueLabel value={completedTasksNum/tasks.length*100}></LinearWithValueLabel>
                    </Box>
                    <TaskCards notes={notes} tasks={tasks} setTasks={setTasks} completedNum={completedTasksNum} setCompleteNum={setCompleteTasksNum}/>
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
