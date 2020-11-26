import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { ClientService } from 'src/app/services/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent extends BaseABMComponent implements OnInit, OnDestroy {

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    domicilio: ['', Validators.required],
    dni: ['', Validators.required],
    fecha_nacimiento: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', Validators.required]
  });

  redirectRoute = '/solarium/search-client';

  format = {
    fecha_nacimiento: (fecha: Moment) => typeof fecha === 'object' ? fecha.format('Y-MM-DD') : fecha
  };

  clientesSubscription: Subscription;
  startDate = new Date();

  constructor(
    public service: ClientService,
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private notification: NotificationService
  ) {
    super(service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.startDate.setFullYear(new Date().getFullYear() - 18);
  }

  ngOnDestroy(): void {
    if (this.clientesSubscription) { this.clientesSubscription.unsubscribe(); }
  }

  comprobarDNI(dni: number) {
    if (this.editar && dni === this.item.dni) { return; }
    this.clientesSubscription = this.service.searchClients(dni.toString())
      .subscribe(clientes => {
        if (clientes.length > 0 && clientes.some(x => x.dni === dni.toString())) {
          this.form.controls.dni.setErrors({ dni_existe: true });
        }
      }, (error) => {
        this.notification.error(error);
      });
  }

  onSave(item) {
    this.redirectRoute = `/solarium/client/${item.id}`;
    super.onSave(item);
  }

  onUpdate(item) {
    this.redirectRoute = `/solarium/client/${item.id}`;
    super.onUpdate(item);
  }

}
