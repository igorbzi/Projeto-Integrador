const express = require("express");
const cors = require("cors");

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "igorbd12";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/integrador`);

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

//------------------------------------fornecedores------------------------------------//:

app.get("/fornecedores", async (req,res)=> {
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

app.get("/clientes", async (req,res)=> {
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

app.get("/funcionarios", async (req,res)=> {
    try {
        const funcionarios = await db.any(
            "select cpf, nome, email from funcionario"
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

app.get("/tintas", async (req,res)=> {
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