import { Component, OnInit } from '@angular/core';
import { Feriado } from '../../Models/feriado.interface';
import { Observable } from 'rxjs';
import { FeriadoService } from 'src/app/services/feriado.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-feriados-listado',
  templateUrl: './feriados-listado.component.html',
  styleUrls: ['./feriados-listado.component.css']
})
export class FeriadosListadoComponent implements OnInit {

  feriados$: Observable<Feriado[]>;
  columnsToDisplay = ['fecha', 'nombre', 'acciones'];

  constructor(private feriadoService: FeriadoService) { }

  ngOnInit() {
    this.feriados$ = this.feriadoService.getAll().pipe(
      tap(
        (feriados: Feriado[]) => {
          feriados.sort((a, b) => a.fecha > b.fecha ? -1 : 1);
        }
      )
    );
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el feriado?')) {
      this.feriadoService.delete(id).subscribe();
    }
  }

}
