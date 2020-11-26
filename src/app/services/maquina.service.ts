import { NotificationService } from 'src/app/services/notification.service';
import { BaseABMService } from './base-abm.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Maquina } from '../Models/maquina.interface';

@Injectable({
  providedIn: 'root'
})
export class MaquinaService extends BaseABMService {

  public endpoint = 'maquinas';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
  }

  getMaquinas(): Observable<Maquina[]> {
    return this.apiService.get<Maquina[]>('maquinas');
  }

}
