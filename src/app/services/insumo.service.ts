import { Injectable } from '@angular/core';
import { BaseABMService } from './base-abm.service';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class InsumoService extends BaseABMService {

  public endpoint = 'insumos';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
  }

}
