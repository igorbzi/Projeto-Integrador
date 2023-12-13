import React from 'react'
import Titulo from '../Titulo';
import Tabela from '../Tabela';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import {
    Alert,
    Button,
    Grid,
    IconButton,
    OutlinedInput,
    Paper,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";

const colunas = [
	{ field: "id", headerName: "Código", width: 120 },
	{ field: "nome", headerName: "Nome", width: 280 },
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
	padding: '180px',
	backgroundColor: '#fff'
}

function SelecaoProduto(props) {

    const [tinta, setTinta] = React.useState("");
	const [listaTinta, setListaTinta] = React.useState([]);
    const [nome, setNome] = React.useState([]);
    const [base, setBase] = React.useState([]);
    const [litragem, setLitragem] = React.useState([]);

    const [qtd, setQtd] = React.useState([]);
    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");


    React.useEffect(() => {
		getData();
	}, []);


    React.useEffect(() => {
        if(tinta !== ""){
            fillProduct()
        }
    }, [tinta]);

    function clearForm() {
        setTinta("");
        setNome("");
        setBase("");
        setLitragem("");
        setQtd("");
    }

    function handleCloseMessage(_, reason) {
		if (reason === "clickaway") {
			return;
		}
		setOpenMessage(false);
	}

    async function fillProduct() {
        try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/tinta_id", {
                headers: {
                    Authorization: `bearer ${token}`,
                },
                params: {
                    tinta: tinta[0]
                }
            });
            setBase(res.data[0].base);
            setLitragem(res.data[0].litragem);
            setNome(res.data[0].nome);
		} catch (error) {
			console.log(error);
            setMessageText("Algo deu errado!");
            setMessageSeverity("error");
            setOpenMessage(true)
		}
    }

    async function getDataId() {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("/tinta_id", {
                headers: {
                    Authorization: `bearer ${token}`,
                },
                params: {
                    tinta: tinta[0]
                }
            });
            if(res.data.length === 0){
                setMessageText("Tinta não está cadastrada!");
                setMessageSeverity("error");
                setOpenMessage(true);
            } else {
                setTinta(res.data[0].id)
                setListaTinta(res.data);
                console.log(res.data);
            }
		} catch (error) {
			setListaTinta([]);
		}
	}

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

    function setProduto() {
		try {
            if(qtd > 0){
                console.log(`ID: ${props.id} - Tinta: ${tinta[0]} - Quantidade: ${qtd}`)
                const token = localStorage.getItem("token");
                axios.post("/itens_venda",                
                {
                    ID: props.id,
                    cod: tinta[0],
                    qtd: qtd
                    }, {
                    headers: {
                        Authorization: `bearer ${token}`,
                    },
                });
                setMessageText("Item incluído com sucesso!");
                setMessageSeverity("success");
                props.setLastItem()
            } else {
                setMessageText("É necessário adicionar a quantidade!");
                setMessageSeverity("error");
            }
		} catch (error) {
			console.log(error);
            setMessageText("Falha na inclusão do item");
            setMessageSeverity("error");
		} finally {
            setOpenMessage(true);
        }
        clearForm("");
    }

    async function handleSubmit() {
		if (tinta !== "") {
            try {
                await getDataId();
                clearForm();
            } catch (error) {
                console.log(error);
                setMessageText("Falha na busca do produto!");
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
                setMessageText("Falha na busca do produto!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
            }
		}
	}

    if (props.isOpen){

        return (
            <div>
            <div style={background_style}>

                <Grid container style={selecao_style}>
        
                <Grid item xs={11}>
                    <Stack 
                    justifyContent={'space-between'}
                    direction={'row'}>

                        <Titulo mensagem={"Adicionar Produtos "} fontSize={"40px"} />

                        <IconButton>
                            <CloseIcon onClick={props.setOpenSelecaoTinta} />
                        </IconButton>
                    </Stack>
                </Grid>


                <Grid item xs={6}>
                    <Tabela
                        lista={listaTinta} 
                        colunas={colunas}
                        qtd={5}
                        selecao={true}
                        heght={'400px'}
                        setLinha={setTinta}/>
                </Grid>

                <Grid container xs={3} fullWidth height={'380px'}>
                    <Titulo 
                        mensagem={"Produto selecionado: "}
                        fontSize={"30px"}
                    />

                    <Grid item xs={11} mx={1}>
                        <Titulo fontSize={"18px"} mensagem={"Código"}/>
                        <TextField 
                            fullWidth
                            size="small" 
                            value={tinta}
                            inputProps={{
                                readOnly: true,
                            }}
                            />
                    </Grid>

                    <Grid item xs={11} mx={1}>
                        <Titulo fontSize={"18px"} mensagem={"Produto"}/>
                        <TextField
                            fullWidth
                            size="small" 
                            value={nome}
                            inputProps={{
                                readOnly: true,
                            }}
                            />
                    </Grid>

                    <Grid item xs={5} mx={1}>
                        <Titulo fontSize={"18px"} mensagem={"Base"}/>
                        <TextField 
                            fullWidth
                            size="small" 
                            value={base}
                            inputProps={{
                                readOnly: true,
                            }}
                            />
                    </Grid>

                    <Grid item xs={5.35} mx={1}>
                        <Titulo fontSize={"18px"} mensagem={"Litragem"}/>
                        <TextField 
                            fullWidth
                            size="small" 
                            value={litragem}
                            inputProps={{
                                readOnly: true,
                            }}
                            />
                    </Grid>
                    
                    <Grid item xs={11} mx={1}>
                        <Titulo
                            mensagem={"Insira a quantidade"}
                            fontSize={"20px"}
                            mb={2}
                        />

                        <OutlinedInput
                            fullWidth
                            id="qtd-input"
                            //type="number"
                            size="small"
                            onChange={(e) => setQtd(e.target.value)}
                            value={qtd}

                            />

                    </Grid>

                </Grid>

                <Grid item xs={5}>

                    <OutlinedInput
                    fullWidth
                    placeholder= "Insira o código do produto..."
                    id="tinta-input"
                    size="small"
                    onChange={(e) => setTinta(e.target.value)}
                    value={tinta}
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

                <Grid item xs={2.75} mb={2} mx={1}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={setProduto}
                        type="submit"
                        color="primary"
                        height={'40px'}
                        >
                        Incluir
                    </Button>
                </Grid>

                </Grid>

        </div>
                <Snackbar
                    open={openMessage}
                    autoHideDuration={2000}
                    onClose={handleCloseMessage}
                    >
                    <Alert
                        severity={messageSeverity}
                        onClose={handleCloseMessage}
                    >
                        {messageText}
                    </Alert>
				</Snackbar> 
        </div>
        )
    }

    return null;
}

export default SelecaoProduto