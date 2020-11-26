import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Moment } from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { HorarioService } from 'src/app/services/horario.service';
import { Horario } from 'src/app/Models/horario.interface';
import { Dias } from 'src/app/Models/dias.enum';
import { Empleado } from 'src/app/Models/empleado.interface';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent extends BaseABMComponent implements OnInit, OnDestroy {

  format = {
    fecha_nacimiento: (fecha: Moment) => typeof fecha === 'object' ? fecha.format('Y-MM-DD') : fecha
  };

  dias: {
    dia: number,
    nombre: string,
    desde: string,
    hasta: string,
    check: boolean,
    desdeValue: string,
    hastaValue: string
  }[] = [];

  empleadoSubscription: Subscription;
  horariosSubscription: Subscription;

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    domicilio: ['', Validators.required],
    dni: ['', Validators.required],
    fecha_nacimiento: ['', Validators.required],
    telefono: ['', Validators.required],
    email: ['', Validators.required],
    horarios: this.fb.array([])
  });

  redirectRoute = '/solarium/empleados';

  constructor(
    public service: EmpleadoService,
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private notification: NotificationService,
    private horariosService: HorarioService
  ) {
    super(service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.horariosSubscription = this.horariosService.getHorarios().subscribe(horarios => {
      this.setDias(horarios.horarios);
      if (this.accion === 'editar') {
        this.empleadoSubscription = this.service.getOne(this.itemId).subscribe((empleado: Empleado) => {
          this.patchFormHorarios(empleado);
          this.setHorariosControls();
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.empleadoSubscription) { this.empleadoSubscription.unsubscribe(); }
    if (this.horariosSubscription) { this.horariosSubscription.unsubscribe(); }
  }

  comprobarDNI(dni: number) {
    if (this.editar && dni === this.item.dni) { return; }
    this.empleadoSubscription = this.service.searchEmpleados(dni.toString())
      .subscribe(empleados => {
        if (empleados.length > 0 && empleados.some(x => x.dni === dni.toString())) {
          this.form.controls.dni.setErrors({ dni_existe: true });
        }
      }, (error) => {
        this.notification.error(error);
      });
  }

  save() {
    if (this.validarHorarios()) {
      super.save();
    }
    else {
      this.notification.error('Revise los horarios por favor.');
    }
  }

  update() {
    if (this.validarHorarios()) {
      super.update();
    }
    else {
      this.notification.error('Revise los horarios por favor.');
    }
  }

  validarHorarios(): boolean {
    return !(this.horarios.value.length === 0 || this.horarios.value.some(x => x.hora_entrada >= x.hora_salida));
  }

  addOrRemove(item: any, desde: string, hasta: string) {
    if (this.horarios.value.find(horario => horario.dia === item.dia)) {
      this.horarios.removeAt(this.horarios.value.findIndex(horario => horario.dia === item.dia));
    } else {
      this.horarios.push(this.fb.group({
        dia: [item.dia],
        hora_entrada: [desde],
        hora_salida: [hasta]
      }));
    }
  }

  updateHorario(item: any, desde: string, hasta: string) {
    const index = this.horarios.value.findIndex(horario => horario.dia === item.dia);
    this.horarios.value[index].hora_entrada = desde;
    this.horarios.value[index].hora_salida = hasta;
  }

  get horarios() {
    return this.form.get('horarios') as FormArray;
  }

  setDias(horarios: Horario[]) {
    this.dias = horarios.map(horario => (
      {
        dia: horario.dia,
        nombre: Dias[horario.dia],
        desde: horario.horario_apertura,
        hasta: horario.horario_cierre,
        check: false,
        desdeValue: horario.horario_apertura,
        hastaValue: horario.horario_cierre
      }
    ));
  }

  private setHorariosControls() {
    this.horarios.controls.forEach(element => {
      const horario = element.value;
      if (this.dias.some(x => x.dia === horario.dia)) {
        const index = this.dias.findIndex(x => x.dia === horario.dia);
        this.dias[index] = { ...this.dias[index], check: true, desdeValue: horario.hora_entrada, hastaValue: horario.hora_salida };
      }
    });
  }

  private patchFormHorarios(empleado: Empleado) {
    empleado.horarios.forEach(horario => {
      this.horarios.push(this.fb.group({
        dia: [horario.dia],
        hora_entrada: [horario.hora_entrada],
        hora_salida: [horario.hora_salida]
      }));
    });
  }

}
