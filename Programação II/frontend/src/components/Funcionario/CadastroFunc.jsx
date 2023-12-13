import React from "react";
import axios from "axios";
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
		FormControl,
		Select, 
		MenuItem,
		Toolbar, 
		} from "@mui/material";
import Tabela from "../Tabela";


const colunas = [
	{ field: "id", headerName: "CPF", width: 100 },
	{ field: "nome", headerName: "Nome", width: 280 },
	{ field: "email", headerName: "Email", width: 180 },
];


const defaultTheme = createTheme({
	palette: {
		background: {
			default: blue[50]
		}
	}
});

function CadastroFuncionario(props) {

	const [CPFF, setCPFF] = React.useState("");
	const [nome, setNome] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [senha, setSenha] = React.useState("");
	const [tipo, setTipo] = React.useState("");
	const [confirmacao, setConfirmacao] = React.useState("")
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
		setConfirmacao("")
	}

	function handleCancelClick() {
		if (CPFF !== "" || nome !== "" || email !== "" || senha !== "" || confirmacao !== "" || tipo !== "") {
			setMessageText("Cadastro de funcionário cancelado!");
			setMessageSeverity("warning");
			setOpenMessage(true);
		}
		clearForm();
	}

	async function handleSubmit() {
		console.log(`CPF: ${CPFF} - Nome: ${nome} - Email: ${email} - Tipo: ${tipo}`);
		if (CPFF !== "" && nome !== "" && email !== "" && senha !== "" && confirmacao !== "" && tipo !== "") {
			try {
				const token = localStorage.getItem("token");
				const cpfExists = await axios.get(`/funcionario_id?funcionario=${CPFF}`, {
					headers: {
					Authorization: `bearer ${token}`,
					},
				});

				// Verificar se o e-mail já existe no banco
				const emailExists = await axios.get(`/funcionario_email?funcionario=${email}`, {
					headers: {
					Authorization: `bearer ${token}`,
					},
				});
		
				if (cpfExists.data.length > 0) {
					setMessageText("CPF já cadastrado. Por favor, tente novamente.");
					setMessageSeverity("warning");
					setOpenMessage(true);
					return;
				}

				if (emailExists.data.length > 0) {
					setMessageText("Email já cadastrado. Por favor, tente novamente.");
					setMessageSeverity("warning");
					setOpenMessage(true);
					return;
				}
				if(senha===confirmacao){
					await axios.post("/funcionario", {
						CPFF: CPFF,
						nome: nome,
						email: email,
						passwd: senha,
						type: tipo
					},{
					headers: {
						Authorization: `bearer ${token}`,
					}
					}
					);
					setMessageText("Funcionário cadastrado com sucesso!");
					setMessageSeverity("success");
					clearForm(); // limpa o formulário apenas se cadastrado com sucesso
				} else {
					setMessageText("Confirmação de senha incorreta!");
					setMessageSeverity("warning");
					setOpenMessage(true);
					setConfirmacao("");
				} 
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
											<Titulo mensagem={"Cadastro de Funcionários"} fontSize={"28px"}/>
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
												id="cpf-input"
												size="small"
												onChange={(e) => setCPFF(e.target.value)}
												value={CPFF}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={4}>
											<Titulo mensagem={"Tipo"} fontSize={"20px"}/>
											<FormControl required fullWidth size="small">
												<Select
													id="tipo"
													onChange={(e) => setTipo(e.target.value)}
													value={tipo}
												>
												<MenuItem value={1}>Administrador</MenuItem>
												<MenuItem value={2}>Funcionário</MenuItem>
												</Select>
											</FormControl>
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

										<Grid item xs={4} sx={{mb:3}}>
											<Titulo mensagem={"Senha"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												id="senha-input"
												size="small"
												type="password"
												onChange={(e) => setSenha(e.target.value)}
												value={senha}
											/>
										</Grid>

										<Grid item xs={4} sx={{mb: 3}}>
											<Titulo mensagem={"Confirmação de Senha"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												id="confirmar-input"
												size="small"
												type="password"
												onChange={(e) => setConfirmacao(e.target.value)}
												value={confirmacao}
											/>
										</Grid>

										<Grid item xs={3} mt={2.8}>
											<Stack 
												direction="row" 
												spacing={3} 
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
										<Titulo mensagem={"Funcionários Cadastrados: "} fontSize={"28px"} />
									</Grid>

									<Tabela
									lista={listaFuncionarios} 
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

export default CadastroFuncionario;
