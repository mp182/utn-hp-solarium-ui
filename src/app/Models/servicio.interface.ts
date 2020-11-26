import { Profesional } from './profesional.interface';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  id_maquina?: number;
  id_personal?: number;
  personal?: Profesional;
  created_at: string;
  updated_at: string;
  insumos?: any[];
}
