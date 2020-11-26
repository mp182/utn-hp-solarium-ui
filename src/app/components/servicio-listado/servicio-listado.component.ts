import { Component, OnInit } from '@angular/core';
import { Servicio } from 'src/app/Models/servicio.interface';
import { Observable } from 'rxjs';
import { ServicioService } from 'src/app/services/servicio.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-servicio-listado',
  templateUrl: './servicio-listado.component.html',
  styleUrls: ['./servicio-listado.component.css']
})
export class ServicioListadoComponent implements OnInit {

  servicios$: Observable<Servicio[]>;
  columnsToDisplay = ['nombre', 'descripcion', 'acciones'];

  constructor(private servicioService: ServicioService) { }

  ngOnInit() {
    this.servicios$ = this.servicioService.getAll().pipe(
      tap(
        (servicios: Servicio[]) => {
          servicios.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        }
      )
    );
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el servicio?')) {
      this.servicioService.delete(id).subscribe();
    }
  }

}
