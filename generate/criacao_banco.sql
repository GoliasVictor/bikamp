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
	coordenada POINT NOT NULL
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
	PRIMARY KEY (ciclista_ra, penalidade_inicio),
	FOREIGN KEY (ciclista_ra) REFERENCES ciclista(ciclista_ra),
	FOREIGN KEY (ciclista_ra, emprestimo_inicio) REFERENCES emprestimo(ciclista_ra, emprestimo_inicio),
	FOREIGN KEY (tipo_penalidade_id) REFERENCES tipo_penalidade(tipo_penalidade_id),
	FOREIGN KEY (mantenedor_id_aplicador) REFERENCES mantenedor(mantenedor_id),
	FOREIGN KEY (mantenedor_id_perdoador) REFERENCES mantenedor(mantenedor_id)
);

INSERT INTO ciclista (ciclista_ra)
VALUES 
	(223234), 
	(258053), 
	(231943), 
	(121865), 
	(124429), 
	(113683), 
	(120340), 
	(205333), 
	(221209), 
	(149529), 
	(132637), 
	(108061), 
	(220191), 
	(154660), 
	(112676), 
	(238633), 
	(124460), 
	(105008), 
	(283193), 
	(100413), 
	(117823), 
	(282696), 
	(120913), 
	(149075), 
	(181335), 
	(196186), 
	(150625), 
	(259170), 
	(131682), 
	(280679), 
	(158824), 
	(252020), 
	(162421), 
	(128117), 
	(257143), 
	(193141), 
	(162946), 
	(145031), 
	(256663), 
	(297627), 
	(122013), 
	(201373), 
	(120995), 
	(282789), 
	(223401), 
	(151222), 
	(187062), 
	(203966), 
	(139459), 
	(291012), 
	(104648), 
	(270026), 
	(229091), 
	(292580), 
	(121063), 
	(241901), 
	(231663), 
	(100592), 
	(256754), 
	(171764), 
	(261369), 
	(113410), 
	(100612), 
	(174344), 
	(176404), 
	(223522), 
	(160552), 
	(247595), 
	(172346), 
	(137540), 
	(149327), 
	(172374), 
	(254294), 
	(194390), 
	(208217), 
	(204122), 
	(238431), 
	(131942), 
	(217960), 
	(128361), 
	(291702), 
	(113019), 
	(119676), 
	(168844), 
	(178583), 
	(189853), 
	(292769), 
	(249784), 
	(125372), 
	(280514), 
	(134085), 
	(186313), 
	(203722), 
	(166350), 
	(267730), 
	(184791), 
	(134638), 
	(104431), 
	(183805), 
	(193534);

INSERT INTO bicicletario(bicicletario_id, coordenada) 
	VALUES
	(1, POINT(-22.817211680221867, -47.06942629085897)),
	(2, POINT(-22.817573574609597, -47.0717919189259)),
	(3, POINT(-22.813815589796796, -47.064533037722676)),
	(4, POINT(-22.81338814029543, -47.06931123831943)),
	(5, POINT(-22.820737998354147, -47.06618916056743)),
	(6, POINT(-22.822308245092458, -47.065291599421144)),
	(7, POINT(-22.816616616704753, -47.064045830142184)),
	(8, POINT(-22.816675924445583, -47.07149291244727)),
	(9, POINT(-22.815289772859778, -47.069309609117404));

INSERT INTO bicicleta (bicicleta_id, status)
VALUES 
(1, 'ativada'),
(2, 'ativada'),
(3, 'desativada'),
(4, 'manutencao'),
(5, 'ativada'),
(6, 'ativada'),
(7, 'desativada'),
(8, 'ativada'),
(9, 'ativada'),
(10, 'ativada'),
(11, 'desativada'),
(12, 'ativada'),
(13, 'ativada'),
(14, 'ativada'),
(15, 'desativada'),
(16, 'ativada'),
(17, 'ativada'),
(18, 'ativada'),
(19, 'manutencao'),
(20, 'ativada'),
(21, 'ativada'),
(22, 'ativada'),
(23, 'ativada'),
(24, 'desativada'),
(25, 'ativada'),
(26, 'ativada'),
(27, 'desativada'),
(28, 'ativada'),
(29, 'ativada'),
(30, 'manutencao');


