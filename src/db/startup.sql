drop schema if exists bikamp;
create schema bikamp;
use bikamp;
CREATE TABLE cargo (
	cargo_id INT NOT NULL PRIMARY KEY,
	cargo_nome VARCHAR(150) NOT NULL
);

CREATE TABLE mantenedor (
	mantenedor_id INT NOT NULL PRIMARY KEY,
	cargo_id INT NOT NULL,
	nome VARCHAR(150) NOT NULL,
	FOREIGN KEY (cargo_id) REFERENCES cargo(cargo_id)
);

CREATE TABLE tipo_penalidade (
	tipo_penalidade_id INT NOT NULL PRIMARY KEY,
	nome VARCHAR(150) NOT NULL,
	descricao TEXT NOT NULL
);

CREATE TABLE ciclista (
	ciclista_ra INT NOT NULL PRIMARY KEY
);
CREATE TABLE bicicletario (
	bicicletario_id INT NOT NULL PRIMARY KEY,
	localizacao_latitude DOUBLE NOT NULL,
	localizacao_longitude DOUBLE NOT NULL
);
CREATE TABLE bicicleta (
	bicicleta_id INT NOT NULL PRIMARY KEY,
	status VARCHAR(45) NOT NULL
);

CREATE TABLE ponto (
	ponto_id INT NOT NULL,
	bicicletario_id INT NOT NULL,
	status VARCHAR(45) NOT NULL,
	bicicleta_id INT,
	UNIQUE(bicicleta_id),
	PRIMARY KEY(ponto_id, bicicletario_id),
	FOREIGN KEY (bicicletario_id) REFERENCES bicicletario(bicicletario_id),
	FOREIGN KEY (bicicleta_id) REFERENCES bicicleta(bicicleta_id)
);

CREATE TABLE emprestimo (
	ciclista_ra INT NOT NULL,
	emprestimo_inicio DATETIME NOT NULL,
	emprestimo_fim DATETIME NULL,
	bicicletario_id_tirado INT NOT NULL,
	bicicletario_id_devolvido INT NULL,
	bicicleta_id INT NOT NULL,
	cancelado BOOL NOT NULL DEFAULT FALSE,
	PRIMARY KEY (ciclista_ra, emprestimo_inicio),
	FOREIGN KEY (ciclista_ra) REFERENCES ciclista(ciclista_ra),
	FOREIGN KEY (bicicletario_id_tirado) REFERENCES bicicletario(bicicletario_id),
	FOREIGN KEY (bicicletario_id_devolvido) REFERENCES bicicletario(bicicletario_id),
	FOREIGN KEY (bicicleta_id) REFERENCES bicicleta(bicicleta_id)
);

CREATE TABLE penalidade (
	penalidade_inicio DATETIME NOT NULL,
	ciclista_ra INT NOT NULL,
	emprestimo_inicio DATETIME NOT NULL,
	tipo_penalidade_id INT NOT NULL,
	penalidade_automatica BOOL NOT NULL,
	penalidade_fim DATETIME NULL,
	detalhes TEXT NULL,
	mantenedor_id_aplicador INT NULL,
	mantenedor_id_perdoador INT NULL,
	motivacao_perdao TEXT NULL,
	PRIMARY KEY (ciclista_ra, penalidade_inicio, emprestimo_inicio),
	FOREIGN KEY (ciclista_ra) REFERENCES ciclista(ciclista_ra),
	FOREIGN KEY (ciclista_ra, emprestimo_inicio) REFERENCES emprestimo(ciclista_ra, emprestimo_inicio),
	FOREIGN KEY (tipo_penalidade_id) REFERENCES tipo_penalidade(tipo_penalidade_id),
	FOREIGN KEY (mantenedor_id_aplicador) REFERENCES mantenedor(mantenedor_id),
	FOREIGN KEY (mantenedor_id_perdoador) REFERENCES mantenedor(mantenedor_id)
);
