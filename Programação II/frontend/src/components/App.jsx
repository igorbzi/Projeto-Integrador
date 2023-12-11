import {React, useState, useEffect} from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import CadastroFunc from "./Funcionario/CadastroFunc";
import ConsultaFunc from "./Funcionario/ConsultaFunc";
import CadastroCliente from "./Cliente/CadastroCliente";
import CadastroTinta from "./Tinta/CadastroTinta";
import CadastroFornecedor from "./Fornecedor/CadastroFornecedor";
import CadastroVenda from "./Venda/CadastroVenda";

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
	"application/json;charset=utf-8";

function App() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// verifica se já está logado
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		// Clear the token from localStorage
		localStorage.removeItem("token");
		setIsLoggedIn(false);
	};

	//funcao p verificar se o funcionario está logado
	const Private = ({Elemento}) => {
		return isLoggedIn ? <Elemento onLogout={handleLogout}/> : <Login onLogin={handleLogin} />
	}


	return (
		<Routes>

			<Route 
				exact path="/" 
				element={<Private Elemento={Home}/>}
			/>

			<Route 
				path="/cadastro_funcionarios" 
				element={<Private Elemento={CadastroFunc} />}/>

			<Route 
				path="/consulta_funcionarios"
				element={<Private Elemento={ConsultaFunc}/>}/> {/*Aqui adiciona as outras rotas*/}

			<Route /> {/*Aqui adiciona as outras rotas*/}

			<Route 
				path="/cadastro_clientes" 
				element={<Private Elemento={CadastroCliente} /> } />

			<Route 
				path="/cadastro_fornecedores" 
				element={<Private Elemento={CadastroFornecedor} /> }/>

			<Route 
				path="/cadastro_tintas" 
				element={<Private Elemento={CadastroTinta} /> }/>

			<Route 
				path="/cadastro_vendas" 
				element={<Private Elemento={CadastroVenda} /> }/>

			<Route 
				path="*"  //qualquer caminho fora dos definidos aqui leva p home
				element={<Private Elemento={Home}/>} />
		</Routes>
	);
}

export default App;
