import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Servicio } from 'src/app/Models/servicio.interface';
import { ServicioService } from 'src/app/services/servicio.service';
import { InformesService } from 'src/app/services/informes.service';
import { forkJoin, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-informe-turnos-servicios',
  templateUrl: './informe-turnos-servicios.component.html',
  styleUrls: ['./informe-turnos-servicios.component.css']
})
export class InformeTurnosServiciosComponent implements OnInit {

  form = this.fb.group({
    desde: [''],
    hasta: [''],
    servicios: ['']
  });

  public informeSubscription: Subscription;
  public servicios: Servicio[];

  public barChartLabels: Label[];
  public barChartData: ChartDataSets[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [{
        ticks: { beginAtZero: true }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    legend: {
      display: false
    }
  };

  constructor(
    private servicioService: ServicioService,
    private informeService: InformesService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.informeSubscription = forkJoin
      ({
        servicios: this.servicioService.getServicios(),
        informeData: this.informeService.getTurnosByServicio()
      }).subscribe(
        {
          next: ({ servicios, informeData }) => {
            servicios.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
            this.servicios = servicios;
            this.formatChartData(informeData);
          },
          error: (err) => {
            this.notificationService.error('Error cargando informe!');
            console.error(err);
          }
        }
      );
  }

  formatChartData(informeData: { id_servicio: number; total: string; }[]) {
    const servicios = this.servicios.filter(x => informeData.some(y => y.id_servicio === x.id));
    this.barChartLabels = servicios.map((servicio: Servicio) => servicio.nombre);
    this.barChartData = [
      {
        label: 'Servicios',
        data: servicios.map(
          (servicio: Servicio) => +informeData.find(x => x.id_servicio === servicio.id).total
        ),
        backgroundColor: servicios.map(() => 'rgba(75,0,130,0.8)'),
        hoverBackgroundColor: servicios.map(() => 'rgba(75,0,130,0.8)')
      }
    ];
  }

  filtrar() {
    const params = { ...this.form.value };
    if (params.desde) {
      params.desde = params.desde.format('Y-MM-DD');
    }

    if (params.hasta) {
      params.hasta = params.hasta.format('Y-MM-DD');
    }

    this.informeService.getTurnosByServicio(params).subscribe(
      informeData => {
        this.formatChartData(informeData);
      }
    );
  }

}
