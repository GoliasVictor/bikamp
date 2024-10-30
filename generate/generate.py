from math import ceil
import random
import datetime
from datetime import timedelta
random.seed(0)
ciclistas = [149327, 172374, 254294, 194390, 208217, 204122, 238431, 131942, 217960, 128361, 291702, 113019, 119676, 168844, 178583, 189853, 292769, 249784, 125372, 280514, 134085, 186313, 203722, 166350, 267730, 184791, 134638, 104431, 183805, 193534];


bicicletas = [i for i in range(1, 31)]

bicicletarios =  [i for i in range(1, 10)]

pontos = [
	(1, 1, 'online', 15),
	(2, 1, 'online', 20	),
	(3, 1, 'manutencao', None),
	(4, 1, 'online', 2),
	(5, 1, 'online', None),
	(6, 1, 'online', 17),
	(7, 1, 'manutencao', None),
	(8, 1, 'online', 23),
	(9, 1, 'online', 22),
	(10, 1, 'online', None),
	(1, 2, 'online', 19),
	(3, 2, 'online', 10),
	(4, 2, 'online', 26),
	(1, 3, 'online', 9),
	(2, 3, 'online', None),
	(3, 3, 'manutencao', None),
	(4, 3, 'online', 24),
	(5, 3, 'online', None),
	(1, 4, 'manutencao', None),
	(2, 4, 'online', 12),
	(3, 4, 'online', None),
	(4, 4, 'online', 3),
	(5, 4, 'online', None),
	(1, 5, 'online', 8),
	(2, 5, 'manutencao', None),
	(3, 5, 'online', None),
	(1, 6, 'online', 21),
	(2, 6, 'manutencao', None),
	(3, 6, 'online', 7),
	(4, 6, 'online', 28),
	(5, 6, 'manutencao', None),
	(1, 7, 'online', 1),
	(2, 7, 'online', None),
	(3, 7, 'online', 5),
	(4, 7, 'online', None),
	(5, 7, 'manutencao', None),
	(1, 8, 'online', 13),
	(2, 8, 'manutencao', None),
	(3, 8, 'online', 29),
	(4, 8, 'online', 18),
	(5, 8, 'online', None),
	(1, 9, 'manutencao', None),
	(2, 9, 'online', 25),
	(3, 9, 'online', 6),
	(4, 9, 'online', 16),
	(5, 9, 'online', 14)

]

emprestimos = []
start = datetime.datetime(2024, 6, 1)
for ciclista in ciclistas:
	q = abs(ceil(random.gauss(0,2.5)))
	if q <= 0:
		q = 1
	for i in range(q):
		inicio = start + timedelta(minutes=random.randint(0, 2160*60))
		has_end = random.random() <= 0.9
		fim =  inicio + timedelta(minutes=random.randint(0, 600))
		str_fim = f"'{fim.strftime('%Y-%m-%d %H:%M:%S')}'" if has_end else 'NULL'
		
		devolvido = random.choice(bicicletarios)
		emprestimos.append((
			ciclista, 
			f"'{inicio.strftime('%Y-%m-%d %H:%M:%S')}'" ,
			str_fim,
			random.choice(bicicletarios),
			( devolvido if has_end else 'NULL'),
			random.choice(bicicletas)
		))


penalidades  = []


print("INSERT INTO emprestimo (ciclista_ra, emprestimo_inicio, emprestimo_fim, bicicletario_id_tirado, bicicletario_id_devolvido, bicicleta_id) VALUES")
for emp in emprestimos:
	print("(",end="")
	print(*emp, sep=", ", end="),\n")