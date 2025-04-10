import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  layouts,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BrowserModule } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';
import { JsonService } from '../json.service';
import { LevFactSheetPDF } from '../lev-factsheet';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'fs-nuevo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [JsonService],
  templateUrl: './fs-nuevo.component.html',
  styleUrls: ['./fs-nuevo.component.scss'],
})
export class FsNuevoComponent implements OnInit, AfterViewInit {
  @ViewChild('chartWrapper', { static: false }) chartWrapper!: ElementRef;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('chartWrapperActivos', { static: false })
  chartWrapperActivos!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartContainerActivos', { static: true })
  chartContainerActivos!: ElementRef;
  @ViewChild('chartVC', { static: true }) chartVC!: ElementRef;
  chart!: Chart;

  data_fs: any;
  activos_nombres = [];
  activos_valor = [];
  sectores_nombres = [];
  sectores_valor = [];
  async ngOnInit(): Promise<void> {}

  constructor(private json: JsonService) {}

  // TODO - CAMBIO DE JSON
  async ngAfterViewInit() {
    // this.data_fs = await this.json.getData('assets/data/fondo06.json');
    this.data_fs = await this.json.getData('assets/data/lending.json');
    this.data_fs.activos.map((x) => {
      this.activos_nombres.push(Object.values(x)[1]);
      this.activos_valor.push(Object.values(x)[2]);
    });
    this.data_fs.sectores.map((x) => {
      this.sectores_nombres.push(Object.values(x)[0]);
      this.sectores_valor.push(Object.values(x)[1]);
    });

    this.createChart();
    this.createChartActivos();
    this.renderChart();
  }
  async createChart() {
    const data: ChartData<'doughnut'> = {
      // labels: ['Construcción', 'Salud', 'Agroindustrial', 'Seguridad','Telecomunicaciones','Educación','Forestal','Servicios','Otros'],
      labels: this.sectores_nombres,
      datasets: [
        {
          label: 'Valores',
          // data: [21.65, 11.65,10.48 ,10.27, 6.17,6.01,5.96,4.84,22.96],
          data: this.sectores_valor,
          backgroundColor: [
            '#117496',
            '#17B0EA',
            '#003459',
            '#0089B8',
            '#3FBEEE',
            '#22CFFA',
            '#0089B8',
            '#00A8E8',
            '#001C36',
          ],
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      cutout: '75%',
      animation: false,
      plugins: {
        tooltip: { enabled: false },
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data,
      options,
      plugins: [
        {
          id: 'customLabels',
          afterDraw: (chart) =>
            this.addHtmlLabels(chart, this.chartContainer.nativeElement, true),
        },
      ],
    });
  }
  // 'Financimiento a Corto Plazo', 'Caja y Bancos', 'Financiamiento a Mediano Plazo', 'Cesión de Derechos'
  // 23.13, 7.46,61.22 ,8.19
  createChartActivos() {
    const data: ChartData<'doughnut'> = {
      // labels: ['Financimiento a Corto Plazo', 'Caja y Bancos', 'Cesión de Derechos', 'Financiamiento a Mediano Plazo'],
      labels: this.activos_nombres,
      datasets: [
        {
          label: 'Valores',
          // data: [23.13, 7.46,8.19 ,61.22],
          data: this.activos_valor,
          backgroundColor: ['#003459', '#17B0EA', '#005980', '#0089B8'],
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      cutout: '75%',
      animation: false,
      plugins: {
        tooltip: { enabled: false },
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    };

    this.chart = new Chart(this.chartCanvasActivos.nativeElement, {
      type: 'doughnut',
      data,
      options,
      plugins: [
        {
          id: 'customLabels',
          afterDraw: (chart) =>
            this.addHtmlLabels(
              chart,
              this.chartContainerActivos.nativeElement,
              false
            ),
        },
      ],
    });
  }


  addHtmlLabels(chart: Chart, contenedor: any, es_sector: boolean) {
    const container = contenedor;
    container.innerHTML = '';

    const meta = chart.getDatasetMeta(0);
    const ctx = chart.ctx;
    const total = chart.data.datasets[0].data.reduce(
      (a, b) => (a as number) + (b as number),
      0
    ) as number;
    meta.data.forEach((bar, index) => {
      const position = bar.tooltipPosition(true);
      const { startAngle, endAngle } = bar.getProps(
        ['startAngle', 'endAngle'],
        true
      );
      const angle = (startAngle + endAngle) / 2;
      const label2 = chart.data.labels[index];
      const { outerRadius } = bar.getProps(['outerRadius'], true);
      const radius = outerRadius * (!es_sector ? 1.0 : 0.95);
      const x = chart.width / 2 + radius * Math.cos(angle);
      const y = chart.height / 2 + radius * Math.sin(angle);



// TODO AJUSTE DE LABELS Y VALORES EN GRAFICOS ESPACIADO
   const baseAjuste = 1.22;
      const extraAjusteIzquierda = 0.07;

      const esIzquierda = Math.cos(angle) < 0;

      const ajuste = esIzquierda
        ? baseAjuste + extraAjusteIzquierda
        : baseAjuste;

      const labelX = chart.width / 2 + radius * ajuste * Math.cos(angle);
      const labelY = chart.height / 2 + radius * ajuste * Math.sin(angle);




      const value = chart.data.datasets[0].data[index] as number;
      const percentage = ((value / total) * 100).toFixed(1);

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(labelX, labelY);

      const label = document.createElement('div');
      label.innerHTML = `<div style='color: #10273D;text-align: end;font-size: 36px; font-weight: 700;'>
      ${this.formatoNumberMiles(value)}%
      </div> <div style='color: #10273D; font-weight: 700;'>${label2}</div>`;
      label.style.position = 'absolute';
      label.style.left = `${labelX}px`;
      label.style.top = `${labelY}px`;
      label.style.transform = 'translate(-50%, -50%)';
      label.style.fontSize = '26px';

      container.appendChild(label);
    });
  }





  renderChart(): void {
    let vc_1 = [];
    let vc_2 = [];
    let vc_3 = [];
    let vc_4 = [];
    let vc_5 = [];

    this.data_fs.valor_cuota.forEach((vc, index) => {
      switch (index) {
        case 0:
          vc_1.push(...vc.valores);
          break;
        case 1:
          for (let i = 0; i < index * 3; i++) {
            vc_2.push(null);
          }
          vc_2.push(...vc.valores);
          break;
        case 2:
          for (let i = 0; i < index * 3; i++) {
            vc_3.push(null);
          }
          vc_3.push(...vc.valores);
          break;
        case 3:
          for (let i = 0; i < index * 3; i++) {
            vc_4.push(null);
          }
          vc_4.push(...vc.valores);
          break;
        case 4:
          for (let i = 0; i < index * 3; i++) {
            vc_5.push(null);
          }
          vc_5.push(...vc.valores);
          break;
      }
    });

    const ctx = this.chartVC.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          this.data_fs.valor_cuota[0].periodo,
          '',
          '',
          this.data_fs.valor_cuota[1].periodo,
          '',
          '',
          this.data_fs.valor_cuota[2].periodo,
          '',
          '',
          this.data_fs.valor_cuota[3].periodo,
          '',
          '',
          this.data_fs.valor_cuota[4].periodo,
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            data: vc_1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: vc_2,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: vc_3,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: vc_4,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: vc_5,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            anchor: 'end', // Mover el valor hacia el extremo
            align: 'right', // Moverlo a la derecha
            offset: 5, // Ajustar el desplazamiento
            color: '#59BCE2',
            font: {
              size: 18, // Ajustar el tamaño de la fuente
              family: 'TT Hoves Pro Trial',
              // weight:"bold"
            },
            formatter: (value) =>
              `${value === 1 ? '' : this.formatoNumberMiles(value, 4)}`,
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Ocultar las líneas verticales
            },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              // autoSkipPadding: 20,
              autoSkip: false,
              color: '#10273D',
              font: {
                size: 18, // Cambiar el tamaño de los valores del eje Y
                family: 'TT Hoves Pro Trial',
                // weight: 'bold',
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)', // Cambiar el color de las líneas horizontales
            },
            beginAtZero: false,
            ticks: {
              color: '#10273D', // Cambiar el color de los valores del eje Y
              font: {
                size: 18, // Cambiar el tamaño de los valores del eje Y
                // weight: 'bold', // Hacer el texto en negrita
                family: 'TT Hoves Pro Trial',
              },
              callback: (value) => ` ${this.formatoNumberMiles(value, 4)}`,
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }

  formatoNumberMiles(x: any, decimalLimit: number = 2) {
    if (x && !isNaN(Number(x))) {
      var myArray = Number(x).toFixed(decimalLimit).toString().split('.');
      return (
        myArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + myArray[1]
      );
    }
    return `${Number(0).toFixed(decimalLimit)}`;
  }

  async generar() {
    let imgSectores;
    let imgActivos;
    if (!this.chartWrapper) {
      console.error('No se encontró el contenedor del gráfico');
      return;
    }

    const elementSectores = this.chartWrapper.nativeElement as HTMLDivElement;

    await html2canvas(elementSectores, { backgroundColor: null }).then(
      (canvas) => {
        let imagenBase64 = canvas.toDataURL('image/png');
        imgSectores = imagenBase64;
      }
    );

    const elementActivos = this.chartWrapperActivos
      .nativeElement as HTMLDivElement;

    await html2canvas(elementActivos, { backgroundColor: null }).then(
      (canvas) => {
        let imagenBase64 = canvas.toDataURL('image/png');
        imgActivos = imagenBase64;
      }
    );

    const imagenChart = this.chartVC.nativeElement.toDataURL('image/png');

    await LevFactSheetPDF.create(
      imagenChart,
      imgActivos,
      imgSectores,
      this.data_fs
    );
  }
}
