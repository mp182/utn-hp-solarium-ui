import { Component, OnInit } from '@angular/core';
import { Maquina } from 'src/app/Models/maquina.interface';
import { MaquinaService } from 'src/app/services/maquina.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-maquina-listado',
  templateUrl: './maquina-listado.component.html',
  styleUrls: ['./maquina-listado.component.css']
})
export class MaquinaListadoComponent implements OnInit {

  maquinas$: Observable<Maquina[]>;
  columnsToDisplay = ['nombre', 'descripcion', 'fecha_compra', 'cantidad_usos', 'acciones'];

  constructor(private maquinaService: MaquinaService) { }

  ngOnInit() {
    this.maquinas$ = this.maquinaService.getAll().pipe(
      tap(
        maquinas => {
          maquinas.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        }
      )
    );
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar la máquina?')) {
      this.maquinaService.delete(id).subscribe();
    }
  }

}
