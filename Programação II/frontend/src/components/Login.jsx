import React from "react";
import axios from "axios";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
	Alert,
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

const defaultTheme = createTheme();

export default function Login(props) {
	const [username, setUsername] = React.useState("");
	const [passwd, setPasswd] = React.useState("");
	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

	async function enviaLogin(event) {
		event.preventDefault();
		try {
			const response = await axios.post("/login", {
				username: username,
				password: passwd,
			});
			console.log(response);
			if (response.status >= 200 && response.status < 300) {
				// Salva o token JWT na sessão
				localStorage.setItem("token", response.data.token);
				// seta o estado do login caso tudo deu certo
				props.onLogin();
			} else {
				// falha
				console.error("Falha na autenticação");
			}
		} catch (error) {
			console.log(error);
			setOpenMessage(true);
			setMessageText("Falha ao logar usuário!");
			setMessageSeverity("error");
		}
	}

	function handleCloseMessage(_, reason) {
		if (reason === "clickaway") {
			return;
		}
		setOpenMessage(false);
	}

	return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Entrar
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="CPF"
                        label="CPF"
                        name="CPF"
                        autoComplete="CPF"
                        autoFocus
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="senha"
                        label="Senha"
                        type="password"
                        id="senha"
                        autoComplete="current-password"
                        value={passwd}
                        onChange={(event) => {
                            setPasswd(event.target.value);
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Lembrar Usuário"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={enviaLogin}
                    >
                        Entrar
                    </Button>

                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Esqueceu a senha?
                            </Link>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
				<Snackbar
					open={openMessage}
					autoHideDuration={6000}
					onClose={handleCloseMessage}
				>
					<Alert
						severity={messageSeverity}
						onClose={handleCloseMessage}
					>
						{messageText}
					</Alert>
				</Snackbar>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            );
}

// Login.propTypes = {
// 	setToken: PropTypes.func.isRequired,
// };
