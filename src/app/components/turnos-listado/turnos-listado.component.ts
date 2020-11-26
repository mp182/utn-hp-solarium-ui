import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/Models/cliente.interface';
import { Turno } from 'src/app/Models/turno.interface';
import { NotificationService } from 'src/app/services/notification.service';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-turnos-listado',
  templateUrl: './turnos-listado.component.html',
  styleUrls: ['./turnos-listado.component.css']
})
export class TurnosListadoComponent implements OnInit, AfterViewInit, OnDestroy {

  turnosSubscription: Subscription;
  clienteId: number;
  cliente: Cliente;
  columnsToDisplay = ['fecha_turno', 'turno_concretado', 'servicio', 'acciones'];
  dataSource = new MatTableDataSource<Turno>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private turnoService: TurnoService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clienteId = +params.get('id');
      this.turnosSubscription = this.turnoService.getTurnosByCliente(this.clienteId).subscribe(
        (turnos: Turno[]) => {
          if (turnos.length > 0) {
            turnos.sort((a, b) => a.fecha_turno > b.fecha_turno ? -1 : 1);
            this.cliente = turnos[0].cliente;
            this.dataSource.data = turnos;
            this.dataSource.paginator = this.paginator;
          }
        }
      );
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.turnosSubscription) { this.turnosSubscription.unsubscribe(); }
  }

  validar(id: number) {
    if (confirm('¿Seguro que desea validar el turno?')) {
      this.turnoService.update(id, { turno_concretado: true }).subscribe(
        (data: any) => {
          if (data) {
            const eventoConcretado = this.dataSource.data.find(x => +x.id === +id);
            eventoConcretado.turno_concretado = true;
          } else {
            this.notificationService.error('No se pudo validar el turno, intente más tarde.');
          }
        }
      );
    }
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el turno?')) {
      this.turnoService.delete(id).subscribe(
        (data: any) => {
          if (data.deleted) {
            this.dataSource.data = this.dataSource.data.filter(x => +x.id !== +id);
          } else {
            this.notificationService.error('No se pudo eliminar el turno, intente más tarde.');
          }
        }
      );
    }
  }

}
