import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Insumo } from '../../Models/insumo.interface';
import { InsumoService } from 'src/app/services/insumo.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-insumo-listado',
  templateUrl: './insumo-listado.component.html',
  styleUrls: ['./insumo-listado.component.css']
})
export class InsumoListadoComponent implements OnInit {

  insumos$: Observable<Insumo[]>;
  columnsToDisplay = ['nombre', 'descripcion', 'stock', 'stock_minimo', 'acciones'];

  constructor(private insumoService: InsumoService) { }

  ngOnInit() {
    this.insumos$ = this.insumoService.getAll().pipe(
      tap(
        insumos => {
          insumos.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        }
      )
    );
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el insumo?')) {
      this.insumoService.delete(id).subscribe();
    }
  }

}
