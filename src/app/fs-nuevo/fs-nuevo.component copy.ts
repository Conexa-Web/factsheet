import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  registerables
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClientModule } from '@angular/common/http';
import html2canvas from 'html2canvas';
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
  @ViewChild('chartWrapperActivos', { static: false }) chartWrapperActivos!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true }) chartCanvasActivos!: ElementRef;
  @ViewChild('chartContainerActivos', { static: true }) chartContainerActivos!: ElementRef;
  @ViewChild('chartVC', { static: true }) chartVC!: ElementRef;

  chart!: Chart; // Gráfico de sectores (doughnut)
  data_fs: any;
  activos_nombres: string[] = [];
  activos_valor: number[] = [];
  sectores_nombres: string[] = [];
  sectores_valor: number[] = [];

  constructor(private json: JsonService) {}

  async ngOnInit(): Promise<void> { }

  async ngAfterViewInit() {
    // Carga del JSON desde assets (por ejemplo, fondo07.json)
    this.data_fs = await this.json.getData("assets/data/fondo07.json");

    // Procesa los datos de "activos"
    this.data_fs.activos.forEach((x: any) => {
      this.activos_nombres.push(x.nombre_activo);
      this.activos_valor.push(x.valor);
    });

    // Procesa los datos de "sectores"
    this.data_fs.sectores.forEach((x: any) => {
      this.sectores_nombres.push(x.sector);
      this.sectores_valor.push(x.valor);
    });

    // Crea los gráficos doughnut de sectores y activos
    this.createChart();
    this.createChartActivos();

    // Crea el gráfico de líneas usando "valor_cuota"
    this.renderChart();
  }

  async createChart() {
    const data: ChartData<'doughnut'> = {
      labels: this.sectores_nombres,
      datasets: [{
        label: 'Valores',
        data: this.sectores_valor,
        backgroundColor: ['#117496', '#17B0EA', '#003459', '#0089B8', '#3FBEEE', '#22CFFA', '#0089B8', '#00A8E8', '#001C36'],
      }],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      cutout: "75%",
      animation: false,
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
        datalabels: { display: false }
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data,
      options,
      plugins: [{
        id: 'customLabels',
        afterDraw: (chart) => this.addHtmlLabels(chart, this.chartContainer.nativeElement, true),
      }],
    });
  }

  createChartActivos() {
    const data: ChartData<'doughnut'> = {
      labels: this.activos_nombres,
      datasets: [{
        label: 'Valores',
        data: this.activos_valor,
        backgroundColor: ['#003459', '#17B0EA', '#005980', '#0089B8'],
      }],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      cutout: "75%",
      animation: false,
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
        datalabels: { display: false }
      },
    };

    this.chart = new Chart(this.chartCanvasActivos.nativeElement, {
      type: 'doughnut',
      data,
      options,
      plugins: [{
        id: 'customLabels',
        afterDraw: (chart) => this.addHtmlLabels(chart, this.chartContainerActivos.nativeElement, false),
      }],
    });
  }


  addHtmlLabels(chart: Chart, contenedor: any, es_sector: boolean) {
    const container = contenedor;
    container.innerHTML = '';

    const meta = chart.getDatasetMeta(0);
    const ctx = chart.ctx;
    const total = (chart.data.datasets[0].data.reduce((a, b) => (a as number) + (b as number), 0)) as number;
    meta.data.forEach((bar, index) => {
      const { startAngle, endAngle } = bar.getProps(['startAngle', 'endAngle'], true);
      const angle = (startAngle + endAngle) / 2;
      const label2 = chart.data.labels[index];
      const { outerRadius } = bar.getProps(['outerRadius'], true);
      const radius = outerRadius * (!es_sector ? 1.0 : 0.95);
      const x = chart.width / 2 + radius * Math.cos(angle);
      const y = chart.height / 2 + radius * Math.sin(angle);
      const labelX = chart.width / 2 + radius * 1.25 * Math.cos(angle);
      const labelY = chart.height / 2 + radius * 1.25 * Math.sin(angle);
      const value = (chart.data.datasets[0].data[index]) as number;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(labelX, labelY);

      const label = document.createElement('div');
      label.innerHTML = `<div style='color: #10273D;text-align: end;font-size: 36px; font-weight: 700;'>
        ${this.formatoNumberMiles(value)}%
        </div>
        <div style='color: #10273D; font-weight: 700;'>${label2}</div>`;
      label.style.position = 'absolute';
      label.style.left = `${labelX}px`;
      label.style.top = `${labelY}px`;
      label.style.transform = 'translate(-50%, -50%)';
      label.style.fontSize = '26px';

      container.appendChild(label);
    });
  }




  renderChart(): void {
    const valorCuotaArray = this.data_fs.valor_cuota;

    // Filtra solo los elementos válidos: con "periodo" definido y con un arreglo "valores" no vacío
    const validElements = valorCuotaArray.filter((item: any) =>
      item && item.periodo && Array.isArray(item.valores) && item.valores.length > 0
    );
    if (!validElements.length) return;

    // Asumimos que todos los elementos tienen la misma cantidad de puntos en "valores"
    const n = validElements[0].valores.length;

    // Para cada objeto (período) se crea un dataset, agregando "offset" de nulls
    const datasetsChart = validElements.map((item: any, index: number) => {
      const offset = index * (n - 1);
      // Se crea un array con offset de nulls y luego se agregan los valores reales
      const dataArray = new Array(offset).fill(null);
      dataArray.push(...item.valores);
      return {
        label: item.periodo,
        data: dataArray,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#0A80BA',
        borderWidth: 1,
        fill: false,
        tension: 0.1,
        pointStyle: 'circle',
        pointRadius: 1,
      };
    });

    // Construye el arreglo de etiquetas (labels)
    // La longitud total es: (L - 1) * (n - 1) + n, donde L es el número de períodos válidos
    const totalLength = (validElements.length - 1) * (n - 1) + n;
    const labels = new Array(totalLength).fill('');
    // Coloca la etiqueta del período en la posición de inicio de cada línea
    validElements.forEach((item: any, index: number) => {
      const offset = index * (n - 1);
      labels[offset] = item.periodo;
    });
    // Agregamos un label extra (oculto) para forzar un poco de espacio al final
    labels.push('');

    // Obtiene el contexto 2D del canvas
    const ctx = this.chartVC.nativeElement.getContext('2d');
    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasetsChart,
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            // Usamos funciones scriptables para ajustar el alineamiento del último punto
            align: (context) => {
              const dsIndex = context.datasetIndex;
              const dataIdx = context.dataIndex;
              const ds = context.chart.data.datasets[dsIndex];
              // Si es el último punto del último dataset, lo alineamos a 'left'
              if (
                dsIndex === context.chart.data.datasets.length - 1 &&
                dataIdx === ds.data.length - 1
              ) {
                return 'right';
              }
              return 'right';
            },
            offset: (context) => {
              const dsIndex = context.datasetIndex;
              const dataIdx = context.dataIndex;
              const ds = context.chart.data.datasets[dsIndex];
              // Para el último punto del último dataset, se usa offset 5 (puedes ajustar según prefieras)
              if (
                dsIndex === context.chart.data.datasets.length - 1 &&
                dataIdx === ds.data.length - 1
              ) {
                return 5;
              }
              return 5;
            },
            color: '#59BCE2',
            font: {
              size: 18,
              family: 'TT Hoves Pro Trial',
            },
            formatter: (value) =>
              value === 1 ? '' : this.formatoNumberMiles(value, 4),
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
              color: '#10273D',
              font: { size: 18, family: 'TT Hoves Pro Trial' },
            },
            // Se utiliza 'type: "category"' para trabajar con el arreglo de labels
            type: 'category'
            // No es necesario ajustar 'min' o 'max' si se usa el label extra
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            beginAtZero: false,
            ticks: {
              color: '#10273D',
              font: { size: 18, family: 'TT Hoves Pro Trial' },
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
      const parts = Number(x).toFixed(decimalLimit).split('.');
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    }
    return Number(0).toFixed(decimalLimit);
  }



  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  async generar() {
    let imgSectores: any;
    let imgActivos: any;
    if (!this.chartWrapper) {
      console.error('No se encontró el contenedor del gráfico');
      return;
    }

    const elementSectores = this.chartWrapper.nativeElement as HTMLDivElement;
    await html2canvas(elementSectores, { backgroundColor: null }).then((canvas) => {
      imgSectores = canvas.toDataURL('image/png');
    });

    const elementActivos = this.chartWrapperActivos.nativeElement as HTMLDivElement;
    await html2canvas(elementActivos, { backgroundColor: null }).then((canvas) => {
      imgActivos = canvas.toDataURL('image/png');
    });

    const imagenChart = this.chartVC.nativeElement.toDataURL('image/png');

    await LevFactSheetPDF.create(imagenChart, imgActivos, imgSectores, this.data_fs);
  }
}

