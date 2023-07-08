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
import { Fragment, useCallback, useEffect, useState, useContext } from "react";
import { authorizationContext } from "../context";

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

export default function TaskCards() {
  // title: note.title,
  // section: note.parentSectionTitle,
  // clientUrl: note.clientUrl,
  // stage: reviewStage,
  const [tasks, setTasks] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMoreVertOpen = Boolean(anchorEl);
  const authContext = useContext(authorizationContext);

  const handleMoreVertClick = useCallback(async (event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMoreVertClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCompleteTask = async (event, id, currentStage) => {
    handleMoreVertClick(event);
    await axios.put("/api/notes/setReviewStage", {
      id: id,
      stage: currentStage + 1,
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // maybe should change the dep
  useEffect(() => {
    async function fetchTasks() {
      const res = await axios.get("/api/tasks/allTasks");
      setTasks(res.data);
    }
    fetchTasks();
  }, [authContext.isAuthorized]);

  return tasks.map((task) => (
    <Fragment key={task.id}>
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
              <IconButton onClick={handleMoreVertClick}>
                <Icon>more_vert</Icon>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMoreVertOpen}
                onClose={handleMoreVertClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={(e) => {
                    handleCompleteTask(e, task.id, task.stage);
                  }}
                >
                  Completed
                </MenuItem>
                <MenuItem onClick={handleMoreVertClose}>2</MenuItem>
                <MenuItem onClick={handleMoreVertClose}>3</MenuItem>
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Box py={1} />
    </Fragment>
  ));
}
