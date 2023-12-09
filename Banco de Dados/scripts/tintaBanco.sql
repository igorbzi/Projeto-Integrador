CREATE DATABASE sistema;
\c sistema

CREATE TABLE Funcionario (
	CPFF INTEGER NOT NULL,
	Nome VARCHAR(50) NOT NULL,
	Email VARCHAR(50) UNIQUE NOT NULL,
	Senha VARCHAR(40) NOT NULL,
	TipoUsu INTEGER NOT NULL,
	constraint pk_funcionario primary key (CPFF)
);

INSERT INTO Funcionario(CPFF, Nome, Email, Senha, TipoUsu) VALUES (12345678, 'Mario', 'Mario@gmail.com', 'senha123', 1);

CREATE TABLE Cliente (
	CPFC INTEGER NOT NULL,
	Nome VARCHAR(50) NOT NULL,
	Email VARCHAR(50) UNIQUE NOT NULL,
	Ender VARCHAR(100) NOT NULL,
	Telefone1 VARCHAR(15) NOT NULL,
	Telefone2 VARCHAR(15),
	constraint pk_cliente primary key (CPFC)
);

INSERT INTO Cliente(CPFC, Nome, Email, Ender, Telefone1, Telefone2) VALUES (54321, 'Joao', 'joao@gmail.com', 'Rua abcd', '99876543', '98737232');
INSERT INTO Cliente(CPFC, Nome, Email, Ender, Telefone1) VALUES (987654, 'Jorge', 'jorge@gmail.com', 'Rua zxy', '93423946');

CREATE TABLE Venda (
	ID SERIAL NOT NULL,
	CPFF INTEGER NOT NULL,
	CPFC INTEGER REFERENCES Cliente(CPFC) NOT NULL,
	Data DATE NOT NULL,
	constraint pk_venda primary key (ID),
	constraint fk_venda_funcionario foreign key (CPFF) references Funcionario(CPFF),
	constraint fk_venda_cliente foreign key (CPFC) references Cliente(CPFC)
);

INSERT INTO Venda (CPFF, CPFC, Data) VALUES (12345678, 54321, '12-03-2004');

CREATE TABLE Fornecedor (
	CNPJ INTEGER NOT NULL,
	Nome VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Ender VARCHAR(100) NOT NULL,
	Telefone1 VARCHAR(15) NOT NULL,
	Telefone2 VARCHAR(15),
	constraint pk_fornecedor primary key (CNPJ),
	constraint uk_email_fornecedor unique (Email)
);

INSERT INTO Fornecedor (CNPJ, Nome, Email, Ender, Telefone1, Telefone2) VALUES (13579, 'Tintas123', 'tintas123@gmail.com', 'rua das tintas', '9122222', '9213467');
INSERT INTO Fornecedor (CNPJ, Nome, Email, Ender, Telefone1) VALUES (97531, 'Tintas de pimenta', 'pimenta123@gmail.com', 'rua da pimenta', '91243453');

CREATE TABLE Tinta (
	COD INTEGER NOT NULL,
	Nome VARCHAR(20) NOT NULL,
	Base VARCHAR(4) NOT NULL,
	Litragem REAL NOT NULL,
	CNPJ INTEGER NOT NULL,
	constraint pk_tinta primary key (COD),
	constraint fk_tinta_fornecedor foreign key (CNPJ) references Fornecedor(CNPJ)
);

INSERT INTO Tinta (COD, Nome, Base, Litragem, CNPJ) VALUES (123, 'tinta Com Cor', 'nsei', 4.4, 13579);

CREATE TABLE Composicao (
	ID INTEGER NOT NULL,
	COD INTEGER NOT NULL,
	Qtd INTEGER NOT NULL,
	constraint pk_composicao primary key (ID, COD),
	constraint fk_composicao_venda foreign key (ID) references Venda(ID),
	constraint fk_composicao_tinta foreign key (COD) references Tinta(COD)
);

INSERT INTO Composicao (ID, COD, Qtd) VALUES (1,123,3);
