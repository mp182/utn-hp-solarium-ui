import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class InformesService {

  constructor(
    public apiService: ApiService,
    public notification: NotificationService
  ) { }

  getTurnosByServicio(filtros?: any): Observable<{ id_servicio: number, total: string }[]> {
    return this.apiService.get('informes/turnos', filtros);
  }

  getUsosByMaquina(filtros?: any): Observable<{ id_maquina: number, total: string }[]> {
    return this.apiService.get('informes/maquinas', filtros);
  }

}
