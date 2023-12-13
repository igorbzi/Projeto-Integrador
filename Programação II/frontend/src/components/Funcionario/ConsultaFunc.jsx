import React from 'react'
import Navbar from '../Navbar';
import axios from "axios";
import Titulo from "../Titulo"

import {
    Alert,
    Box,
    Button,
    Grid, 
    OutlinedInput, 
    Paper,
    Snackbar,
    Toolbar
} from "@mui/material"
import Tabela from '../Tabela';

const colunas = [
	{ field: "id", headerName: "CPF", width: 100 },
	{ field: "nome", headerName: "Nome", width: 280 },
	{ field: "email", headerName: "Email", width: 180 },
];

function Consulta(props) {

	const [listaFuncionarios, setListaFuncionarios] = React.useState([]);
    const [funcionario, setFuncionario] = React.useState("");
    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

    React.useEffect(() => {
		getData();
	}, []);

    function clearForm() {
        setFuncionario("");
    }


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

    async function getDataId() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/funcionario_id", {
                headers: {
                    Authorization: `bearer ${token}`,
                },
                params: {
                    funcionario: parseInt(funcionario)
                }
            });
            if(res.data.length === 0){
                setMessageText("CPF não está cadastrado!");
                setMessageSeverity("error");
                setOpenMessage(true);
            } else {
                setListaFuncionarios(res.data);
                console.log(res.data);
            }
		} catch (error) {
			setListaFuncionarios([]);
		}
	}

    async function handleDelete() {
        try {
            const token = localStorage.getItem('token');
    
            console.log(parseInt(funcionario))
            const cpfExists = await axios.get('/funcionario_id', {
                headers: {
                    Authorization: `bearer ${token}`,
                },
                funcionario: parseInt(funcionario),
            });
                
            if (!funcionario || isNaN(parseInt(funcionario)) || cpfExists.data.length===0) {
                setMessageText('CPF inválido. Por favor, insira um CPF válido.');
                setMessageSeverity('warning');
                setOpenMessage(true);
            } else {
                const vendas = await axios.get("/vendas_funcionario", {
                    params: {
                        funcionario: parseInt(funcionario)
                    },
                    headers: {
                        Authorization: `bearer ${token}`,
                    },
                })

                if(vendas.data.length>0){
                    setMessageSeverity('error');
                    setMessageText("Não é possível excluir funcionários com vendas cadastradas!")
                    setOpenMessage(true);
                } else {
                    await axios.delete('/funcionario', {
                        data: {
                            CPFF: parseInt(funcionario),
                        },
                        headers: {
                        Authorization: `bearer ${token}`,
                        }
                    });
                    setMessageSeverity('success');
                    setMessageText('Funcionário deletado com sucesso!')
                    setOpenMessage(true);
                    getData();
                }
            }
        } catch (error) {
            console.error(error);
            setMessageText('Falha ao deletar funcionário!');
            setMessageSeverity('error');
            setOpenMessage(true);
            getData();
        }
        }

        async function handleAlter(){

        }


    async function handleSubmit() {
		if (funcionario !== "") {
            try {
                await getDataId();
                clearForm();
            } catch (error) {
                console.log(error);
                setMessageText("Falha na busca do funcionário!");
                setMessageSeverity("error");
                setOpenMessage(true);
            }
		} else {
            try {
                await getData();
                clearForm();
            } catch (error) {
                console.log(error);
                setMessageText("Falha na busca do funcionário!");
                setMessageSeverity("error");
                setOpenMessage(true);
		    }
	    }
    }

    function handleCloseMessage(_, reason) {
		if (reason === "clickaway") {
			return;
		}
		setOpenMessage(false);
	}

    return (
        <Box sx = {{ display: 'flex'}}>

            <Navbar onLogout={props.onLogout}/>

            <Box 						
                component="main"
                mt={2}
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    display: 'flex',
                }}
                spacing={2}>


                <Grid container>

                    <Grid item xs={11} mx={8} mt={8}>
                        <Paper sx={{maxWidth: '80%'}} spacing={2}>

                            <Grid container spacing={2} sx={{mx: 2}}>

                                <Grid item xs={11}>
                                    <Titulo mensagem={"Funcionários Cadastrados: "} fontSize={"28px"} />
                                </Grid>

                                <Tabela
									lista={listaFuncionarios} 
									colunas={colunas}
									qtd={7}
									selecao={true}
                                    height={'490px'}
                                    setLinha={(e) => {
                                        setFuncionario(e[0]);
                                        console.log(funcionario)
                                        }
                                    }/>

                                <Grid item xs={8}>
                                    <OutlinedInput
                                    fullWidth
                                    id="funcionario-input"
                                    size="small"
                                    onChange={(e) => setFuncionario(e.target.value)}
                                    value={funcionario}
                                    
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <Button
                                        fullWidth
                                        justifyContent={'right'}
                                        variant="contained"
                                        style={{
                                            minWidth: "100px",
                                            height: "40px"
                                        }}
                                        onClick={handleSubmit}
                                        type="submit"
                                        color="primary"
                                        size={"large"}>
                                        Pesquisar
                                    </Button>
                                </Grid>

                                <Grid item xs={3} mb={1}>
                                    <Button
                                        fullWidth
                                        justifyContent={'left'}
                                        variant="contained"
                                        style={{
                                            minWidth: "100px",
                                            height: "40px"
                                        }}
                                        onClick={() => {}}
                                        type="submit"
                                        color="primary"
                                        size={"large"}>
                                        Alterar
                                    </Button>
                                </Grid>

                                <Grid item xs={3} mb={1}>
                                    <Button
                                        fullWidth
                                        justifyContent={'left'}
                                        variant="contained"
                                        style={{
                                            minWidth: "100px",
                                            height: "40px"
                                        }}
                                        onClick={handleDelete}
                                        type="submit"
                                        color="error"
                                        size={"large"}>
                                        Deletar
                                    </Button>
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
    );
}

export default Consulta