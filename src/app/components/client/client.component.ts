import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/Models/cliente.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clientId: number;
  cliente$: Observable<Cliente>;
  isAsignarTurno = false;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('id');

    this.cliente$ = this.clientService.getClient(this.clientId);
  }

  asignarTurno() {
    this.isAsignarTurno = true;
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar el cliente?')) {
      this.clientService.delete(id).subscribe();
      this.router.navigateByUrl('solarium/search-client');
    }
  }

}
