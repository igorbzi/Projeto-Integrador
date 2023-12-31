import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { logout, funcionario, inicio, cadastroFuncionario, consultaFuncionario, cadastroCliente, cadastroFornecedor, cadastroTinta, cadastroVenda } from './dashboard/listItems';


import {
    styled,
    Typography,
    Toolbar,
    IconButton,
    List,
    Divider,
    ListItemText
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
        }),
        }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
        },
    }),
);


function Navbar(props) {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    return (
        <>
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                        }}
                    >
                    <MenuIcon />
                    </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                        Tela Inicial
                        </Typography>
                        
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>

                <Divider />


                <List component="nav">

                    <div 
                        variant="link"
                        onClick={() => {
                            navigate("/")
                        }}
                    >
                        {inicio}
                    </div>

                    <Divider />
                    <div
                        variant="link"
                        onClick={() => {
                            navigate("/cadastro_funcionarios")
                        }}
                    >
                        {cadastroFuncionario}
                    </div>
                    
                    <div
                        variant="link"
                        onClick={() => {
                            navigate("/consulta_funcionarios")
                        }}
                        >
                        {consultaFuncionario}
                    </div>

                    <Divider />
                    <div   
                        variant="link"
                        onClick={() => 
                            navigate("/cadastro_clientes")}
                    >
                        {cadastroCliente}
                    </div>


                    <Divider />
                    <div 
                        variant="link" 
                        onClick={() => 
                            navigate("/cadastro_fornecedores")}
                    >
                        {cadastroFornecedor} 
                    </div>

                    <Divider />
                    <div 
                        variant="link" 
                        onClick={() => 
                            navigate("/cadastro_tintas")}
                    >
                        {cadastroTinta}
                    </div>

                    <Divider />
                    <div variant="link" onClick={() => 
                            navigate("/cadastro_vendas")
                    }
                    >
                        {cadastroVenda}
                    </div>

                    <Divider />

                    <div onClick={props.onLogout}>{logout}</div>
                </List>

            </Drawer>
        </>
    );
}

export default Navbar