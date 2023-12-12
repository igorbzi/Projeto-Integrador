import React from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { blue } from "@mui/material/colors";
import Titulo from "../Titulo"
import Navbar from "../Navbar";
//import { IMaskInput } from "react-imask";

import { 
		Alert, 
		Button, 
		Box,
		Grid,
		Snackbar, 
		Stack, 
		OutlinedInput, 
		createTheme, 
		CssBaseline, 
		ThemeProvider, 
		Paper, 
		Toolbar, 
		} from "@mui/material";
import Tabela from "../Tabela";


const colunas = [
	{ field: "id", headerName: "CPF", width: 125 },
	{ field: "nome", headerName: "Nome", width: 245 },
	{ field: "email", headerName: "Email", width: 250 },
	{ field: "telefone1", headerName: "Telefone 1", width: 120 },
	{ field: "telefone2", headerName: "Telefone 2", width: 120 },
	{ field: "ender", headerName: "Endereço", width: 380 },
	
];

const defaultTheme = createTheme({
	palette: {
		background: {
			default: blue[50]
		}
	}
});

function Cliente(props) {

	const [CPFC, setCPFC] = React.useState("");
	const [nome, setNome] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [ender, setEnder] = React.useState("");
	const [telefone1, setTel1] = React.useState("");
	const [telefone2, setTel2] = React.useState("");
	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");
	const [listaClientes, setListaClientes] = React.useState([]);

	React.useEffect(() => {
		getData();
	}, []);

	async function getData() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/cliente", {
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			setListaClientes(res.data);
			console.log(res.data);
		} catch (error) {
			setListaClientes([]);
		}
	}

	function clearForm() {
		setNome("");
		setEmail("");
		setCPFC("");
		setEnder("");
		setTel1("");
		setTel2("");
	}

	function handleCancelClick() {
		if (CPFC !== "" || nome !== "" || email !== "" || ender !== "" || telefone1 !== "") {
			setMessageText("Cadastro de cliente cancelado!");
			setMessageSeverity("warning");
			setOpenMessage(true);
		}
		clearForm();
	}

	async function handleSubmit() {
		console.log(`CPF: ${CPFC} - Nome: ${nome} - Email: ${email} - Endereço: ${ender} - Telefone1: ${telefone1}`);
		if (CPFC !== "" && nome !== "" && email !== "" && ender !== "" && telefone1 !== "") {
			try {
				await axios.post("/cliente", {
					CPFC: CPFC,
					nome: nome,
					email: email,
					ender: ender,
					telefone1: telefone1,
					telefone2: telefone2
				});
				setMessageText("Cliente cadastrado com sucesso!");
				setMessageSeverity("success");
				clearForm(); // limpa o formulário apenas se cadastrado com sucesso
			} catch (error) {
				console.log(error);
				setMessageText("Falha no cadastro do cliente!");
				setMessageSeverity("error");
			} finally {
				setOpenMessage(true);
				await getData();
			}
		} else {
			setMessageText("Dados de cliente inválidos!");
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
				<Box sx={{ display: 'flex' }}>

					<Navbar onLogout={props.onLogout}/>

					<Box             
						component="main"
						mt={2}
						sx={{
							flexGrow: 1,
							height: '100vh',
							overflow: 'auto',
							display: 'flex',
							flexDirection: 'column'
						}}
						spacing={2}
						>

						<Toolbar/>
							
						<Grid container spacing={3}>
							<Grid item xs={12} mx={8} mt={6}>
								<Paper 
									sx={{
										maxWidth: '100%'
										}}>
										

									<Grid 
										container 
										spacing={2} 
										sx={{mx: 2}}>
									
										<Grid item xs={11} sx={{mt: 2}}>
											<Titulo mensagem={"Cadastro de Clientes"} fontSize={"28px"}/>
										</Grid>

										<Grid item xs={7}>
										<Titulo mensagem={"Nome"} fontSize={"20px"}/>
											<OutlinedInput
												required
												fullWidth
												id="nome-input"
												size="small"
												onChange={(e) => setNome(e.target.value)}
												value={nome}
											/>
										</Grid>

										<Grid item xs={4} spacing={2}>
										<Titulo mensagem={"CPF"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="cpfc-input"
												size="small"
												onChange={(e) => setCPFC(e.target.value)}
												value={CPFC}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={7}>
											<Titulo mensagem={"Email"} fontSize={"20px"}/>
											<OutlinedInput
												required
												fullWidth
												id="email-input"
												size="small"
												onChange={(e) => setEmail(e.target.value)}
												value={email}
											/>
										</Grid>

										<Grid item xs={4} spacing={2}>
										<Titulo mensagem={"Telefone1"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="tel1-input"
												size="small"
												onChange={(e) => setTel1(e.target.value)}
												value={telefone1}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={7}>
											<Titulo mensagem={"Endereço"} fontSize={"20px"}/>
											<OutlinedInput
												required
												fullWidth
												id="ender-input"
												size="small"
												onChange={(e) => setEnder(e.target.value)}
												value={ender}
											/>
										</Grid>

										<Grid item xs={4} spacing={2}>
										<Titulo mensagem={"Telefone2"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="tel2-input"
												size="small"
												onChange={(e) => setTel2(e.target.value)}
												value={telefone2}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={11} mt={0.5} mb={2}> 
											<Stack 
												direction="row" 
												spacing={2} 
												justifyContent={'right'}
												>

												<Button
													variant="contained"
													style={{
														maxWidth: "100px",
														minWidth: "100px",
														maxHeight: "40px"
													}}
													onClick={handleSubmit}
													type="submit"
													color="primary"
													height={'28px'}
													size={"large"}
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

							<Grid item xs={12} mx={8} mt={2}>
								<Paper sx={{maxWidth: '100%', mb: 2}} spacing={2}>

									<Grid container spacing={2} sx={{mx: 2}}>
									
									<Grid item xs={11}>
										<Titulo mensagem={"Clientes Cadastrados: "} fontSize={"28px"} />
									</Grid>

									<Tabela
									lista={listaClientes} 
									colunas={colunas}
									qtd={5}
									selecao={false}
									height={'380px'}/>

									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Box>
				</Box>
		</ThemeProvider>
	);
}

export default Cliente;
