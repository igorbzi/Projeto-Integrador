import * as React from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Link } from '@mui/material';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  
  const [qtd, setQtd] = React.useState("");

  React.useEffect(() =>
    {getQtd()}, [qtd]
  )

  async function getQtd() {
    const token = localStorage.getItem("token");
    const res = await axios.get("/quantidade", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
    setQtd(res.data[0].sum);
  }

  return (
      <React.Fragment>
          <Title>Tintas Vendidas</Title>
          <Typography component="p" variant="h4">
            {qtd}
          </Typography>
          <Link variant="h7">Consultar Vendas</Link>
      </React.Fragment>
  );
}
