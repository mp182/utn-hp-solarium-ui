import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { forkJoin, Subscription } from 'rxjs';
import { Maquina } from 'src/app/Models/maquina.interface';
import { InformesService } from 'src/app/services/informes.service';
import { MaquinaService } from 'src/app/services/maquina.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-informe-uso-maquinas',
  templateUrl: './informe-uso-maquinas.component.html',
  styleUrls: ['./informe-uso-maquinas.component.css']
})
export class InformeUsoMaquinasComponent implements OnInit {

  form = this.fb.group({
    desde: [''],
    hasta: [''],
    maquinas: ['']
  });

  public informeSubscription: Subscription;
  public maquinas: Maquina[];

  public barChartLabels: Label[];
  public barChartData: ChartDataSets[];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: { beginAtZero: true }
      }],
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
    private maquinaService: MaquinaService,
    private informeService: InformesService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.informeSubscription = forkJoin
      ({
        maquinas: this.maquinaService.getMaquinas(),
        informeData: this.informeService.getUsosByMaquina()
      }).subscribe(
        {
          next: ({ maquinas, informeData }) => {
            maquinas.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
            this.maquinas = maquinas;
            this.formatChartData(informeData);
          },
          error: (err) => {
            this.notificationService.error('Error cargando informe!');
            console.error(err);
          }
        }
      );
  }

  formatChartData(informeData: { id_maquina: number; total: string; }[]) {
    const maquinas = this.maquinas.filter(x => informeData.some(y => y.id_maquina === x.id));
    this.barChartLabels = maquinas.map((maquina: Maquina) => maquina.nombre);
    this.barChartData = [
      {
        label: 'Máquinas',
        data: maquinas.map(
          (maquina: Maquina) => +informeData.find(x => x.id_maquina === maquina.id).total
        ),
        backgroundColor: maquinas.map(() => 'rgba(75,0,130,0.8)'),
        hoverBackgroundColor: maquinas.map(() => 'rgba(75,0,130,0.8)')
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

    this.informeService.getUsosByMaquina(params).subscribe(
      informeData => {
        this.formatChartData(informeData);
      }
    );
  }

}
