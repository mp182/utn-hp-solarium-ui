import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../Models/servicio.interface';
import { BaseABMService } from './base-abm.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService extends BaseABMService {

  public endpoint = 'servicios';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
  }

  getServicios(): Observable<Servicio[]> {
    return this.apiService.get<Servicio[]>('servicios');
  }

  getServiciosByMaquina(maquinaId: number) {
    return this.apiService.get<Servicio[]>(`maquinas/${maquinaId}/servicios`);
  }

  getServicio(servicioId: number) {
    return this.apiService.get<Servicio>(`servicios/${servicioId}`);
  }

}
