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
		FormControl,
		Select, 
		MenuItem,
		Toolbar, 
		} from "@mui/material";


const colunas = [
	{ field: "cod", headerName: "Código", width: 120 },
	{ field: "nome", headerName: "Nome", width: 280 },
	{ field: "base", headerName: "Base", width: 80 },
	{ field: "litragem", headerName: "Litragem", width: 80 },
	{ field: "fornecedor", headerName: "Fornecedor", width: 200 }
];

const defaultTheme = createTheme({
	palette: {
		background: {
			default: blue[50]
		}
	}
});

function Tinta(props) {

    const [COD, setCOD] = React.useState("");
    const [nome, setNome] = React.useState("");
    const [base, setBase] = React.useState("");
    const [litragem, setLitragem] = React.useState("");
	const [CNPJ, setCNPJ] = React.useState("");
	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");
	const [listaTinta, setListaTinta] = React.useState([]);

	React.useEffect(() => {
		getData();
	}, []);

	async function getData() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/tinta", {
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			setListaTinta(res.data);
			console.log(res.data);
		} catch (error) {
			setListaTinta([]);
		}
	}

	function clearForm() {
        setCOD("");
		setNome("");
        setBase("");
        setLitragem("");
		setCNPJ("");
	}

	function handleCancelClick() {
		if (COD !== "" || nome !== "" || base !== "" || litragem !== "" || CNPJ !== "") {
			setMessageText("Cadastro de tinta cancelado!");
			setMessageSeverity("warning");
			setOpenMessage(true);
		}
		clearForm();
	}

	async function handleSubmit() {
		console.log(`COD !== "" ${COD} - Nome: ${nome} - Base: ${base} - Litragem: ${litragem} - CNPJ: ${CNPJ}`);
		if (COD !== "" && nome !== "" && base !== "" && litragem !== "" && CNPJ !== "") {
			try {
				await axios.post("/tinta", {
                    COD: COD,
					nome: nome,
                    base: base,
                    litragem: litragem,
                    CNPJ: CNPJ
				});
				setMessageText("Tinta cadastrada com sucesso!");
				setMessageSeverity("success");
				clearForm(); // limpa o formulário apenas se cadastrado com sucesso
			} catch (error) {
				console.log(error);
				setMessageText("Falha no cadastro da tinta!");
				setMessageSeverity("error");
			} finally {
				setOpenMessage(true);
				await getData();
			}
		} else {
			setMessageText("Dados de tinta inválidos!");
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
							
						<Grid container spacing={2}>
							<Grid item xs={12} mx={8} mt={6}>
								<Paper 
									sx={{
										maxWidth: '100%'
										}}>
										

									<Grid 
										container 
										spacing={2} 
										sx={{mx: 2}}
										>
									
										<Grid item xs={11} sx={{mt: 2}}>
											<Titulo mensagem={"Cadastro de Tinta"} fontSize={"28px"}/>
										</Grid>

										<Grid item xs={4} spacing={2}>
										<Titulo mensagem={"Código"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="COD-input"
												size="small"
												onChange={(e) => setCOD(e.target.value)}
												value={COD}
											>
											</OutlinedInput>
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

										<Grid item xs={4} spacing={2} mb={2}>
										<Titulo mensagem={"Fornecedor"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="cnpj-input"
												size="small"
												onChange={(e) => setCNPJ(e.target.value)}
												value={CNPJ}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={2} mb={2}>
											<Titulo mensagem={"Base"} fontSize={"20px"}/>
											<FormControl 
												required 
												fullWidth 
												size="small">
												<Select
													id="base-input"
													onChange={(e) => setBase(e.target.value)}
													value={base}
												>
												<MenuItem value={'A'}>A</MenuItem>
												<MenuItem value={'B'}>B</MenuItem>
												<MenuItem value={'C'}>C</MenuItem>
												<MenuItem value={'P'}>P</MenuItem>
												<MenuItem value={'MF'}>MF</MenuItem>
												<MenuItem value={'T'}>T</MenuItem>
												</Select>
											</FormControl>
										</Grid>

										<Grid item xs={2} mb={2}>
										<Titulo mensagem={"Litragem"} fontSize={"20px"}/>
											<FormControl 
												required 
												fullWidth 
												size="small">
												<Select
													id="litragem-input"
													onChange={(e) => setLitragem(e.target.value)}
													value={litragem}
												>
												<MenuItem value={0.9}>900ml</MenuItem>
												<MenuItem value={3.6}>3.6l</MenuItem>
												<MenuItem value={18.0}>18l</MenuItem>
												</Select>
											</FormControl>
										</Grid>



										<Grid item xs={3} mt={2.8} mb={2}>
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

							<Grid item xs={12} mx={8} my={2} >
								<Paper sx={{maxWidth: '100%', mb: 2}} spacing={2}>

									<Grid container spacing={2} sx={{mx: 2}}>
									
									<Grid item xs={11}>
										<Titulo mensagem={"Tintas Cadastradas: "} fontSize={"28px"} />
									</Grid>

									<Grid item 
										spacing={2}
										xs = {11}
										sx = {{ height: '380px'}}
										mb={3}
										>
										{listaTinta.length > 0 && (
											<DataGrid 
												rows={listaTinta}
												columns={colunas}
												getRowId={(row) => row.cod}
												pageSizeOptions={5}
												initialState={{
													pagination:{
														paginationModel : {
															pageSize: 5
														},
													},
												}}
												disableRowSelectionOnClick
											/>
										)}
									</Grid>

									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Box>
				</Box>
		</ThemeProvider>
	);
}

export default Tinta;
