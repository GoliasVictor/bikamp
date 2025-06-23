
export enum StatusBicicletaEnum {
	Ativada = 1,
	Desativada = 2,
	Manutencao = 3,
	Perdida = 4,
	Removida = 5
}

let StringStatusBicicleta: [StatusBicicletaEnum, string][] = [
	[StatusBicicletaEnum.Ativada, "Ativada"],
	[StatusBicicletaEnum.Desativada, "Desativada"],
	[StatusBicicletaEnum.Manutencao, "Em manutencao"],
	[StatusBicicletaEnum.Perdida, "Perdida"],
	[StatusBicicletaEnum.Removida, "Removida"],
]
export class StatusBicicleta {
	private status: StatusBicicletaEnum;

	constructor(status: StatusBicicletaEnum) {
		this.status = status;
	}


	toString(): string {
		const statusString = StringStatusBicicleta.find(([status]) => status === this.status);
		return statusString ? statusString[1] : "Desconhecido";
	}
	static allStatuses(): [StatusBicicletaEnum, string][] {
		return StringStatusBicicleta;
	}
}