import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Home from './Home.jsx'

const defaultTheme = createTheme();

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      CPF: data.get('CPF'),
      senha: data.get('senha'),
    });
  };

  const [pagina, setPagina] = useState('login');

  useEffect(
    ()=>{
      const url=window.location.href
      const res=url.split('?')
      setPagina(res[1])
    }
  )

  const LinksPaginas = (p) => {
    if (p == 'home') {
      window.open('http://localhost:3000?home','_self');
    }
  }

  const retornarPaginas = () =>{
    if(pagina == 'home'){
      return <Home />
    }
    else {
      return (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Entrar
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="CPF"
                  label="CPF"
                  name="CPF"
                  autoComplete="CPF"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="senha"
                  label="Senha"
                  type="senha"
                  id="senha"
                  autoComplete="current-senha"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Lembrar Usuário"
                />
    
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={()=>{
                    LinksPaginas('home')
                  }}
                >
                  Entrar
                </Button>
    
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Esqueceu a senha?
                    </Link>
                  </Grid>
                  <Grid item>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
    }
  }

  return (
    <>
    {retornarPaginas()}
    </>
  )
  
}
