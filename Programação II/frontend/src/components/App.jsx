import {React, useState, useEffect} from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import Funcionario from "./Funcionario";

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


	return (
		<Routes>

			<Route 
				exact path="/" 
				element={
					isLoggedIn ? 
						<Home onLogout={handleLogout}/> : <Login onLogin={handleLogin}/>} />

			<Route 
				path="/cadastro_funcionarios" 
				element={
					isLoggedIn ? 
						<Funcionario /> : <Login onLogin={handleLogin}/>}/>

			<Route />
			<Route path="*" element={<Login onLogin={handleLogin}/>} />
		</Routes>
	);
}

export default App;
