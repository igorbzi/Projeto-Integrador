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


const colunas = [
	{ field: "cod", headerName: "Código", width: 120 },
	{ field: "nome", headerName: "Produto", width: 300 },
	{ field: "base", headerName: "Base", width: 80 },
	{ field: "litragem", headerName: "Litragem", width: 80 },
	{ field: "quantidade", headerName: "Quantidade", width: 100 }
];

const defaultTheme = createTheme({
	palette: {
		background: {
			default: blue[50]
		}
	}
});

function Venda(props) {

    const [ID, setID] = React.useState("");
    const [CPFF, setCPFF] = React.useState("");
    const [CPFC, setCPFC] = React.useState("");
    const [Data, setData] = React.useState("");
	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");
	const [listaVenda, setListaVenda] = React.useState([]);
	const [openSelecaoFunc, setOpenSelecaoFunc] = React.useState(false);

	React.useEffect(() => {
		getData();
	}, []);

	React.useEffect(() => {
		const hoje = new Date();
		const dia = hoje.getDate().toString().padStart(2,'0')
		const mes = String(hoje.getMonth() + 1).padStart(2,'0')
		const ano = hoje.getFullYear()
		const dataAtual = `${dia}/${mes}/${ano}`
		setData(dataAtual)
	}, [])

	React.useEffect(() => {
		getID();
	}, [])

	async function getData() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/venda", {
				headers: {
					Authorization: `bearer ${token}`,
				},
			});
			setListaVenda(res.data);
			console.log(res.data);
		} catch (error) {
			setListaVenda([]);
		}
	}

	async function getID() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/id_venda", {
				headers: {
					Authorization: `bearer ${token}`,
				}
			});
			setID(parseInt(res.data[0].id) +1);
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	}

	function clearForm() {
        setID("");
		setCPFF("");
        setCPFC("");
        setData("");
	}

	function handleCancelClick() {
		if (ID !== "" || CPFF !== "" || CPFC !== "" || Data !== "") {
			setMessageText("Cadastro de venda cancelado!");
			setMessageSeverity("warning");
			setOpenMessage(true);
		}
		clearForm();
	}

	async function handleSubmit() {
		console.log(`ID !== "" ${ID} - CPFF: ${CPFF} - CPFC: ${CPFC} - Data: ${Data}`);
		if (ID !== "" && CPFF !== "" && CPFC !== "" && Data !== "") {
			try {
				await axios.post("/venda", {
                    ID: ID,
					CPFF: CPFF,
                    CPFC: CPFC,
                    Data: Data
				});
				setMessageText("Venda cadastrada com sucesso!");
				setMessageSeverity("success");
				clearForm(); // limpa o formulário apenas se cadastrado com sucesso
			} catch (error) {
				console.log(error);
				setMessageText("Falha no cadastro da venda!");
				setMessageSeverity("error");
			} finally {
				setOpenMessage(true);
				await getData();
			}
		} else {
			setMessageText("Dados de venda inválidos!");
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
									
										<Grid item xs={12} sx={{mt: 2}}>
											<Titulo mensagem={"Cadastro de Venda"} fontSize={"30px"}/>
										</Grid>

										<Grid item xs={1}>
										<Titulo mensagem={"ID"} fontSize={"20px"}/>
											<OutlinedInput
												required
												fullWidth
												id="id-input"
												size="small"
												onChange={(e) => setID(e.target.value)}
												value={ID}
												inputProps={{
													readOnly: true,
												}}
											/>
										</Grid>

										<Grid item xs={4} spacing={2}>
										<Titulo mensagem={"Data"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="data-input"
												size="small"
												onChange={(e) => setData(e.target.value)}
												value={Data}
												inputProps={{
													readOnly: true,
												}}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={8} spacing={2}>
										<Titulo mensagem={"Vendedor"} fontSize={"20px"}/>
											<OutlinedInput
												fullWidth
												required
												variant="outlined"
												id="cpff-input"
												size="small"
												onChange={(e) => setCPFF(e.target.value)}
												value={CPFF}
												inputProps={{
													readOnly: true,
												}}
											>
											</OutlinedInput>
										</Grid>

										<Grid item xs={3} spacing={2} mt={2.8}>
											<Button
												variant="contained"
												style={{
													maxWidth: "120px",
													minWidth: "120px",
													maxHeight: "40px"
												}}
												//onClick={}
												type="submit"
												color="primary"
												height={'28px'}
												size={"large"}>
												Selecionar
											</Button>
										</Grid>

										<Grid item xs={8}>
											<Titulo mensagem={"Cliente"} fontSize={"20px"}/>
											<OutlinedInput
												required
												fullWidth
												id="cpfc-input"
												size="small"
												onChange={(e) => setCPFC(e.target.value)}
												value={CPFC}
												inputProps={{
													readOnly: true,
												}}
											/>
										</Grid>

										
										<Grid item xs={3} spacing={2} mt={2.8}>
											<Button
												variant="contained"
												style={{
													maxWidth: "120px",
													minWidth: "120px",
													maxHeight: "40px"
												}}
												//onClick={}
												type="submit"
												color="primary"
												height={'28px'}
												size={"large"}>
												Selecionar
											</Button>
										</Grid>

										<Grid item xs={8}>
											<Titulo mensagem={"Produtos"} fontSize={"28px"} />
										</Grid>

										<Grid item 
											spacing={2}
											xs = {11}
											sx = {{ height: '380px'}}
											>
											
												<DataGrid 
													rows={listaVenda}
													columns={colunas}
													getRowId={(row) => row.cnpj}
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
											
										</Grid>

										<Grid item xs={2} spacing={2} mt={2}>
											<Button
												variant="contained"
												style={{
													maxWidth: "200px",
													minWidth: "200px",
													maxHeight: "40px"
												}}
												onClick={() =>
												{}}
												type="submit"
												color="primary"
												height={'28px'}
												size={"large"}>
												Selecionar Itens
											</Button>
										</Grid>

										<Grid item xs={2} spacing={2} mt={2}>
											<Button
												variant="contained"
												style={{
													maxWidth: "200px",
													minWidth: "200px",
													maxHeight: "40px"
												}}
												onClick={() =>
													{}}
												type="submit"
												color="primary"
												height={'28px'}
												size={"large"}>
												Excluir Item
											</Button>
										</Grid>

										<Grid item xs={7} mt={1.8} mb={2}>
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
														color="success"
														height={'28px'}
														size={"large"}
													>
														Concluir
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

						</Grid>
					</Box>
				</Box>
		</ThemeProvider>
	);
}

export default Venda;
