import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Turno } from '../Models/turno.interface';
import { BaseABMService } from './base-abm.service';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService extends BaseABMService {

  public endpoint = 'turnos';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService
  ) {
    super();
  }

  getTurnos(): Observable<Turno[]> {
    return this.apiService.get<Turno[]>('turnos');
  }

  public getTurnosByServicio(servicioId) {
    return this.apiService.get<Turno[]>('servicios/' + servicioId + '/turnos');
  }

  public getTurnosByMaquina(maquinaId) {
    return this.apiService.get<Turno[]>('maquinas/' + maquinaId + '/turnos');
  }

  public getTurnosByCliente(clienteId) {
    return this.apiService.get<Turno[]>('clientes/' + clienteId + '/turnos');
  }

  public addTurno(fecha, servicioId, clienteId) {
    return this.apiService.post<Turno>('turnos', { fecha_turno: fecha, id_cliente: clienteId, id_servicio: servicioId });
  }

  onDelete(id, result) {
    if (result.deleted) {
      this.notification.message('Eliminado correctamente');
    }
  }

}
