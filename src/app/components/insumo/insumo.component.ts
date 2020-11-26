import { Component, OnInit } from '@angular/core';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { Validators, FormBuilder } from '@angular/forms';
import { InsumoService } from 'src/app/services/insumo.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css']
})
export class InsumoComponent extends BaseABMComponent implements OnInit {

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    stock: ['', Validators.required],
    stock_minimo: ['', Validators.required]
  });

  redirectRoute = '/solarium/insumos';

  constructor(
    public service: InsumoService,
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
