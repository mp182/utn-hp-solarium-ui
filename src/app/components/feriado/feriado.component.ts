import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { FeriadoService } from 'src/app/services/feriado.service';

@Component({
  selector: 'app-feriado',
  templateUrl: './feriado.component.html',
  styleUrls: ['./feriado.component.css']
})
export class FeriadoComponent extends BaseABMComponent implements OnInit {

  form = this.fb.group({
    fecha: ['', Validators.required],
    nombre: ['', Validators.required],
    recurrente: ['']
  });

  redirectRoute = '/solarium/feriados';

  format = {
    fecha: (fecha: Moment) => typeof fecha === 'object' ? fecha.format('Y-MM-DD') : fecha
  };

  constructor(
    public service: FeriadoService,
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
