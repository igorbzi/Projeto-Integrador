import React from 'react'
import Titulo from '../Titulo';
import Tabela from '../Tabela';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import {
    Button,
    Grid,
    IconButton,
    OutlinedInput,
    Paper,
    Stack
} from "@mui/material";

const colunas = [
	{ field: "id", headerName: "CPF", width: 120 },
	{ field: "nome", headerName: "Nome", width: 300 },
];


const background_style = {
	position: 'fixed',
	top: '0',
	bottom: '0',
	left: '0',
	right:'0',
	backgroundColor: 'rgb(0,0,0,0.7)',
	zIndex: '1000'
}

const selecao_style = {
	position: 'fixed',
	top: '55%',
	left: '50%',
	transform: 'translate(-50%,-50%)',
	padding: '150px',
	backgroundColor: '#fff'
}

function SelecaoFunc(props) {

    const [funcionario, setFuncionario] = React.useState("");
	const [listaFuncionario, setListaFuncionario] = React.useState([]);
    
    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

    React.useEffect(() => {
		getData();
	}, []);

    function clearForm() {
        setFuncionario("");
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
                setFuncionario(res.data[0].nome);
                console.log(funcionario);
                setListaFuncionario(res.data);
                console.log(res.data);
            }
		} catch (error) {
			setListaFuncionario([]);
		}
	}

    async function getData() {
		try {
			const token = localStorage.getItem("token");
            const res = await axios.get("/funcionario", {
                    headers: {
                        Authorization: `bearer ${token}`,
                    },
                });
			setListaFuncionario(res.data);
			console.log(res.data);
		} catch (error) {
			setListaFuncionario([]);
		}
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
            } finally {
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
            } finally {
                setOpenMessage(true);
            }
		}
	}

    function setVendedor() {
        props.setVendedor(funcionario)
        clearForm("");
        props.setOpenSelecaoFunc(false)
    }

    if (props.isOpen){
        return (
            <div style={background_style}>
                <Paper style={selecao_style}>

                <Grid container spacing={2}>
        
                <Grid item xs={11}>
                    <Stack 
                    justifyContent={'space-between'}
                    direction={'row'}>

                        <Titulo mensagem={"Selecione o vendedor "} fontSize={"28px"} />

                        <IconButton>
                            <CloseIcon onClick={props.setOpenSelecaoFunc} />
                        </IconButton>
                    </Stack>
                </Grid>

                <Tabela
                    lista={listaFuncionario} 
                    colunas={colunas}
                    qtd={5}
                    selecao={true}
                    heght={'380px'}
                    setLinha={setFuncionario}/>

                <Grid item xs={9.5}>

                    <OutlinedInput
                    fullWidth
                    id="funcionario-input"
                    size="small"
                    onChange={(e) => setFuncionario(e.target.value)}
                    value={funcionario}
                    />

                </Grid>

                <Grid item xs={1}>
                    <IconButton>
                        <SearchIcon 
                            fullWidth
                            justifyContent={'right'}
                            variant="contained"
                            onClick={handleSubmit}
                            type="submit"
                            color="primary"
                            size={"small"}
                            />
                    </IconButton>
                </Grid>

                <Grid item xs={11} mb={2}>
                    <Button
                        fullWidth
                        justifyContent={'right'}
                        variant="contained"
                        onClick={setVendedor}
                        type="submit"
                        color="primary"
                        size={"small"}
                        height={'28px'}
                        >
                        Selecionar Vendedor
                        </Button>
                </Grid>

                </Grid>
            </Paper>
        </div>
        )
    }

    return null;
}

export default SelecaoFunc