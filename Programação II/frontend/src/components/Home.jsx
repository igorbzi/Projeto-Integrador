import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Chart from './dashboard/Chart';
import Deposits from './dashboard/Deposits';
import Orders from './dashboard/Orders';

import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Toolbar,
    Paper
} from "@mui/material";
import Navbar from './Navbar';

const defaultTheme = createTheme({
    palette: {
        background: {
        default: "#90caf9"
    }
}});


export default function Home(props) {

    return ( 
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
            <CssBaseline />

                <Navbar onLogout={props.onLogout}/>

                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[300]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >

                    <Toolbar />

                    <Container>
                        <Grid container spacing={3} mt={2}>

                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240,
                                }}>
                                    <Chart />
                                </Paper>
                            </Grid>

                            {/* Recent Deposits */}
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240
                                }}>
                                    <Deposits />
                                </Paper>
                            </Grid>

                            {/* Recent Orders */}
                            <Grid item xs={12}>
                                <Paper 
                                sx={{ 
                                    p: 2, 
                                    display: 'flex', 
                                    flexDirection: 'column' 
                                    }}>
                                    <Orders />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>

                </Box>
            </Box>
        </ThemeProvider>
    );
}
