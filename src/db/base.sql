-- Tipos de penalidade
INSERT INTO tipo_penalidade (tipo_penalidade_id, nome, descricao) VALUES
	(1, 'Atraso na devolução', 'O aluno atrasou a devolução da bicicleta, sendo aplicada uma multa ou suspensão.'),
	(2, 'Não devolução da bicicleta', 'O aluno não devolveu a bicicleta, resultando em bloqueio e multa.'),
	(3, 'Danos à bicicleta', 'O aluno causou danos à bicicleta e será responsável pelos reparos.'),
	(4, 'Uso inadequado', 'Uso da bicicleta para fins não permitidos, como transporte indevido.'),
	(5, 'Burlar o sistema de devolução', 'Tentativa de burlar o sistema para evitar a devolução.'),
	(6, 'Uso de identidade falsa', 'Uso de identidade falsa ou compartilhamento de contas, resultando em suspensão.'),
	(7, 'Devolução fora do ponto autorizado', 'A bicicleta foi devolvida em local não autorizado, acarretando penalidades.'),
	(8, 'Dano à estação de retirada ou devolução', 'O aluno danificou a estação de retirada ou devolução da bicicleta.'),
	(9, 'Uso fora dos horários permitidos', 'Uso da bicicleta fora dos horários permitidos, resultando em advertência.'),
	(10, 'Violação das regras de trânsito e segurança', 'O aluno cometeu infrações de trânsito, resultando em penalidades.'),
	(11, 'Falsificação de informações', 'O aluno inseriu informações falsas no sistema para evitar penalidades.'),
	(12, 'Uso da bicicleta para fins ilegais', 'A bicicleta foi utilizada em atividades ilegais, resultando em exclusão do sistema.');

-- Cargos
INSERT INTO cargo (cargo_id, cargo_nome) VALUES
	(1, 'Supervisor'),
	(2, 'Reparador'),
	(3, 'Administrador'),
	(4, 'Demitido');

INSERT INTO status_bicicleta (status_bicicleta_id, nome)
VALUES
	(1, 'ativada'),
	(2, 'desativada'),
	(3, 'manutencao'),
	(4, 'perdida'),
	(5, 'removida');
	
INSERT INTO status_ponto (status_ponto_id, nome)
VALUES
	(1, 'online'),
	(2, 'offline'),
	(3, 'manutencao'),
	(4, 'removido');