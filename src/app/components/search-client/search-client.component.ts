import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/Models/cliente.interface';
import { ClientService } from 'src/app/services/client.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
// import * as faker from '../../../assets/faker.js';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.css']
})
export class SearchClientComponent implements OnInit, AfterViewInit, OnDestroy {

  buscarValue: string;
  clientesSubscription: Subscription;
  columnsToDisplay = ['dni', 'nombre', 'apellido', 'telefono', 'email', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clientesSubscription = this.clientService.getAll().subscribe(
      (clientes: Cliente[]) => {
        clientes.sort((a, b) => +a.dni - +b.dni);
        this.dataSource.data = clientes;
        this.dataSource.paginator = this.paginator;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.clientesSubscription) { this.clientesSubscription.unsubscribe(); }
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public limpiarFiltro() {
    this.buscarValue = '';
    this.dataSource.filter = this.buscarValue;
  }

  // generarClientes() {
  //   faker.locale = 'es_MX';
  //   const dob = faker.date.past(50, new Date('Sat Sep 20 2002 21:35:02 GMT+0200 (CEST)'));

  //   const cliente: Cliente = {
  //     apellido: faker.name.lastName(),
  //     dni: faker.random.number({ max: 60000000, min: 12000000 }),
  //     domicilio: faker.address.streetAddress(),
  //     email: faker.internet.email(),
  //     fecha_nacimiento: dob.getFullYear() + '-' + (dob.getMonth() + 1) + '-' + dob.getDate(),
  //     nombre: faker.name.firstName(),
  //     telefono: faker.phone.phoneNumber('341 # ######')
  //   };

  //   this.clientService.save(cliente).subscribe();
  // }

}