INSERT INTO ponto (ponto_id, bicicletario_id, status, bicicleta_id)
VALUES 
	-- Bicicletário 1 (10 pontos)
	(1, 1, 'online', 15),
	(2, 1, 'online', 20	),
	(3, 1, 'manutencao', NULL),
	(4, 1, 'online', 2),
	(5, 1, 'online', NULL),
	(6, 1, 'online', 17),
	(7, 1, 'manutencao', NULL),
	(8, 1, 'online', 23),
	(9, 1, 'online', 22),
	(10, 1, 'online', NULL),

	-- Bicicletário 2 (4 pontos)
	(1, 2, 'online', 19),
	(2, 2, 'manutencao', NULL),
	(3, 2, 'online', 10),
	(4, 2, 'online', 26),

	-- Bicicletário 3 (5 pontos)
	(1, 3, 'online', 9),
	(2, 3, 'online', NULL),
	(3, 3, 'manutencao', NULL),
	(4, 3, 'online', 24),
	(5, 3, 'online', NULL),

	-- Bicicletário 4 (5 pontos)
	(1, 4, 'manutencao', NULL),
	(2, 4, 'online', 12),
	(3, 4, 'online', NULL),
	(4, 4, 'online', 3),
	(5, 4, 'online', NULL),

	-- Bicicletário 5 (3 pontos)
	(1, 5, 'online', 8),
	(2, 5, 'manutencao', NULL),
	(3, 5, 'online', NULL),

	-- Bicicletário 6 (5 pontos)
	(1, 6, 'online', 21),
	(2, 6, 'manutencao', NULL),
	(3, 6, 'online', 7),
	(4, 6, 'online', 28),
	(5, 6, 'manutencao', NULL),

	-- Bicicletário 7 (5 pontos)
	(1, 7, 'online', 1),
	(2, 7, 'online', NULL),
	(3, 7, 'online', 5),
	(4, 7, 'online', NULL),
	(5, 7, 'manutencao', NULL),

	-- Bicicletário 8 (5 pontos)
	(1, 8, 'online', 13),
	(2, 8, 'manutencao', NULL),
	(3, 8, 'online', 29),
	(4, 8, 'online', 18),
	(5, 8, 'online', NULL),

	-- Bicicletário 9 (5 pontos)
	(1, 9, 'manutencao', NULL),
	(2, 9, 'online', 25),
	(3, 9, 'online', 6),
	(4, 9, 'online', 16),
	(5, 9, 'online', 14);
    
    
 

