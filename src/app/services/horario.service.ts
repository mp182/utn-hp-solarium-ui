import { tap, catchError } from 'rxjs/operators';
import { Horarios } from './../Models/horarios.interface';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { BaseABMService } from './base-abm.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class HorarioService extends BaseABMService {

  horarios: Horarios;
  horarios$: Observable<Horarios>;

  constructor(
    public apiService: ApiService,
    public notification: NotificationService) {
    super();
    this.horarios$ = this.apiService.get<Horarios>('horarios').pipe(
      tap(data => {
        this.horarios = data;
      })
    );
  }

  loadData() {
    this.horarios$.subscribe();
  }

  getHorarios(): Observable<Horarios> {
    if (this.horarios) {
      return of(this.horarios);
    }
    else {
      return this.horarios$;
    }
  }

  updateHorarios(horarios) {
    return this.apiService.put('horarios', horarios).pipe(
      catchError(
        (err) => this.onError(err)
      ),
      tap(
        (val: any) => {
          if (val) {
            this.horarios = val;
            this.notification.message('Actualizado correctamente');
          }
        }
      )
    );
  }

}
