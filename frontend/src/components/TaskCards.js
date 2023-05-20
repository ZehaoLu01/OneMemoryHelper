import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Fab,
  Grid,
  Hidden,
  Icon,
  IconButton,
  styled,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { Fragment, useCallback, useState } from "react";

const StarOutline = styled(Fab)(() => ({
  marginLeft: 0,
  boxShadow: "none",
  background: "#08ad6c !important",
  backgroundColor: "rgba(9, 182, 109, 1) !important",
}));

const DateRange = styled(Fab)(({ theme }) => ({
  marginLeft: 0,
  boxShadow: "none",
  color: "white !important",
  background: `${theme.palette.error.main} !important`,
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: "32px !important",
  height: "32px !important",
}));

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

const ProjectName = styled(Span)(({ theme }) => ({
  marginLeft: 24,
  fontWeight: "500",
  [theme.breakpoints.down("sm")]: { marginLeft: 4 },
}));

export default function TaskCards() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { palette } = useTheme();
  const isMoreVertOpen = Boolean(anchorEl);

  const handleMoreVertClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  });
  const handleMoreVertClose = useCallback(() => {
    setAnchorEl(null);
  });

  return [1, 2, 3, 4].map((id) => (
    <Fragment key={id}>
      <Card sx={{ py: 1, px: 2 }} className="project-card" elevation={3}>
        <Grid container alignItems="center">
          <Grid item md={8} xs={7}>
            <Box display="flex" alignItems="center">
              <Checkbox />
              <StarOutline size="small">
                <Icon>star_outline</Icon>
              </StarOutline>
              <ProjectName>Project {id}</ProjectName>
            </Box>
          </Grid>

          <Grid item md={3} xs={4}>
            <Box> NoteBook </Box>
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
                <MenuItem onClick={handleMoreVertClose}>1</MenuItem>
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
