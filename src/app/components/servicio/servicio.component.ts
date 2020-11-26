import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { ServicioService } from 'src/app/services/servicio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Maquina } from 'src/app/Models/maquina.interface';
import { MaquinaService } from 'src/app/services/maquina.service';
import { tap } from 'rxjs/operators';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/Models/empleado.interface';
import { Insumo } from 'src/app/Models/insumo.interface';
import { InsumoService } from 'src/app/services/insumo.service';
import { Servicio } from 'src/app/Models/servicio.interface';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent extends BaseABMComponent implements OnInit, OnDestroy {

  maquinas$: Observable<Maquina[]>;
  empleados$: Observable<Empleado[]>;
  insumosSelect: Insumo[];
  servicioSubscription: Subscription;
  insumosSubscription: Subscription;

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    duracion: ['30'],
    id_maquina: [null],
    id_personal: [null],
    insumos: new FormArray([])
  });

  redirectRoute = '/solarium/servicios';

  constructor(
    public service: ServicioService,
    public maquinaService: MaquinaService,
    public empleadoService: EmpleadoService,
    public insumoService: InsumoService,
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {
    super(service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.maquinas$ = this.maquinaService.getAll().pipe(
      tap((maquinas: Maquina[]) => {
        maquinas.sort((a, b) => a.nombre < b.nombre ? - 1 : 1);
      })
    );

    this.empleados$ = this.empleadoService.getAll().pipe(
      tap((empleados: Empleado[]) => {
        empleados.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
      })
    );

    this.insumosSubscription = this.insumoService.getAll().subscribe(
      (insumos: Insumo[]) => {
        insumos.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        this.insumosSelect = insumos;
        if (this.accion === 'editar') {
          this.servicioSubscription = this.service.getOne(this.itemId).subscribe(
            (servicio: Servicio) => {
              this.patchFormInsumos(servicio);
            }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.insumosSubscription) { this.insumosSubscription.unsubscribe(); }
    if (this.servicioSubscription) { this.servicioSubscription.unsubscribe(); }
  }

  private patchFormInsumos(servicio: Servicio) {
    servicio.insumos.forEach(insumo => {
      this.insumos.push(this.fb.group({
        id: [insumo.id],
        cantidad: [insumo.pivot.cantidad_insumo]
      }));
    });
  }

  get insumos() {
    return this.form.get('insumos') as FormArray;
  }

  addInsumos() {
    this.insumos.push(this.fb.group({
      id: ['', Validators.required],
      cantidad: ['', Validators.required]
    }));
  }

  removeInsumo(i: number) {
    this.insumos.removeAt(i);
  }

}
