import { Cliente } from './cliente.interface';
import { Servicio } from './servicio.interface';

export interface Turno {
  id: number;
  fecha_turno: Date;
  fecha_fin: Date;
  turno_concretado: boolean;
  id_cliente: number;
  cliente: Cliente;
  id_servicio: number;
  servicio: Servicio;
  created_at: string;
  updated_at: string;
  laravel_through_key?: number;
}
