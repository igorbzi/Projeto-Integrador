## Sistema de Arquivo de Tintas - Finalizado ##
 

 ## Autores ##

- Hallyson Tavares Cruz
- Igor Lautert Bazei

## Descrição ##

<p>O projeto foi desenvolvido nas disciplinas de Programação II, Banco de Dados I e Engenharia de Software I.</p>
<p>Os requisitos funcionais e não funcionais, o diagrama de casos de uso e os protótipos do sistema se encontram na pasta Engenharia de Software I</p>
<p>O projeto do banco, com o modelo conceitual, lógico e os scripts se encontram na página Banco de Dados I</p>
<p>O código do sistema está na pasta Programação II</p>

### Tecnologias ###

- Javascript 
- NodeJS
- Express
- React
- Material UI

### Requisitos Implementados ###

- Login
- Autenticação de Usuário
- Criptografia de Senhas
- Cadastro de funcionários, fornecedores, clientes, produtos
- Realizar Vendas
- Dashboard(parcialmente)

## Utilização do código ##

<p>Para que o sistema funcione é necessário ter o PostgreSQL e o NodeJS instalados. Primeiramente é necessário iniciar o banco, depois no arquivo server.js, localizado na pasta Backend, é necessário inserir o seu usuário, senha e porta do PostgreSQL. </p>
<p>Com o banco iniciado, inicie o backend usando o node/nodemon e o frontend usando npm/yarn</p>
<p>O sistema não possui um usuário padrão cadastrado, para cadastrar o primeiro usuário é necessário usar o Insomnia/Postman ou a extensão do VsCode Thunder Client. Em alguns desses serviços, realize um post na URL http://localhost:3010/funcionario. No corpo do post, é necessário preencher os campos CPFF, nome, email, passwd e type, sendo CPFF e type inteiros.</p>
<p>Pronto! Agora você pode utilizar o usuário cadastrado para acessar o sistema!</p>