import React from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { blue } from "@mui/material/colors";
import Titulo from "./Titulo"
//import { IMaskInput } from "react-imask";

import { 
		Alert, 
		Button, 
		Grid, 
		Snackbar, 
		Stack, 
		TextField, 
		createTheme, 
		CssBaseline, 
		ThemeProvider, 
		Paper, 
		FormControl, 
		InputLabel, 
		Select, 
		MenuItem, 
		} from "@mui/material";


const colunas = [
	{ field: "cpff", headerName: "CPF", width: 100 },
	{ field: "nome", headerName: "Nome", width: 180 },
	{ field: "email", headerName: "Email", width: 180 },
];

const defaultTheme = createTheme({
	palette: {
		background: {
			default: blue[50]
		}
	}
});

function Funcionario() {

	const [CPFF, setCPFF] = React.useState("");
	const [nome, setNome] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [senha, setSenha] = React.useState("");
	const [tipo, setTipo] = React.useState("");
	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");
	const [listaFuncionarios, setListaFuncionarios] = React.useState([]);

	React.useEffect(() => {
		getData();
	}, []);

	async function getData() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/funcionario", {
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			setListaFuncionarios(res.data);
			console.log(res.data);
		} catch (error) {
			setListaFuncionarios([]);
		}
	}

	function clearForm() {
		setNome("");
		setEmail("");
		setCPFF("");
		setSenha("");
		setTipo("");
	}

	function handleCancelClick() {
		if (nome !== "" || email !== "") {
			setMessageText("Cadastro de funcionário cancelado!");
			setMessageSeverity("warning");
			setOpenMessage(true);
		}
		clearForm();
	}

	async function handleSubmit() {
		console.log(`CPF: ${CPFF} - Nome: ${nome} - Email: ${email} - Tipo: ${tipo}`);
		if (CPFF !== "" && nome !== "" && email !== "" && senha !== "" && tipo !== "") {
			try {
				await axios.post("/novoUsuario", {
					CPFF: CPFF,
					nome: nome,
					email: email,
					passwd: senha,
					type: tipo
				});
				setMessageText("Funcionário cadastrado com sucesso!");
				setMessageSeverity("success");
				clearForm(); // limpa o formulário apenas se cadastrado com sucesso
			} catch (error) {
				console.log(error);
				setMessageText("Falha no cadastro do funcionário!");
				setMessageSeverity("error");
			} finally {
				setOpenMessage(true);
				await getData();
			}
		} else {
			setMessageText("Dados de funcionário inválidos!");
			setMessageSeverity("warning");
			setOpenMessage(true);
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
			<CssBaseline />		
				<Stack 
					fullWidth
					spacing={2}
					style={{
						height: '500px'
					}}
					sx={{
						p:2,
						m:2,
					}}>
						
					<Paper 
						spacing={2} 
						sx={{
							m: 4, 
							maxWidth: '60%'
							}}>
							

						<Grid 
							container 
							spacing={2} 
							sx={{m: 2}}>
						
							<Grid item xs={11}>
								<Titulo mensagem={"Cadastro de Funcionários"}/>
							</Grid>

							<Grid item xs={4}>
								<TextField
									fullWidth
									required
									type=""
									id="cpf-input"
									label="CPF"
									size="small"
									onChange={(e) => setCPFF(e.target.value)}
									value={CPFF}
									
								>
									{/* <IMaskInput 
									mask="#00.000.000-00" 
									maskChar=""
									definitions={{
										'#': /[1-9]/
									}}/> */}
								</TextField>
							</Grid>

							<Grid item xs={7}>
								<TextField
									required
									fullWidth
									id="nome-input"
									label="Nome"
									size="small"
									onChange={(e) => setNome(e.target.value)}
									value={nome}
								/>
							</Grid>

							<Grid item xs={11}>
								<TextField
									required
									fullWidth
									id="email-input"
									label="E-mail"
									size="small"
									onChange={(e) => setEmail(e.target.value)}
									value={email}
								/>
							</Grid>

							<Grid item xs={5}>
								<FormControl required fullWidth size="small">
								<InputLabel>Tipo</InputLabel>
									<Select
										id="tipo"
										label="tipo-input"
										onChange={(e) => setTipo(e.target.value)}
										value={tipo}
									>
									<MenuItem value={1}>Administrador</MenuItem>
									<MenuItem value={2}>Funcionário</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={6}>
								<TextField
									sx={{
										flexDirection: "column"
									}}
									fullWidth
									required
									id="senha-input"
									label="Senha"
									size="small"
									type="password"
									onChange={(e) => setSenha(e.target.value)}
									value={senha}
								/>
							</Grid>

							<Grid item xs={11}>
								<Stack 
									direction="row" 
									spacing={3} 
									justifyContent={'right'}>

									<Button
										variant="contained"
										style={{
											maxWidth: "100px",
											minWidth: "100px",
										}}
										onClick={handleSubmit}
										type="submit"
										color="primary"
									>
										Enviar
									</Button>
									<Button
										variant="contained"
										style={{
											maxWidth: "100px",
											minWidth: "100px",
										}}
										onClick={handleCancelClick}
										color="error"
									>
										Cancelar
									</Button>
								</Stack>
							</Grid>
						</Grid>
					</Paper>
								
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

					<Paper sx={{maxWidth: '100%'}}>
						<Grid container>
							<Grid item
								fullWidth
								xs = {12}
								style={{ height: "500px" }}
								sx = {{m: 2}}>
								{listaFuncionarios.length > 0 && (
									<DataGrid 
										rows={listaFuncionarios}
										columns={colunas}
										getRowId={(row) => row.cpff}
									/>
								)}
							</Grid>
						</Grid>
					</Paper>


				</Stack>
		</ThemeProvider>
	);
}

export default Funcionario;
