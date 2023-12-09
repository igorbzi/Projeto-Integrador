const express = require("express");
const cors = require("cors");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "igorbd12";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/sistema`);

const app = express();
app.use(cors());
app.use(express.json());

app.use(
	session({
		secret: 'time_limit_exceeded',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{
			usernameField: "username",
			passwordField: "password",
		},
		async (username, password, done) => {
			try {
				// busca o usuário no banco de dados
				const user = await db.oneOrNone(
					"SELECT * FROM funcionario WHERE CPFF = $1;",
					[username],
				);

				// se não encontrou, retorna erro
				if (!user) {
					return done(null, false, { message: "Usuário incorreto." });
				}

				// verifica se o hash da senha bate com a senha informada
				const passwordMatch = await bcrypt.compare(
					password,
					user.senha
				);

				// se senha está ok, retorna o objeto usuário
				if (passwordMatch) {
					console.log("Usuário autenticado!");
					return done(null, user);
				} else {
					// senão, retorna um erro
					return done(null, false, { message: "Senha incorreta." });
				}
			} catch (error) {
				return done(error);
			}
		},
	),
);

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "time_limit_exceeded",
		},
		async (payload, done) => {
			try {
				const user = await db.oneOrNone(
					"SELECT * FROM funcionario WHERE CPFF = $1;",
					[payload.username],
				);

				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			} catch (error) {
				done(error, false);
			}
		},
	),
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			CPFF: user.cpff,
			nome: user.nome,
		});
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.post(
	"/login",
	passport.authenticate("local", { session: false }),
	(req, res) => {

		// Cria o token JWT
		const token = jwt.sign({ username: req.body.username }, "time_limit_exceeded", {
			expiresIn: "1h",
		});

		res.json({ message: "Login successful", token: token });
	},
);

app.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

app.post("/novoUsuario", async (req, res) => {
	const saltRounds = 10;
	try {
		const userCPF = req.body.CPFF;
		const username = req.body.nome;
		const userEmail = req.body.email;
		const userPasswd = req.body.passwd;
		const userType = req.body.type;
		const salt = bcrypt.genSaltSync(saltRounds);
		const hashedPasswd = bcrypt.hashSync(userPasswd, salt);

		console.log(`Nome: ${username} - Email: ${userEmail}`);
		db.none("INSERT INTO funcionario (CPFF, nome, email, senha, tipousu) VALUES ($1, $2, $3, $4, $5);", [
			userCPF,
			username,
			userEmail,
			hashedPasswd,
			userType
		]);
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

//------------------------------------fornecedores------------------------------------//:

app.get("/fornecedor", requireJWTAuth, async (req,res)=> {
    try {
        const fornecedor = await db.any(
            "select * from fornecedor"
        );
        res.json(fornecedor).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/fornecedor", async (req, res) => {
    try {

        const fornecedorNome = req.body.nome;
        const fornecedorCNPJ = req.body.cnpj;
        const fornecedorEmail = req.body.email;                 //pegando parametros da requisição para inserir no banco
        const fornecedorTelefone1 = req.body.telefone1;
        const fornecedorTelefone2 = req.body.telefone2;
        const fornecedorEndereco = req.body.endereco;
        
        console.log(`CNPJ: ${fornecedorCNPJ} Nome: ${fornecedorNome}`);

        db.none(
            "INSERT INTO fornecedor (nome, cnpj, email, telefone1, telefone2, endereco) VALUES ($1, $2, $3, $4, $5, $6);",   //passando parâmetros
            [fornecedorNome, fornecedorCNPJ, fornecedorEmail, fornecedorTelefone1, fornecedorTelefone2, fornecedorEndereco]
        );
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.put("/fornecedor", (req, res) => {
    try{
        const id = req.body.cnpj
        const fornecedorNome = req.body.nome;
        const fornecedorEmail = req.body.email;                 //pegando parametros da requisição para inserir no banco
        const fornecedorTelefone1 = req.body.telefone1;
        const fornecedorTelefone2 = req.body.telefone2;
        const fornecedorEndereco = req.body.endereco;

        db.none(
            "UPDATE fornecedor SET nome = $1, email = $2, telefone1 = $3, telefone2 = $4, endereco = $5 WHERE cnpj = $6",
            [fornecedorNome, fornecedorEmail, fornecedorTelefone1, fornecedorTelefone2, fornecedorEndereco, id]
        );
        res.sendStatus(200);

    } catch {
        console.log(error);
        res.sendStatus(400);
    }
    });

app.delete("/fornecedor", async (req, res) => {
    try{
        const id = req.body.cnpj; //pega parametro da req
        db.none(
            "DELETE from fornecedor where cnpj = $1;", [id] //deleta pelo cnpj
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});


//------------------------------------clientes------------------------------------//:

app.get("/cliente", requireJWTAuth, async (req,res)=> {
    try {
        const clientes = await db.any(
            "select * from cliente"
        );
        res.json(clientes).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/cliente", async (req, res) => {
    try {
        const clienteCPF = req.body.cpf;
        const clienteNome = req.body.nome;
        const clienteEmail = req.body.email;       //pegando parametros da requisição para inserir no banco
        const clienteTelefone1 = req.body.telefone1;
        const clienteTelefone2 = req.body.telefone2;
        const clienteEndereco = req.body.endereco;
        
        console.log(`cpf: ${clienteCPF} Nome: ${clienteNome}`);
        db.none(
            "INSERT INTO cliente (cpf, nome, endereço, telefone1, telefone2, email) VALUES ($1, $2, $3, $4, $5, $6);", //passando parâmetros
            [clienteCNPJ, clienteNome, clienteEndereco, clienteTelefone1, clienteTelefone2, clienteEmail]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete("/cliente", async (req, res) => {
    try{
        const id = req.body.cpf; //pega parametro da req
        db.none(
            "DELETE from cliente where cpf = $1;", [id] //deleta pelo cnpj
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

//------------------------------------funcionarios------------------------------------//:

app.get("/funcionario", requireJWTAuth, async (req,res)=> {
    try {
        const funcionarios = await db.any(
            "select cpff, nome, email from funcionario;"
        );
        res.json(funcionarios).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/funcionario", async (req, res) => {
    try {
        const funcionarioCNPJ = req.body.cnpj;
        const funcionarioNome = req.body.nome;
        const funcionarioEmail = req.body.email;       //pegando parametros da requisição para inserir no banco
        const funcionarioSenha = req.body.senha;
        const funcionarioTipo = req.body.tipo;
        
        console.log(`CNPJ: ${funcionarioCPF} Nome: ${funcionarioNome}`);
        db.none(
            "INSERT INTO funcionario (cpf, nome, email, senha, tipo) VALUES ($1, $2, $3, $4, $5);", //passando parâmetros
            [funcionarioCNPJ, funcionarioNome, funcionarioEmail, funcionarioSenha, funcionarioTipo]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete("/funcionario", async (req, res) => {
    try{
        const id = req.body.cpf; //pega parametro da req
        db.none(
            "DELETE from funcionario where cpf = $1;", [id] //deleta pelo cnpj
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

//--------------------------------------tintas--------------------------------------//:

app.get("/tinta", requireJWTAuth, async (req,res)=> {
    try {
        const tintas = await db.any(
            "select * from tinta"
        );
        res.json(tintas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/tinta", async (req, res) => {
    try {
        const tintaCod = req.body.cod;
        const tintaNome = req.body.nome;
        const tintaLitro = req.body.litro;       //pegando parametros da requisição para inserir no banco
        const tintaBase = req.body.base;
        
        console.log(`CNPJ: ${tintaCod} Nome: ${tintaNome} Litragem: ${tintaLitro} Base: ${tintaBase}`);
        db.none(
            "INSERT INTO tinta (cod, nome, litragem, base) VALUES ($1, $2, $3, $4);", //passando parâmetros
            [tintaCod, tintaNome, tintaLitro, tintaBase]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete("/tinta", async (req, res) => {
    try{
        const id = req.body.cod; //pega parametro da req
        db.none(
            "DELETE from tinta where cod = $1;", [id] //deleta pelo cnpj
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});