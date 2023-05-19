import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography';
import React from 'react';
import './custom.css';
import QuickAccessComp from './components/QuickAccessComp'
import Nav from './components/Nav'
import { Style } from "../../node_modules/@material-ui/icons/index";

import './App.css'
import NewNotesComp from "./components/NewNotesComponents";
import TaskCards from "./components/TaskCards";

const theme = createTheme({
    palette: {
        primary: {
            light: '#9C51E0',
            main: '#7719AA',
            dark: '#9332BF'
        },
        secondary: {
            main:'#191838',
        },
        warning: {
            main: '#ECC488',
        },
    }
});

const testingStyle = {
    '&:hover': {
        backgroundColor: 'primary.main',
        opacity: [0.9,0.8,0.7],
    }
}

export default function App() {

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex", flexFlow: 'column wrap' }}>
                <Nav />
                <Container maxWidth="xl">
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item xs={12} md={8}>
                            <Paper className='contentPaper' sx={{ ...testingStyle, mb: 3 }} elevation={3}>
                                <QuickAccessComp/>
                            </Paper>
                              
                            <Paper className='contentPaper' sx={{ ...testingStyle }} elevation={3}>
                                <NewNotesComp/>
                            </Paper>
                        </Grid>
                        <Grid item xs>
                            <Paper className="contentPaper" sx={{ ...testingStyle, height: '100%' }} elevation={3}>
                                <Typography variant="h4" gutterBottom>
                                    Today's Tasks
                                </Typography>
                                <TaskCards/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
