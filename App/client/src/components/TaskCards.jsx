import {
  Box,
  Card,
  Grid,
  Icon,
  IconButton,
  styled,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from "axios";
import { useCallback, useEffect, useState, useContext } from "react";
import { authorizationContext } from "../context";
import { ReviewStage } from "../noteReviewStage";

const NoteTitle = styled(Link)(({ theme }) => ({
  marginLeft: 24,
  fontWeight: "500",
  underline: "hover",
  [theme.breakpoints.down("sm")]: { marginLeft: 4 },
}));

export default function TaskCards({notes,tasks,setTasks,completedNum,setCompleteNum}) {

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

    //TODO
    //Add error handling
    axios.put("/api/notes/ReviewStage", {
      id: id,
      stage: currentStage + 1,
      updateReviewStageToNow: true,
    });
    setCompleteNum(completedNum+1);
    setTasks(tasks.map((task) => {
      if(task.id==id){
        return {...task,completed:true};
      }
      else{
        return task;
      }
    }));
  };

  const handleIgnoreNote = async (id) => {
    handleMoreVertClose();
    
    //TODO
    //Add error handling
    axios.put("/api/notes/ReviewStage", {
      id: id,
      stage: ReviewStage.Completed,
      updateReviewStageToNow: false,
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // maybe should change the dep
  useEffect(() => {
    async function fetchTasks() {
      try{
        const res = await axios.get("/api/tasks/today");
        setTasks(res.data);
      }
      catch(error){
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if(error.response.status===401){
            console.log("Not authorized! Please log in.")
          }
          console.log(error.response.data);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      }

    }
    fetchTasks();
  }, [authContext.isAuthorized, notes]);

  return tasks.map((task) => {
    if(task.completed===true){
      return(
        <Box>
        <Card sx={{ py: 1, px: 2 }} elevation={3}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <CheckCircleOutlineIcon fontSize="large"/>
          </Box>
        </Card>
        <Box py={1} />
      </Box>
      ) 
    }
    else{
      return (
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
      )
    }
  });
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
