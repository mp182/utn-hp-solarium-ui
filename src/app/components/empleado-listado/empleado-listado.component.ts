import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Empleado } from 'src/app/Models/empleado.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-listado',
  templateUrl: './empleado-listado.component.html',
  styleUrls: ['./empleado-listado.component.css']
})
export class EmpleadoListadoComponent implements OnInit {

  empleados$: Observable<Empleado[]>;
  columnsToDisplay = ['nombre', 'apellido', 'email', 'telefono', 'acciones'];

  constructor(
    private empleadoService: EmpleadoService) { }

  ngOnInit() {
    this.empleados$ = this.empleadoService.getAll().pipe(
      tap(
        empleados => {
          empleados.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        }
      )
    );
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el empleado?')) {
      this.empleadoService.delete(id).subscribe();
    }
  }

}
