import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Cliente } from '../Models/cliente.interface';
import { Observable } from 'rxjs';
import { BaseABMService } from './base-abm.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseABMService {

  public endpoint = 'clientes';

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
  }

  searchClients(busqueda: string): Observable<Cliente[]> {
    busqueda = busqueda.trim();
    return this.apiService.get<Cliente[]>('clientes', { s: busqueda });
  }

  getClient(clienteId: number): Observable<Cliente> {
    return this.apiService.get<Cliente>(`clientes/${clienteId}`);
  }
}
