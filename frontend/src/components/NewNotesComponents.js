import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Typography from '@mui/material/Typography';

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
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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

function Note(noteTitle, tab, notebook, dateModified) {
    this.noteTitle = noteTitle;
    this.tab = tab;
    this.notebook = notebook;
    this.dateModified = dateModified;
}

const rows = [
    new Note('Cupcake', 305,1, 3.7),
    new Note('Donut', 452,1, 25.0),
    new Note('Eclair', 262,1, 16.0),
    new Note('Frozen yoghurt', 159,1, 6.0),
    new Note('Gingerbread', 356,1, 16.0),
    new Note('Honeycomb', 408,1, 3.2),
    new Note('Ice cream sandwich', 237,1, 9.0),
    new Note('Jelly Bean', 375,1, 0.0),
    new Note('KitKat', 518,1, 26.0),
    new Note('Lollipop', 392,1, 0.2),
    new Note('Marshmallow', 318,1, 0),
    new Note('Nougat', 360,1, 19.0),
    new Note('Oreo', 437,1,  18.0),
    new Note('1', 392,1, 0.2),
    new Note('2', 318,1, 0),
    new Note('3', 360,1, 19.0),
    new Note('4', 437,1, 18.0),
    new Note('5', 392,1, 0.2),
    new Note('6', 318,1, 0),
    new Note('7', 360,1, 19.0),
    new Note('8', 437,1, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

export default function NewNotesComp() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
                        <TableCell>
                            Note Title
                        </TableCell>
                        <TableCell align="right">
                            Tab
                        </TableCell>
                        <TableCell align="right">
                            Notebook
                        </TableCell>
                        <TableCell align="right">
                            Date Modified
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <TableRow key={row.noteTitle}>
                            <TableCell component="th" scope="row">
                                {row.noteTitle}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {row.tab}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {row.notebook}
                            </TableCell>
                            <TableCell style={{ width: 160 }} align="right">
                                {row.dateModified}
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
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
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