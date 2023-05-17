import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'

import React from 'react';
import './custom.css';
import GoogleLogo from './images/Google_logo.png'
import Nav from './components/Nav'
import { Style } from "../../node_modules/@material-ui/icons/index";

import './App.css'

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
            <Box sx={{ display: "flex", flexDirection: "column", height:"100vh"}}>
                <Nav />
                <Box sx={{ height: '10px' }}></Box>
                <Container sx={{ height: "100%" }} maxWidth="xxl">
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item container spacing={2} xs={12} md={8} sx={{ flexDirection: 'column' }}>
                            <Grid item sx={{ flex: '7', padding:"10px" }}>
                                <Paper className='contentPaper' sx={{ ...testingStyle, height: "100%" }} elevation={3}>
                                    SearchingBarComponent
                                </Paper>
                            </Grid>
                            <Grid item sx={{ flex: '3', padding: "10px" }}>
                                <Paper className='contentPaper' sx={{ ...testingStyle, height: "100%" }} elevation={3}>
                                    NewNotesComponent
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item xs container spacing={2} sx={{ display: "flex", flexDirection: "column" }}>
                            <Grid item sx={{ flex: 1 }}>
                                <Paper className="contentPaper" sx={{ ...testingStyle, height: '100%' }} elevation={3}>
                                    Tasking area
                                </Paper>
                            </Grid>
                            <Grid item >
                                <Paper className="contentPaper" sx={{ ...testingStyle, height: '600px' }} elevation={3}>
                                    Calendar View
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
