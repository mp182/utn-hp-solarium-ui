import { Empleado } from './empleado.interface';
import { Rol } from './rol.interface';

export interface Usuario {
  id: number;
  usuario: string;
  id_rol: number;
  id_personal?: number;
  rol: Rol;
  personal?: Empleado;
}
