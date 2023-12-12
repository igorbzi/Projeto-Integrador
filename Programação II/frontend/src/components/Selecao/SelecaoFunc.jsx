import React from 'react'
import { DataGrid } from "@mui/x-data-grid";
import Titulo from '../Titulo';
import Tabela from '../Tabela';
import axios from "axios";


import {
    Button,
    Grid,
    OutlinedInput,
    Paper
} from "@mui/material";

const colunas = [
	{ field: "id", headerName: "Código", width: 120 },
	{ field: "nome", headerName: "Nome", width: 280 },
	{ field: "base", headerName: "Base", width: 80 },
	{ field: "litragem", headerName: "Litragem", width: 80 },
	{ field: "fornecedor", headerName: "Fornecedor", width: 200 }
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

    const [tinta, setTinta] = React.useState("");
	const [listaTinta, setListaTinta] = React.useState([]);
    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

    React.useEffect(() => {
		getData();
	}, []);

    function clearForm() {
        setTinta("");
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

    async function handleSubmit() {
		if (tinta !== "") {
            try {
                //await getDataId();
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

    if (props.isOpen){
        return (
            <div style={background_style}>
                <Paper style={selecao_style}>

                <Grid container spacing={2}>
                
                <Grid item xs={11}>
                    <Titulo mensagem={"Selecione um produto "} fontSize={"28px"} />
                </Grid>

                <Tabela
                    lista={listaTinta} 
                    colunas={colunas}
                    qtd={5}
                    selecao={true}/>

                <Grid item xs={8} mb={2}>
                    <OutlinedInput
                    fullWidth
                    id="funcionario-input"
                    size="small"
                    onChange={(e) => setListaTinta(e.target.value)}
                    value={tinta}
                    />
                </Grid>

                <Grid item xs={3} mb={2}>
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

                </Grid>
            </Paper>
        </div>
        )
    }

    return null;
}

export default SelecaoFunc