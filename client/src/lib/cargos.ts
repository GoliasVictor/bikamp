
export enum CargoEnum {
  Supervisor = 1, 
  Reparador = 2,
  Administrador = 3, 
  Demitido = 4
}

let StringCargo: [CargoEnum, string][] = [
	[CargoEnum.Supervisor, "Supervisor"],
	[CargoEnum.Reparador, "Reparador"],
	[CargoEnum.Administrador, "Administrador"],
	[CargoEnum.Demitido, "Demitido"]
]
export function allCargos(): [CargoEnum, string][] {
  return StringCargo;
}
export function cargoToString(cargo : CargoEnum): string {
  const statusString = StringCargo.find(([cargo_id]) => cargo_id === cargo);
  return statusString ? statusString[1] : "Desconhecido";
}

export default {
  CargoEnum,
  allCargos,
  cargoToString
}