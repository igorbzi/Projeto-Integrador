import React from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
function Tabela(props) {

    return (
        <Grid item 
            spacing={2}
            xs = {11}
            sx = {{ height: props.height}}
            mb={3}
        >
            <DataGrid 
                rows={props.lista}
                columns={props.colunas}
                getRowId={(row) => row.id}
                pageSizeOptions={props.qtd}
                initialState={{
                    pagination:{
                        paginationModel : {
                            pageSize: props.qtd
                        },
                    },
                }}
                disableRowSelectionOnClick={props.selecao}
            />
        </Grid>
    )
}

export default Tabela