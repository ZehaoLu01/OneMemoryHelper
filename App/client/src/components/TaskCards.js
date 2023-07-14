import {
  Box,
  Card,
  Grid,
  Icon,
  IconButton,
  styled,
  useTheme,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState, useContext } from "react";
import { authorizationContext } from "../context";
import { ReviewStage } from "../noteReviewStage";

const StyledBox = styled(Box)(({ theme, textTransformStyle, ellipsis }) => ({
  textTransform: textTransformStyle || "none",
  whiteSpace: ellipsis ? "nowrap" : "normal",
  overflow: ellipsis ? "hidden" : "",
  textOverflow: ellipsis ? "ellipsis" : "",
}));

const Span = ({ children, className, ellipsis, textTransform, ...props }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis}
      className={className}
      component="span"
      lineHeight="1.5"
      {...props}
    >
      {children}
    </StyledBox>
  );
};

const NoteTitle = styled(Link)(({ theme }) => ({
  marginLeft: 24,
  fontWeight: "500",
  underline: "hover",
  [theme.breakpoints.down("sm")]: { marginLeft: 4 },
}));

export default function TaskCards(notes) {
  const [tasks, setTasks] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openNoteId, setOpenNoteId] = useState("");
  const authContext = useContext(authorizationContext);

  const handleMoreVertClick = useCallback(async (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenNoteId(id);
  }, []);
  const handleMoreVertClose = useCallback(() => {
    setAnchorEl(null);
    setOpenNoteId("");
  }, []);

  const handleCompleteStage = async (id, currentStage) => {
    handleMoreVertClose();
    await axios.put("/api/notes/ReviewStage", {
      id: id,
      stage: currentStage + 1,
      updateReviewStageToNow: true,
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleIgnoreNote = async (id) => {
    handleMoreVertClose();
    await axios.put("/api/notes/ReviewStage", {
      id: id,
      stage: ReviewStage.Completed,
      updateReviewStageToNow: false,
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // maybe should change the dep
  useEffect(() => {
    async function fetchTasks() {
      const res = await axios.get("/api/tasks/allTasksToday");
      setTasks(res.data);
    }
    fetchTasks();
  }, [authContext.isAuthorized, notes]);

  return tasks.map((task) => (
    <Box>
      <Card sx={{ py: 1, px: 2 }} className="project-card" elevation={3}>
        <Grid container alignItems="center">
          <Grid item md={8} xs={7}>
            <Box display="flex" alignItems="center">
              <NoteTitle
                component="button"
                href={task.clientUrl ? task.clientUrl : task.webUrl}
              >
                {task.title}
              </NoteTitle>
            </Box>
          </Grid>

          <Grid item md={3} xs={4}>
            <Box> {task.section} </Box>
          </Grid>

          <Grid item xs={1}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton
                onClick={(e) => {
                  handleMoreVertClick(e, task.id);
                }}
              >
                <Icon>more_vert</Icon>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={openNoteId === task.id}
                onClose={handleMoreVertClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItemWrapped
                  id={task.id}
                  handler={handleCompleteStage}
                  stage={task.stage}
                >
                  Completed
                </MenuItemWrapped>
                <MenuItemWrapped id={task.id} handler={handleIgnoreNote}>
                  Ignore
                </MenuItemWrapped>
                <MenuItem onClick={handleMoreVertClose}>3</MenuItem>
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Box py={1} />
    </Box>
  ));
}

function MenuItemWrapped({ id, handler, children, stage }) {
  return (
    <MenuItem
      onClick={() => {
        handler(id, stage);
      }}
    >
      {children}
    </MenuItem>
  );
}
