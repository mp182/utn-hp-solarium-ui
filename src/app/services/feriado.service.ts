import { BaseABMService } from './base-abm.service';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { Feriado } from '../Models/feriado.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeriadoService extends BaseABMService {

  public endpoint = 'feriados';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
  }

  getFeriados(): Observable<Feriado[]> {
    return this.apiService.get<Feriado[]>('feriados');
  }

}