INSERT INTO emprestimo (ciclista_ra, emprestimo_inicio, emprestimo_fim, bicicletario_id_tirado, bicicletario_id_devolvido, bicicleta_id) VALUES
(149327, '2024-07-09 06:45:00', '2024-07-09 15:28:00', 7, 8, 30),
(149327, '2024-08-11 08:14:00', '2024-08-11 16:22:00', 4, 6, 17),
(149327, '2024-06-13 16:14:00', '2024-06-13 17:51:00', 9, 5, 23),
(172374, '2024-08-13 17:56:00', '2024-08-13 20:26:00', 2, 5, 24),
(172374, '2024-06-07 17:05:00', '2024-06-07 22:43:00', 9, 8, 4),
(172374, '2024-07-03 04:52:00', '2024-07-03 08:21:00', 8, 9, 15),
(254294, '2024-08-13 06:36:00', NULL, 7, NULL, 23),
(254294, '2024-08-15 01:54:00', '2024-08-15 01:55:00', 6, 8, 8),
(194390, '2024-08-06 11:19:00', '2024-08-06 12:23:00', 4, 4, 8),
(208217, '2024-07-20 10:10:00', '2024-07-20 11:32:00', 9, 6, 30),
(204122, '2024-07-15 12:51:00', '2024-07-15 22:15:00', 2, 5, 18),
(238431, '2024-06-19 11:54:00', NULL, 8, NULL, 3),
(238431, '2024-07-25 06:36:00', '2024-07-25 12:00:00', 5, 4, 6),
(131942, '2024-06-18 05:43:00', '2024-06-18 06:16:00', 8, 5, 3),
(131942, '2024-06-09 04:13:00', '2024-06-09 06:26:00', 1, 3, 27),
(131942, '2024-06-08 07:18:00', '2024-06-08 16:31:00', 9, 7, 9),
(131942, '2024-07-18 11:52:00', '2024-07-18 15:32:00', 5, 7, 15),
(131942, '2024-07-15 20:13:00', '2024-07-16 02:18:00', 6, 2, 20),
(217960, '2024-07-01 12:24:00', '2024-07-01 16:32:00', 5, 1, 4),
(217960, '2024-08-04 04:49:00', '2024-08-04 07:43:00', 7, 6, 27),
(217960, '2024-06-06 15:51:00', '2024-06-06 18:20:00', 1, 4, 27),
(128361, '2024-07-23 05:37:00', '2024-07-23 14:44:00', 1, 2, 4),
(128361, '2024-07-28 19:10:00', '2024-07-29 04:59:00', 7, 2, 3),
(128361, '2024-07-04 16:34:00', '2024-07-04 18:32:00', 1, 1, 7),
(291702, '2024-06-12 06:39:00', '2024-06-12 07:41:00', 9, 1, 14),
(291702, '2024-07-27 11:43:00', '2024-07-27 16:09:00', 4, 2, 3),
(113019, '2024-07-29 21:13:00', '2024-07-30 04:39:00', 1, 3, 17),
(119676, '2024-08-03 15:41:00', NULL, 6, NULL, 29),
(119676, '2024-08-06 14:12:00', '2024-08-06 23:55:00', 4, 3, 25),
(119676, '2024-06-06 06:48:00', '2024-06-06 09:30:00', 6, 3, 17),
(168844, '2024-06-23 19:38:00', '2024-06-24 03:10:00', 1, 3, 16),
(178583, '2024-08-19 15:02:00', '2024-08-19 20:20:00', 7, 6, 27),
(178583, '2024-07-30 20:35:00', '2024-07-31 06:09:00', 8, 1, 24),
(189853, '2024-06-08 04:44:00', '2024-06-08 05:30:00', 5, 9, 5),
(189853, '2024-06-22 20:34:00', '2024-06-23 04:47:00', 5, 6, 22),
(189853, '2024-07-03 16:41:00', '2024-07-03 18:56:00', 7, 5, 24),
(189853, '2024-07-08 17:18:00', '2024-07-08 18:40:00', 4, 1, 23),
(292769, '2024-07-29 00:25:00', '2024-07-29 10:06:00', 1, 7, 13),
(249784, '2024-08-19 08:13:00', '2024-08-19 15:21:00', 3, 1, 15),
(249784, '2024-06-06 19:33:00', '2024-06-06 22:14:00', 9, 8, 29),
(125372, '2024-08-08 18:22:00', '2024-08-08 19:01:00', 6, 8, 10),
(125372, '2024-08-16 06:03:00', '2024-08-16 13:08:00', 9, 4, 21),
(125372, '2024-08-29 01:43:00', '2024-08-29 03:56:00', 7, 1, 22),
(280514, '2024-07-09 00:00:00', '2024-07-09 03:38:00', 1, 1, 27),
(134085, '2024-06-18 08:03:00', '2024-06-18 11:26:00', 5, 5, 23),
(186313, '2024-08-29 01:35:00', '2024-08-29 09:42:00', 2, 7, 1),
(186313, '2024-06-26 00:07:00', NULL, 3, NULL, 21),
(186313, '2024-07-18 09:50:00', '2024-07-18 15:45:00', 3, 2, 9),
(203722, '2024-06-19 17:26:00', '2024-06-20 02:57:00', 6, 6, 19),
(166350, '2024-08-22 19:36:00', '2024-08-23 04:02:00', 7, 8, 12),
(267730, '2024-07-05 04:27:00', '2024-07-05 04:36:00', 3, 3, 9),
(267730, '2024-07-01 08:20:00', '2024-07-01 14:36:00', 6, 2, 25),
(184791, '2024-07-27 11:35:00', '2024-07-27 16:11:00', 3, 3, 19),
(134638, '2024-07-20 22:10:00', '2024-07-21 00:07:00', 4, 8, 30),
(104431, '2024-06-05 09:25:00', '2024-06-05 18:20:00', 5, 2, 13),
(104431, '2024-08-16 01:18:00', '2024-08-16 08:22:00', 2, 2, 18),
(104431, '2024-08-22 16:59:00', '2024-08-22 22:44:00', 2, 6, 16),
(183805, '2024-06-04 10:37:00', '2024-06-04 13:16:00', 7, 3, 26),
(183805, '2024-08-28 16:57:00', NULL, 2, NULL, 7),
(183805, '2024-08-08 06:06:00', '2024-08-08 12:40:00', 2, 1, 13),
(193534, '2024-07-21 15:38:00', '2024-07-21 23:17:00', 4, 8, 14),
(193534, '2024-06-08 14:45:00', '2024-06-08 19:12:00', 7, 3, 7);




# SELECT e1.*,e2.*
# FROM emprestimo e1
# join emprestimo e2
#     on (e1.ciclista_ra = e2.ciclista_ra and e1.bicicleta_id != e2.bicicleta_id)
#    and e1.emprestimo_inicio < e2.emprestimo_fim
#    AND e2.emprestimo_inicio < e1.emprestimo_fim;
        
        