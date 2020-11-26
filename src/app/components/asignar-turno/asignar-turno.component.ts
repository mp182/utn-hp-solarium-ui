import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';
import { Servicio } from 'src/app/Models/servicio.interface';
import { ServicioService } from 'src/app/services/servicio.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-asignar-turno',
  templateUrl: './asignar-turno.component.html',
  styleUrls: ['./asignar-turno.component.css']
})
export class AsignarTurnoComponent implements OnInit {

  servicioControl = new FormControl('', Validators.required);

  @Input() clientId: number;
  servicios$: Observable<Servicio[]>;

  constructor(
    private router: Router,
    private servicioService: ServicioService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.servicios$ = this.servicioService.getServicios().pipe(
      tap(
        (servicios: Servicio[]) => {
          servicios.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        },
        (error) => {
          this.notification.error(error);
        }
      )
    );
  }

  verTurnos() {
    const params: any = { clientId: this.clientId, servicioId: this.servicioControl.value };
    this.router.navigate(['solarium/calendario', params]);
  }

}
