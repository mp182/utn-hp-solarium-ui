import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseABMComponent } from 'src/app/base-abm/base-abm.component';
import { Dias } from 'src/app/Models/dias.enum';
import { Horario } from 'src/app/Models/horario.interface';
import { HorarioService } from 'src/app/services/horario.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent extends BaseABMComponent implements OnInit, OnDestroy {

  dias: { dia: number, nombre: string, horario_apertura: string, horario_cierre: string, check: boolean }[] = [];

  horariosSubscription: Subscription;

  form = this.fb.group({
    horarios: this.fb.array([])
  });

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private notification: NotificationService,
    public service: HorarioService
  ) {
    super(service);
  }

  ngOnInit() {
    this.setDias();
    this.horariosSubscription = this.service.getHorarios().subscribe(horarios => {
      this.patchFormHorarios(horarios.horarios);
      this.setHorariosControls();
    });
  }

  ngOnDestroy() {
    if (this.horariosSubscription) { this.horariosSubscription.unsubscribe(); }
  }

  private setDias(): void {
    for (let index = 0; index < 7; index++) {
      this.dias.push({
        dia: index,
        nombre: Dias[index],
        horario_apertura: '8:00',
        horario_cierre: '22:00',
        check: false
      });
    }
  }

  private patchFormHorarios(horarios: Horario[]) {
    horarios.forEach(horario => {
      this.horarios.push(this.fb.group({
        dia: [horario.dia],
        horario_apertura: [horario.horario_apertura],
        horario_cierre: [horario.horario_cierre]
      }));
    });
  }

  get horarios() {
    return this.form.get('horarios') as FormArray;
  }

  private setHorariosControls() {
    this.horarios.controls.forEach(element => {
      const horario = element.value;
      if (this.dias.some(x => x.dia === horario.dia)) {
        const index = this.dias.findIndex(x => x.dia === horario.dia);
        this.dias[index] = {
          ...this.dias[index],
          check: true,
          horario_apertura: horario.horario_apertura,
          horario_cierre: horario.horario_cierre
        };
      }
    });
  }

  addOrRemove(item: any, desde: string, hasta: string) {
    if (this.horarios.value.find(horario => horario.dia === item.dia)) {
      this.horarios.removeAt(this.horarios.value.findIndex(horario => horario.dia === item.dia));
    } else {
      this.horarios.push(this.fb.group({
        dia: [item.dia],
        horario_apertura: [desde],
        horario_cierre: [hasta]
      }));
    }
  }

  updateHorario(item: any, desde: string, hasta: string) {
    const index = this.horarios.value.findIndex(horario => horario.dia === item.dia);
    this.horarios.value[index].horario_apertura = desde;
    this.horarios.value[index].horario_cierre = hasta;
  }

  validarHorarios(): boolean {
    return !(this.horarios.value.length === 0 || this.horarios.value.some(x => x.horario_apertura >= x.horario_cierre));
  }

  update() {
    if (this.validarHorarios()) {
      this.service.updateHorarios(this.form.value).subscribe();
    }
    else {
      this.notification.error('Revise los horarios por favor.');
    }
  }

}
