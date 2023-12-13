import React from "react";
import axios from "axios";
import { blue } from "@mui/material/colors";
import Titulo from "../Titulo"
import Navbar from "../Navbar";
//import { IMaskInput } from "react-imask";
import SelecaoFunc from "../Selecao/SelecaoFunc";
import SelecaoCliente from "../Selecao/SelecaoCliente";
import SelecaoProduto from "../Selecao/SelecaoProduto";

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
	{ field: "id", headerName: "Código", width: 120 },
	{ field: "nome", headerName: "Produto", width: 300 },
	{ field: "base", headerName: "Base", width: 80 },
	{ field: "litragem", headerName: "Litragem", width: 80 },
	{ field: "qtd", headerName: "Quantidade", width: 100 }
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
	const [vendedor, setVendedor] = React.useState("");
	const [cliente, setCliente] = React.useState("");
	const [cod, setCod] = React.useState("");
	
	const [listaTintas, setListaTinta] = React.useState([]);
	const [lastItem, setLastItem] = React.useState(0);
	const [flag, setFlag] = React.useState(false);

    const [Data, setData] = React.useState("");

	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");
	const [openSelecaoFunc, setOpenSelecaoFunc] = React.useState(false);
	const [openSelecaoCliente, setOpenSelecaoCliente] = React.useState(false);
	const [openSelecaoTinta, setOpenSelecaoTinta] = React.useState(false);


	React.useEffect(() => {
		const hoje = new Date();
		const dia = hoje.getDate().toString().padStart(2,'0')
		const mes = String(hoje.getMonth() + 1).padStart(2,'0')
		const ano = hoje.getFullYear()
		const dataAtual = `${dia}/${mes}/${ano}`
		setData(dataAtual)
		getID()
	}, []);

	React.useEffect(() =>
		{getID()}, [flag]
	)

	React.useEffect(() => {
		getItensVenda()
	}, [lastItem, ID])

	async function getItensVenda() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/itens_venda", {
				headers: {
					Authorization: `bearer ${token}`,
				},
				params: {
					id: ID
				}
			});
			setListaTinta(res.data)
			console.log(res.data);
		} catch (error) {
			console.log(error);
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
			if(flag){
				setID(parseInt(res.data[0].id));
			} else {
				setID(parseInt(res.data[0].id) +1);
			}
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	}

	function clearForm() {
		setFlag(false);
		getID();
		setVendedor("");
        setCliente("");
	}

	async function handleSubmit() {
		console.log(`ID ${ID} - CPFF: ${vendedor} - CPFC: ${cliente} - Data: ${Data}`);
		if (ID !== "" && vendedor !== "" && cliente !== "" && Data !== "") {
			if(lastItem === 0){
				try {
				const token = localStorage.getItem("token");
				await axios.post("/venda", {
					ID: ID,
					CPFF: parseInt(vendedor),
                    CPFC: parseInt(cliente),
                    data: Data,
					status: "Aberta"
				}, {
				headers: {
					Authorization: `bearer ${token}`,
				}
				}
			);
			} catch (error) {
				console.log(error);
				setMessageText("Falha ao abrir venda!");
				setMessageSeverity("error");
				setOpenMessage(true);
				setFlag(true);
			}}
		} else {
			setMessageText("Dados de venda inválidos!");
			setMessageSeverity("warning");
			setOpenMessage(true);
		}
	}

	async function fechaVenda(){
		if(listaTintas.length > 0){
			try{
				const token = localStorage.getItem("token");
				await axios.put("/venda", {
					ID: ID,
					status: "Fechada"
				}, {
					headers: {
						Authorization: `bearer ${token}`,
					}
				}
				);
				setMessageText("Venda fechada com sucesso!")
				setMessageSeverity("success")
				setLastItem(0);
				clearForm();
			} catch (error) {
				console.log(error);
				setMessageText("Falha ao fechar venda!");
				setMessageSeverity("error");
			} finally {
				setOpenMessage(true)
			}
		} else {
			setMessageText("Não é possível fechar uma venda sem itens!");
			setMessageSeverity("error");
			setOpenMessage(true);
		}
	}

	async function cancelaVenda(){
		try{
			const token = localStorage.getItem("token");
			await axios.put("/venda", {
				ID: ID,
				status: "Cancelada"
			}, {
				headers: {
					Authorization: `bearer ${token}`,
				}
			}
			);
			setMessageText("Venda cancelada com sucesso!");
			setMessageSeverity("success");
			setLastItem(0);
			clearForm();
		} catch (error) {
			console.log(error);
			setMessageText("Falha ao cancelar venda!");
			setMessageSeverity("error");
		} finally {
			setOpenMessage(true)
		}
	}

	function handleCloseMessage(_, reason) {
		if (reason === "clickaway") {
			return;
		}
		setOpenMessage(false);
	}

	function adicionarItem(){
		if(vendedor !== "" && cliente !== ""){
			if(listaTintas.length === 0){
				handleSubmit()
			}
			setOpenSelecaoTinta(true);
		} else {
			if(vendedor === ""){
				setMessageText("Insira o funcionário!");
				setMessageSeverity("error");
				setOpenMessage(true)
			} else if(cliente === "") {
				setMessageText("Insira o cliente!");
				setMessageSeverity("error");
				setOpenMessage(true)
			}
		}
	}

	async function excluirItem(){
		if(listaTintas.length > 0){
			try{
				console.log(`Item Removido - ID: ${ID} - COD:${cod}`);
				const token = localStorage.getItem("token");
				await axios.delete("/itens_venda", {
					headers: {
						Authorization: `bearer ${token}`,
					},
					data: {
						ID: ID,
						cod: cod
					}
				}
				);
				setLastItem(lastItem+1);
				setMessageText("Item excluído com sucesso!");
				setMessageSeverity("success");
				setOpenMessage(true);
			} catch (error) {
				console.log(error)
				setMessageText("Não foi possível excluir o item!");
				setMessageSeverity("error");
				setOpenMessage(true);
			}
		} else {
			setMessageText("Não há itens na venda!");
			setMessageSeverity("error");
			setOpenMessage(true)
		}
	}

	return (

		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />	
				
				<SelecaoFunc 
					isOpen={openSelecaoFunc} 
					setOpenSelecaoFunc={() => setOpenSelecaoFunc(!openSelecaoFunc)} 
					setVendedor={
						(e) => {
							console.log(e[0]);
							setVendedor(e[0])
						}}
					/>

				<SelecaoCliente 
					isOpen={openSelecaoCliente}
					setOpenSelecaoCliente={() => setOpenSelecaoCliente(!openSelecaoCliente)}
					setComprador={
						(e) => {
							console.log(e[0])
							setCliente(e[0])
						}}
					/>

				<SelecaoProduto
					isOpen={openSelecaoTinta} 
					setOpenSelecaoTinta={() => setOpenSelecaoTinta(!openSelecaoTinta)} 
					id={ID}
					setLastItem={() => {setLastItem(lastItem+1)}}
					/>

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
												value={vendedor}
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
												onClick={() =>
													{setOpenSelecaoFunc(true)}}
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
												value={cliente}
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
												onClick={() => {
													setOpenSelecaoCliente(true)
												}}
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

										<Tabela
										lista={listaTintas} 
										colunas={colunas}
										qtd={5}
										selecao={true}
										height={'380px'}
										setLinha={
											(e) => {
												console.log(e[0]);
												setCod(e[0])
											}
										}
										/>

										<Grid item xs={4} spacing={2} mt={2}>
											<Stack direction={'row'} spacing={2}>
												<Button
													variant="contained"
													style={{
														maxWidth: "200px",
														minWidth: "200px",
														maxHeight: "40px"
													}}
													onClick={adicionarItem}
													type="submit"
													color="primary"
													height={'28px'}
													size={"large"}>
													Selecionar Itens
												</Button>

												<Button
													variant="contained"
													style={{
														maxWidth: "200px",
														minWidth: "200px",
														maxHeight: "40px"
													}}
													onClick={excluirItem}
													type="submit"
													color="primary"
													height={'28px'}
													size={"large"}>
													Excluir Item
												</Button>
											</Stack>
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
														onClick={fechaVenda}
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
														onClick={cancelaVenda}
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
