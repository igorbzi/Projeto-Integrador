CREATE DATABASE sistema;
\c sistema

CREATE TABLE Funcionario (
	CPFF BIGINT NOT NULL,
	Nome VARCHAR(50) NOT NULL,
	Email VARCHAR(50) UNIQUE NOT NULL,
	Senha VARCHAR(200) NOT NULL,
	TipoUsu INTEGER NOT NULL,
	constraint pk_funcionario primary key (CPFF)
);

INSERT INTO Funcionario(CPFF, Nome, Email, Senha, TipoUsu) VALUES (12345678, 'admin', 'admin@gmail.com', '$2b$10$osKuv05HQ/ePspiVwYS7W.ugvBzF4CEqndHFB6QHmql7qYO/gQ', 1);

CREATE TABLE Cliente (
	CPFC BIGINT NOT NULL,
	Nome VARCHAR(50) NOT NULL,
	Email VARCHAR(50) UNIQUE NOT NULL,
	Ender VARCHAR(100) NOT NULL,
	Telefone1 VARCHAR(15) NOT NULL,
	Telefone2 VARCHAR(15),
	constraint pk_cliente primary key (CPFC)
);

INSERT INTO Cliente(CPFC, Nome, Email, Ender, Telefone1, Telefone2) VALUES (54321, 'Lucas Souza', 'lucassouza23@gmail.com', 'Rua do Comércio, 919, Centro', '99876543', '98737232');
INSERT INTO Cliente(CPFC, Nome, Email, Ender, Telefone1) VALUES (987654, 'Jorge da Silva', 'jorgedasilva12@gmail.com', 'Rua Surucuá, 267-d, Edifício Dona Olga, Efapi', '93423946');

CREATE TABLE Venda (
	ID SERIAL NOT NULL,
	CPFF BIGINT NOT NULL,
	CPFC BIGINT REFERENCES Cliente(CPFC) NOT NULL,
	Data DATE NOT NULL,
	status varchar(10) NOT NULL,
	constraint pk_venda primary key (ID),
	constraint fk_venda_funcionario foreign key (CPFF) references Funcionario(CPFF),
	constraint fk_venda_cliente foreign key (CPFC) references Cliente(CPFC)
);

INSERT INTO Venda (CPFF, CPFC, Data, status) VALUES (12345678, 54321, '12-03-2004', 'Fechada');

CREATE TABLE Fornecedor (
	CNPJ BIGINT NOT NULL,
	Nome VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Ender VARCHAR(100) NOT NULL,
	Telefone1 VARCHAR(15) NOT NULL,
	Telefone2 VARCHAR(15),
	constraint pk_fornecedor primary key (CNPJ),
	constraint uk_email_fornecedor unique (Email)
);

INSERT INTO Fornecedor (CNPJ, Nome, Email, Ender, Telefone1, Telefone2) VALUES (1357913579, 'Futura Tintas SA', 'vendas@futura.com', 'Rua Maravilha, 265-d, Efapi', '9122222', '9213467');
INSERT INTO Fornecedor (CNPJ, Nome, Email, Ender, Telefone1) VALUES (9753197531, 'Coral Tinta LTDA', 'vendas@coral.com', 'Avenida Senador Atilio Fontana', '91243453');

CREATE TABLE Tinta (
	COD varchar(15),
	Nome VARCHAR(20) NOT NULL,
	Base VARCHAR(4) NOT NULL,
	Litragem REAL NOT NULL,
	CNPJ BIGINT NOT NULL,
	constraint pk_tinta primary key (COD),
	constraint fk_tinta_fornecedor foreign key (CNPJ) references Fornecedor(CNPJ)
);

INSERT INTO Tinta (COD, Nome, Base, Litragem, CNPJ) VALUES ('ABC123', 'Azul Marinho', 'A', 3.6, 1357913579);

CREATE TABLE Composicao (
	ID INTEGER NOT NULL,
	COD varchar(15),
	Qtd INTEGER NOT NULL,
	constraint pk_composicao primary key (ID, COD),
	constraint fk_composicao_venda foreign key (ID) references Venda(ID),
	constraint fk_composicao_tinta foreign key (COD) references Tinta(COD)
);

INSERT INTO Composicao (ID, COD, Qtd) VALUES (1,'ABC123',3);
