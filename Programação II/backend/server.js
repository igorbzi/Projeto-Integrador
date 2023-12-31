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


app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

//------------------------------------fornecedores------------------------------------//:


app.get("/fornecedor", requireJWTAuth, async (req,res)=> {
    try {
        const fornecedor = await db.any(
            "select cnpj as id, nome, email, ender, telefone1, telefone2 from fornecedor"
        );
        res.json(fornecedor).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/fornecedor_id", requireJWTAuth, async (req, res) => {
    try{
        const cnpj = req.query.fornecedor;
        console.log(cnpj);
        const fornecedor = await db.any(
            "select cnpj as id, nome, email from fornecedor where cnpj= $1;",
            [cnpj]
        );
        res.json(fornecedor).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
}
);

app.get("/fornecedor_email", requireJWTAuth, async (req, res) => {
    try{
        const email = req.query.fornecedor;
        console.log(email);
        const fornecedor = await db.any(
            "select email from fornecedor where email= $1;",
            [email]
        );
        res.json(fornecedor).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
}
);

app.post("/fornecedor", requireJWTAuth, async (req, res) => {
    try {

        const fornecedorCNPJ = req.body.CNPJ;
        const fornecedorNome = req.body.nome;
        const fornecedorEmail = req.body.email; 
        const fornecedorEndereco = req.body.ender;                //pegando parametros da requisição para inserir no banco
        const fornecedorTelefone1 = req.body.telefone1;
        const fornecedorTelefone2 = req.body.telefone2;
        
        console.log(`CNPJ: ${fornecedorCNPJ} Nome: ${fornecedorNome}`);

        db.none(
            "INSERT INTO fornecedor (cnpj, nome, email, ender, telefone1, telefone2) VALUES ($1, $2, $3, $4, $5, $6);",   //passando parâmetros
            [fornecedorCNPJ, fornecedorNome, fornecedorEmail, fornecedorEndereco, fornecedorTelefone1, fornecedorTelefone2]
        );
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});


app.put("/fornecedor", requireJWTAuth, (req, res) => {
    try{
        const id = req.body.CNPJ
        const fornecedorNome = req.body.nome;
        const fornecedorEmail = req.body.email;   
        const fornecedorEndereco = req.body.ender;              //pegando parametros da requisição para inserir no banco
        const fornecedorTelefone1 = req.body.telefone1;
        const fornecedorTelefone2 = req.body.telefone2;

        db.none(
            "UPDATE fornecedor SET nome = $1, email = $2, telefone1 = $3, telefone2 = $4, ender = $5 WHERE cnpj = $6",
            [fornecedorNome, fornecedorEmail, fornecedorTelefone1, fornecedorTelefone2, fornecedorEndereco, id]
        );
        res.sendStatus(200);

    } catch {
        console.log(error);
        res.sendStatus(400);
    }
    });

app.delete("/fornecedor", requireJWTAuth, async (req, res) => {
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
            "select cpfc as id, nome, email, ender, telefone1, telefone2 from cliente"
        );
        res.json(clientes).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/cliente_id", requireJWTAuth, async (req, res) => {
    try{
        const cpfc = req.query.cliente;
        const cliente = await db.any(
            "select cpfc as id, nome, email from cliente where cpfc= $1",
            [cpfc]
        );
        res.json(cliente).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
}
);

app.get("/cliente_email", requireJWTAuth, async (req, res) => {
    try{
        const email = req.query.cliente;
        console.log(email);
        const cliente = await db.any(
            "select email from cliente where email= $1;",
            [email]
        );
        res.json(cliente).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
}
);

app.post("/cliente", requireJWTAuth, async (req, res) => {
    try {
        const clienteCPFC = req.body.CPFC;
        const clienteNome = req.body.nome;
        const clienteEmail = req.body.email;       //pegando parametros da requisição para inserir no banco
        const clienteEndereco = req.body.ender;
        const clienteTelefone1 = req.body.telefone1;
        const clienteTelefone2 = req.body.telefone2;
        
        db.none(
            "INSERT INTO cliente (cpfc, nome, email, ender, telefone1, telefone2) VALUES ($1, $2, $3, $4, $5, $6);", //passando parâmetros
            [clienteCPFC, clienteNome, clienteEmail, clienteEndereco, clienteTelefone1, clienteTelefone2]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete("/cliente", requireJWTAuth, async (req, res) => {
    try{
        const id = req.body.cpf; //pega parametro da req
        db.none(
            "DELETE from cliente where cpfc = $1;", [id] //deleta pelo cnpj
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
            "select cpff as id, nome, email from funcionario;"
        );
        res.json(funcionarios).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/funcionario_id", requireJWTAuth, async (req, res) => {
    try{
        const cpff = req.query.funcionario;
        const funcionario = await db.any(
            "select cpff as id, nome, email from funcionario where cpff= $1",
            [cpff]
        );
        res.json(funcionario).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
}
);

app.get("/funcionario_email", requireJWTAuth, async (req, res) => {
    try{
        const email = req.query.funcionario;
        console.log(email);
        const funcionario = await db.any(
            "select email from funcionario where email= $1",
            [email]
        );
        res.json(funcionario).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
}
);

app.post("/funcionario", requireJWTAuth, async (req, res) => {
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

app.put("/funcionario", requireJWTAuth, async (req, res) => {
    try{
        const funcionarioCPFF = req.body.CPFF;
        const funcionarioNome = req.body.nome;
        const funcionarioEmail = req.body.email;   
        const funcionarioSenha = req.body.passwd;              //pegando parametros da requisição para inserir no banco
        const funcionarioTipo = req.body.type;

        db.none(
            "UPDATE funcionario SET nome = $1, email = $2, senha = $3, tipousu = $4 WHERE cpff = $5;",
            [funcionarioNome, funcionarioEmail, funcionarioSenha, funcionarioTipo, funcionarioCPFF]
        );
        res.sendStatus(200);

    } catch {
        console.log(error);
        res.sendStatus(400);
    }
    });

app.delete("/funcionario", requireJWTAuth, async (req, res) => {
    try{
        const id = req.body.CPFF; //pega parametro da req
        db.none(
            "DELETE from funcionario where cpff = $1;", [id] //deleta pelo cnpj
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
            "select t.cod as id, t.nome, t.base, t.litragem, f.nome as fornecedor from tinta t join fornecedor f on f.cnpj=t.cnpj;"
        );
        res.json(tintas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/tinta_id", requireJWTAuth, async (req,res)=> {
    try{
        const cod = req.query.tinta;
        const tinta = await db.any(
            "select cod as id, nome, base, litragem from tinta where cod= $1",
            [cod]
        );
        res.json(tinta).status(200)
    } catch (error){
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/tinta", requireJWTAuth, async (req, res) => {
    try {
        const tintaCod = req.body.COD;
        const tintaNome = req.body.nome;
        const tintaLitragem = req.body.litragem;       //pegando parametros da requisição para inserir no banco
        const tintaBase = req.body.base;
        const tintaCNPJ = req.body.CNPJ;
        
        console.log(`CNPJ: ${tintaCod} Nome: ${tintaNome} Litragem: ${tintaLitragem} Base: ${tintaBase}`);
        db.none(
            "INSERT INTO tinta (cod, nome, base, litragem, cnpj) VALUES ($1, $2, $3, $4, $5);", //passando parâmetros
            [tintaCod, tintaNome, tintaBase, tintaLitragem, tintaCNPJ]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete("/tinta", requireJWTAuth, async (req, res) => {
    try{
        const id = req.body.COD; //pega parametro da req
        db.none(
            "DELETE from tinta where cod = $1;", [id] //deleta pelo cod
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
});

//--------------------------------------venda--------------------------------------//:


app.get("/id_venda", requireJWTAuth, async (req,res)=> {
    try {
        const id = await db.any(
            "select last_value as id from venda_id_seq;"
        );
        res.json(id).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/venda", requireJWTAuth, async (req,res)=> {
    try {
        const vendas = await db.any(
            "select v.id, v.cpff, v.cpfc, v.data from venda v;"
        );
        res.json(vendas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/vendas_funcionario", requireJWTAuth, async (req,res)=> {
    try {
        const funcionario = req.query.funcionario;
        const vendas = await db.any(
            "select id from venda where cpff=$1;", 
            [funcionario]
        );
        console.log(vendas)
        res.json(vendas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/venda", requireJWTAuth, async (req, res) => {
    try {
        const vendaID = req.body.ID;
        const vendaCPFF = req.body.CPFF;
        const vendaCPFC = req.body.CPFC;
        const vendaData = req.body.data;
        const vendaStatus = req.body.status;

        console.log(`ID: ${vendaID} CPFF: ${vendaCPFF} CPFC: ${vendaCPFC} Data: ${vendaData}`);
        
        await db.none(
            "INSERT INTO venda (cpff, cpfc, data, status) VALUES ($1, $2, $3, $4);",
            [vendaCPFF, vendaCPFC, vendaData, vendaStatus]
        );

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.put("/venda", requireJWTAuth, (req, res) => {
    try{
        const ID = req.body.ID
        const status = req.body.status;
        console.log(`ID: ${ID} - Status: ${status}`);
        db.none(
            "UPDATE venda SET status=$2 WHERE id = $1",
            [ID, status]
        );
        res.sendStatus(200);

    } catch {
        console.log(error);
        res.sendStatus(400);
    }
    });

app.get("/itens_venda", requireJWTAuth, async (req,res) => {
    try {
        const id = req.query.id;
        console.log(`ID da Venda: ${id}`);
        const vendas = await db.any(
            "select t.cod as id, t.nome, t.base, t.litragem, c.qtd from tinta t join composicao c on t.cod=c.cod natural join venda v where v.id= $1;",
            [id]
        );
        console.log(vendas);
        res.json(vendas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/itens_venda", requireJWTAuth, async (req,res) => {
    try {
        const ID = req.body.ID;
        const cod = req.body.cod;
        const qtd = req.body.qtd;

        console.log(`ID: ${ID} Código: ${cod} Quantidade: ${qtd}`);
        
        await db.none(
            "INSERT INTO composicao (id, cod, qtd) VALUES ($1, $2, $3);",
            [ID, cod, qtd]
        );

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.delete("/itens_venda", async (req, res) => {
    console.log(req.body)
    try{
        const ID = req.body.ID;
        const cod = req.body.cod
        console.log(`ID: ${ID} - Código: ${cod}`);

        await db.none(
            "DELETE from composicao where id=$1 and cod=$2; ", 
            [ID, cod]
        );
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})


app.get("/quantidade", requireJWTAuth, async (req,res) => {
    try {
        const vendas = await db.any(
            "select sum(c.qtd) from composicao c natural join venda v where v.status='Fechada';"
        );
        console.log(vendas);
        res.json(vendas).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});
