import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Turno } from 'src/app/Models/turno.interface';
import { Cliente } from 'src/app/Models/cliente.interface';
import { Feriado } from 'src/app/Models/feriado.interface';
import { HorarioProfesional } from 'src/app/Models/profesional.interface';
import { Servicio } from 'src/app/Models/servicio.interface';
import { ClientService } from 'src/app/services/client.service';
import { FeriadoService } from 'src/app/services/feriado.service';
import { HorarioService } from 'src/app//services/horario.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TurnoService } from 'src/app/services/turno.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import interaction from '@fullcalendar/interaction';
import timeGrid from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { EventPopupComponent } from '../event-popup/event-popup.component';
import { MensajePopupComponent } from '../mensaje-popup/mensaje-popup.component';
import * as moment from 'moment';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, OnDestroy {

  servicioId: number;
  clientId: number;
  calendarPlugins = [interaction, timeGrid];
  locale = esLocale;
  calendarHeader = {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek, timeGridDay',
  };
  events: any[];
  date: any;
  cliente: Cliente;
  servicio: Servicio;
  calendarSubscription: Subscription;
  businessHours: { daysOfWeek: number[]; startTime: string; endTime: string; }[];
  horaApertura: string;
  horaCierre: string;
  hiddenDays = [];
  dias = [0, 1, 2, 3, 4, 5, 6];
  servicios$: Observable<Servicio[]>;
  servicioSelected: number;
  servicios: Servicio[];
  feriados: Feriado[];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private turnoService: TurnoService,
    private servicioService: ServicioService,
    private clienteService: ClientService,
    private horariosService: HorarioService,
    private feriadosService: FeriadoService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.servicioId = +params.get('servicioId');
      this.clientId = +params.get('clientId');
      this.loadData();
    });
  }

  ngOnDestroy() {
    if (this.calendarSubscription) { this.calendarSubscription.unsubscribe(); }
  }

  loadData() {
    this.servicios$ = this.servicioService.getServicios().pipe(
      tap((servicios: Servicio[]) => {
        this.servicios = servicios;
        servicios.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        this.servicioSelected = this.servicioId !== 0 ? this.servicioId : servicios[0].id;
        this.calendarSubscription = forkJoin
          ({
            cliente: this.clientId !== 0 ? this.clienteService.getClient(this.clientId) : of(null),
            servicio: this.servicioService.getServicio(this.servicioSelected),
            turnos: this.turnoService.getTurnosByServicio(this.servicioSelected),
            horarios: this.horariosService.getHorarios(),
            feriados: this.feriadosService.getFeriados()
          }).subscribe({
            next: ({ cliente, servicio, turnos, horarios, feriados }) => {
              this.feriados = feriados;
              this.cliente = cliente;
              this.servicio = servicio;
              this.events = turnos.map(turno => this.formatEvent(turno));
              this.businessHours = horarios.horarios.map((horario) => {
                return {
                  daysOfWeek: [horario.dia],
                  startTime: horario.horario_apertura,
                  endTime: horario.horario_cierre
                };
              });
              this.horaApertura = horarios.hora_apertura;
              this.horaCierre = horarios.hora_cierre;

              const diasAtencion = horarios.horarios.map(horario => horario.dia);
              this.hiddenDays = this.dias.filter(dia => !diasAtencion.includes(dia));
              this.eventosProfesional();
              this.agregarFeriados();
            },
            error: (err) => {
              this.notificationService.error('Error cargando eventos!');
              console.error(err);
            }
          });
      })
    );
  }

  handleDateClick(e: any) {
    if (!!this.clientId && this.isOpen(e.date)) {
      this.date = e.dateStr;
      const dialogRef = this.dialog.open(EventPopupComponent, {
        width: '40vw',
        data: {
          event: e.dateStr,
          cliente: this.cliente,
          servicio: this.servicio
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.guardar) {
          const fecha = this.date;

          this.turnoService.addTurno(fecha, this.servicioSelected, this.clientId).subscribe(
            turno => { this.events = this.events.concat(this.formatEvent(turno)); }
          );
        }
      });
    }
  }

  formatEvent(turno: Turno) {
    return {
      title: `${turno.cliente.nombre} ${turno.cliente.apellido}`,
      start: turno.fecha_turno,
      end: turno.fecha_fin,
      id: turno.id,
      servicio: turno.servicio,
      cliente: turno.cliente,
      concretado: turno.turno_concretado,
      backgroundColor: turno.turno_concretado ? '#43a047' : '',
      borderColor: turno.turno_concretado ? '#43a047' : ''
    };
  }

  handleEventClick(e: any) {
    if (e.event.extendedProps.type) {
      let popUpData = {};
      switch (e.event.extendedProps.type) {
        case 'feriado':
          popUpData = {
            titulo: 'Cerrado',
            mensaje: 'Este día el solarium está cerrado.'
          };
          break;
        case 'profesional':
          popUpData = {
            titulo: 'No Trabaja',
            mensaje: 'El profesional no trabaja en este horario.'
          };
          break;
        default:
          break;
      }
      this.dialog.open(MensajePopupComponent, {
        width: '40vw',
        data: popUpData
      });
    } else {
      const dateStr = new Date(e.event.start.toString());
      const dialogRef = this.dialog.open(EventPopupComponent, {
        width: '40vw',
        data: {
          event: dateStr.setHours(dateStr.getHours() + 3),
          maquinaId: e.event.extendedProps.servicio.maquinaId,
          cliente: e.event.extendedProps.cliente,
          servicio: e.event.extendedProps.servicio,
          concretado: e.event.extendedProps.concretado,
          soloVerDatos: true
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.eliminar) {
          if (confirm('¿Seguro que desea eliminar el turno?')) {
            this.turnoService.delete(e.event.id).subscribe(
              (data: any) => {
                if (data.deleted) {
                  this.events = this.events.filter(x => +x.id !== +e.event.id);
                } else {
                  this.notificationService.error('No se pudo eliminar el turno, intente más tarde.');
                }
              }
            );
          }
        } else if (result && result.validar) {
          if (confirm('¿Seguro que desea validar el turno?')) {
            this.turnoService.update(e.event.id, { turno_concretado: true }).subscribe(
              (data: any) => {
                if (data) {
                  const eventoConcretado = this.events.find(x => +x.id === +e.event.id);
                  eventoConcretado.concretado = true;
                  eventoConcretado.backgroundColor = '#43a047';
                  eventoConcretado.borderColor = '#43a047';
                } else {
                  this.notificationService.error('No se pudo validar el turno, intente más tarde.');
                }
              }
            );
          }
        }
      });
    }
  }

  selectionChange() {
    this.turnoService.getTurnosByServicio(this.servicioSelected).subscribe(turnos => {
      this.events = turnos.map(turno => this.formatEvent(turno));
      this.servicio = this.servicios.find(x => x.id === this.servicioSelected);
      this.eventosProfesional();
      this.agregarFeriados();
    }, () => {
      this.notificationService.error('No se pueden cargar los turnos, intenta más tarde.');
    });
  }

  isOpen(date: any): boolean {
    const day = this.businessHours.find(x => +x.daysOfWeek === +date.getDay());
    const hora = moment(date).add(3, 'hours').format('HH:mm');
    return day.startTime <= hora && hora < day.endTime;
  }

  eventosProfesional() {
    if (this.servicio.id_personal) {
      const eventosNoLaborables = [];
      const diasTrabajados = [];
      this.servicio.personal.horarios.forEach(horario => {
        diasTrabajados.push(horario.dia);
        eventosNoLaborables.push(this.calcularEventoNoLaborables(horario));
      });
      const difference = this.businessHours.filter(x => !diasTrabajados.includes(+x.daysOfWeek));
      difference.forEach(day => {
        eventosNoLaborables.push({ startTime: '0:00', endTime: '24:00', daysOfWeek: [day.daysOfWeek] });
      });
      eventosNoLaborables.flat().forEach(event => {
        this.events.push(this.formatEspecialEvent(event, 'profesional'));
      });
    }
  }

  calcularEventoNoLaborables(horario: HorarioProfesional): any {
    const day = this.businessHours.find(x => +x.daysOfWeek === horario.dia);
    if (!!day) {
      return [
        { startTime: '0:00', endTime: horario.hora_entrada, daysOfWeek: [horario.dia] },
        { startTime: horario.hora_salida, endTime: '24:00', daysOfWeek: [horario.dia] }
      ];
    }
  }

  formatEspecialEvent(event: any, tipo: string) {
    return {
      title: tipo === 'profesional' ? 'NO TRABAJA' : 'FERIADO',
      startTime: event.startTime,
      endTime: event.endTime,
      type: tipo,
      backgroundColor: tipo === 'profesional' ? '#b0bec5' : '#ef5350',
      borderColor: tipo === 'profesional' ? '#b0bec5' : '#ef5350',
      daysOfWeek: event.daysOfWeek,
      start: event.start,
      end: event.end,
      classNames: ['eventoNoLaboral']
    };
  }

  agregarFeriados() {
    this.feriados.forEach(feriado => {
      const event = {
        start: moment(feriado.fecha).toDate(),
        end: moment(feriado.fecha).add(24, 'hours').toDate()
      };
      this.events.push(this.formatEspecialEvent(event, 'feriado'));
    });
  }
}
