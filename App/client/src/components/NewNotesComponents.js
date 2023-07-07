import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";

import { authorizationContext } from "../context";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function NewNotesComp() {
  const [page, setPage] = useState(0);
  const [notesPerPage, setRowsPerPage] = useState(10);
  const [notes, setNotes] = useState([]);
  // for testing
  const queryDateString = "2023-05-17";
  const authContext = useContext(authorizationContext);

  useEffect(() => {
    axios
      .get("/api/notes/recentlyModified", {
        params: { lastModifiedDateTime: queryDateString },
      })
      .then((res) => {
        if (res.data?.value !== undefined) {
          setNotes(res.data.value);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [authContext.isAuthorized]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * notesPerPage - notes.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow key="head">
            <TableCell>Note Title</TableCell>
            <TableCell align="right">Tab</TableCell>
            <TableCell align="right">Notebook</TableCell>
            <TableCell align="right">Date Modified</TableCell>
            <TableCell align="right">Add</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(notesPerPage > 0
            ? notes.slice(
                page * notesPerPage,
                page * notesPerPage + notesPerPage
              )
            : notes
          ).map((note) => (
            <TableRow key={note.id}>
              <TableCell component="th" scope="row">
                <Link
                  href={note.clientUrl ? note.clientUrl : note.webUrl}
                  underline="hover"
                >
                  {note.title}
                </Link>
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {note.parentSectionTitle}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {/* {note.notebook} */}
                Idk
              </TableCell>
              <TableCell style={{ width: 320 }} align="right">
                {note.lastModifiedDateTime}
              </TableCell>
              <TableCell align="right">
                <AddNoteButton
                  id={note.id}
                  notes={notes}
                  setNotes={setNotes}
                ></AddNoteButton>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={notes.length}
              rowsPerPage={notesPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

function AddNoteButton(props) {
  const handleAddButtonClick = useCallback(async () => {
    if (props.id) {
      props.setNotes(props.notes.filter((note) => note.id !== props.id));
      const result = await axios.get("/api/notes/setReviewStage", {
        params: { id: props.id, stage: 1 },
      });
      return result;
    }
  }, [props]);

  return (
    <IconButton variant="outlined" onClick={handleAddButtonClick}>
      <AddTaskIcon />
    </IconButton>
  );
}
