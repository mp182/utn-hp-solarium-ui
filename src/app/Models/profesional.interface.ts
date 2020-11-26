export interface Profesional {
  id: number;
  nombre: string;
  tipo: string;
  horarios: HorarioProfesional[];
}

export interface HorarioProfesional {
  id: number;
  id_personal: number;
  dia: number;
  hora_entrada: string;
  hora_salida: string;
}
