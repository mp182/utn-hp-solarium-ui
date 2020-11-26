import { Injectable } from '@angular/core';
import { BaseABMService } from './base-abm.service';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { Empleado } from '../Models/empleado.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService extends BaseABMService {

  public endpoint = 'personal';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
  }

  getEmpleados(): Observable<Empleado[]> {
    return this.apiService.get<Empleado[]>('empleados');
  }

  searchEmpleados(busqueda: string): Observable<Empleado[]> {
    busqueda = busqueda.trim();
    return this.apiService.get<Empleado[]>('personal', { s: busqueda });
  }
}
