import { Router, ActivatedRoute } from '@angular/router';
import { MaquinaService } from '../../services/maquina.service';
import { BaseABMComponent } from '../../base-abm/base-abm.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Moment } from 'moment';

@Component({
  selector: 'app-maquina',
  templateUrl: './maquina.component.html',
  styleUrls: ['./maquina.component.css'],
})
export class MaquinaComponent extends BaseABMComponent implements OnInit {

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    fecha_compra: ['', Validators.required],
    cantidad_usos: ['', Validators.required]
  });

  redirectRoute = '/solarium/maquinas';

  format = {
    fecha_compra: (fecha: Moment) => typeof fecha === 'object' ? fecha.format('Y-MM-DD') : fecha
  };

  constructor(
    public service: MaquinaService,
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(service);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
