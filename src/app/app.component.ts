/*
// FONDO 01
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          'DIC-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [1.0, 1.0080, 1.0160, 1.0241],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0,
              1.0080,
              1.0160,
              1.0221,],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0080,
              1.0156,
              1.0208,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0075,
              1.0149,
              1.0230,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0075,
              1.0149,
            ],
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
              // color: '#10273D',
              color: '#000000',
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
              color: '#000000', // Cambiar el color de los valores del eje Y
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Caja y \nbancos',
          'Financia-\nmiento a \nMediano \nPlazo',
          'Cesión \nde \nDerechos',
          'Financia-\nmiento a \nCorto \nPlazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [2.83, 69.07, 7.84, 20.26],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 2.83
                ? -80
                : value === 69.07
                ? -150
                : value === 7.84
                ? -95
                : value ===  20.26
                ? -120
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Construcción',
          'Salud',
          'Agroindustrial',
          'Telecomuni-\ncaciones',
          'Seguridad',
          'Hidrocarburos',
          'Educación',
          'Forestal',
          'Comercial', // Servicios 12.08
          'Otros',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              19.27, 10.94, 10.04, 9.41, 8.86, 6.70, 5.65, 5.61, 4.23, 19.29,
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 19.27
                ? -105
                : value === 10.94
                ? -80
                : value === 10.04
                ? -140
                : value === 9.41
                ? -100
                : value === 8.86
                ? -80
                : value === 6.70
                ? -110
                : value === 5.65
                ? -110
                : value === 5.61
                ? -95
                : value === 4.23
                ? -110
                : value === 19.29
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}

*/
/*
//FONDO 02

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          'DIC-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0067, 1.0134, 1.0201],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null,  1.0,
              1.0067,
              1.0134,
              1.0200,],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0066,
              1.0133,
              1.0195,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0065,
              1.0131,
              1.0204,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0067,
              1.0133,
            ],
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
              color: '#000000',
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
              color: '#000000', // Cambiar el color de los valores del eje Y
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Caja y \nbancos',
          'Financia-\nmiento a \nMediano \nPlazo',
          'Cesión \nde \nDerechos',
          'Financia-\nmiento a \nCorto \nPlazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [2.11, 68.28, 8.46, 21.15],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 2.11
                ? -80
                : value === 68.28
                ? -140
                : value === 8.46
                ? -95
                : value ===  21.15
                ? -120
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Farmacéutico',
          'Construc-\nción',
          'Comercial',
          'Servicios',
          'Agroindustrial',
          'Minería',
          'Industrial',
          'Inmobi-\nliario',
          'Automotriz', // Servicios 12.08
          'Otros',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              13.90, 13.80, 12.61, 12.44, 9.59, 7.76, 5.85, 4.50, 3.47, 16.08,
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 13.90
                ? -80
                : value === 13.80
                ? -120
                : value === 12.61
                ? -135
                : value === 12.44
                ? -80
                : value === 9.59
                ? -80
                : value === 7.76
                ? -110
                : value === 5.85
                ? -95
                : value === 4.50
                ? -95
                : value === 3.47
                ? -120
                : value === 16.08
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}
*/



/*
// FONDO 03
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          'DIC-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0080, 1.0160, 1.0241],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0,
              1.0080,
              1.0160,
              1.0241,],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0059,
              1.0137,
              1.0189,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0073,
              1.0147,
              1.0231,,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0075,
              1.0149,
            ],
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
              color: '#000000',
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
              color: '#000000', // Cambiar el color de los valores del eje Y
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Caja y \nbancos',
          'Financia-\nmiento a \nMediano \nPlazo',
          'Cesión \nde \nDerechos',
          'Financia-\nmiento a \nCorto \nPlazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [0.59, 80.06, 0.32, 19.04],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 0.59
                ? -80
                : value === 80.06
                ? -145
                : value === 0.32
                ? -110
                : value ===  19.04
                ? -120
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Comercial',
          'Industrial',
          'Salud',
          'Inmobiliario',
          'Constru-\ncción',
          'Metal-\nmecánica',
          'Trans-\nporte',
          'Agroindus-\ntrial',
          'Automotriz', // Servicios 12.08
          'Otros',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              16.99, 16.59, 11.36, 10.73, 8.28, 7.83, 7.20, 6.77, 5.01, 9.24,
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 16.99
                ? -80
                : value === 16.59
                ? -110
                : value === 11.36
                ? -90
                : value === 10.73
                ? -80
                : value === 8.28
                ? -100
                : value === 7.83
                ? -110
                : value === 7.20
                ? -80
                : value === 6.77
                ? -114
                : value === 5.01
                ? -105
                : value === 9.24
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}
*/


//FONDO 04

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          'DIC-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0066, 1.0133, 1.0201],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0,
              1.0066,
              1.0133,
              1.02,],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0067,
              1.0133,
              1.0191,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0065,
              1.0131,
              1.0209
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0067,
              1.0133,
            ],
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
              color: '#000000',
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
              color: '#000000', // Cambiar el color de los valores del eje Y
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Caja y \nbancos',
          'Financia-\nmiento a \nMediano \nPlazo',
          'Cesión de \nDerechos',
          'Financia-\nmiento a \nCorto \nPlazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [0.59, 63.65, 1.42, 34.34],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 0.59
                ? -80
                : value === 63.65
                ? -125
                : value === 1.42
                ? -100
                : value === 34.34
                ? -100
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Comercial',
          'Trans-\nporte',
          'Inmobi-\nliario',
          'Pesca',
          'Construcción',
          'Forestal', // Servicios 12.08
          'Alimentos',
          'Agrícola',
          'Publicidad',
          'Otros',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
             18.38,13.19,10.92,7.39,7.35,5.77,5.66,5.55,4.85,20.94
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 18.38
                ? -80
                : value === 13.19
                ? -85
                : value === 10.92
                ? -120
                : value === 7.39
                ? -80
                : value === 7.35
                ? -80
                : value === 5.77
                ? -80
                : value === 5.66
                ? -90
                : value === 5.55
                ? -90
                : value === 4.85
                ? -105
                : value === 20.94
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores,null
      );
    } catch (error) {}
  }
}



/*
//FONDO 05

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, layouts, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          'DIC-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0080, 1.0160, 1.0241],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0,
              1.0080,
              1.0140,
              1.0241,],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0053,
              1.0094,
              1.0190,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0073,
              1.0147,
              1.0229,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0075,
              1.0149,
            ],
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
              `${value === 1 ? '' : value===1.0094?"1.0079": this.formatoNumberMiles(value, 4)}`,
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
              color: '#000000',
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
              color: '#000000', // Cambiar el color de los valores del eje Y
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Financia-\nmiento a \nMediano \nPlazo',
          'Caja y \nbancos',
          'Factoring \ncon \nRecurso',
          'Financia-\nmiento a \nCorto Plazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [72.00,0.08, 22.38, 5.54],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 0.08
                ? -80
                : value === 72.00
                ? -140
                : value === 22.38
                ? -115
                : value === 5.54
                ? -100
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Hidrocarburos',
          'Industrial',
          'Construcción',
          'Telecomunicaciones', // Servicios 12.08
          'Seguridad',
          'Transporte',
          'Salud',
          'Inmobi-\nliario',
          'Agrícola',
          'Otros',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              14.85, 13.22, 12.53,12.05,10.70, 10.17, 7.96, 5.28,2.35 ,10.89,
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 14.85
                ? -80
                : value === 13.22
                ? -110
                : value === 12.53
                ? -140
                : value === 12.05
                ? -80
                : value ===10.70
                ? -80
                : value === 10.17
                ? -95
                : value === 7.96
                ? -90
                : value === 5.28
                ? -100
                : value === 2.35
                ? -100
                : value === 10.89
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}

*/

/*
//FONDO 06
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'SEP-23',
          '',
          '',
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0068, 1.0132, 1.0188],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0, 1.0067, 1.0133, 1.0201],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0066,
              1.0133,
              1.0200,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0067,
              1.0133,
              1.0189,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0066,
              1.0132,
              1.0213,
            ],
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Caja y \nbancos',
          'Financia-\nmiento a \nMediano \nPlazo',
          'Cesión de \nDerechos',
          'Financia-\nmiento a \nCorto Plazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [1.08, 53.50, 13.39, 32.04],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 1.08
                ? -80
                : value === 53.50
                ? -100
                : value === 13.39
                ? -100
                : value === 32.04
                ? -130
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Forestal',
          "Otros",
          'Transporte',
          'Inmobiliario',
          'Comercial',
          'Minería',
          'Construcción',
          'Publicidad',
          'Industrial', // Servicios 12.08
          'Servicios',

        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              20.51,1.30 ,17.42, 15.45,13.57, 10.28, 8.92, 5.96, 4.12, 2.46, 
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 20.51
                ? -80
                : value === 17.42
                ? -120
                : value === 15.45
                ? -80
                : value === 13.57
                ? -80
                : value ===10.28
                ? -80
                : value === 8.92
                ? -120
                : value === 5.96
                ? -105
                : value === 4.12
                ? -70
                : value === 2.46
                ? -80
                : value === 1.30
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}

*/

/*
//FONDO LENDING
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'SEP-23',
          '',
          '',
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0068, 1.0137, 1.0187],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0, 1.0067, 1.0134, 1.0201],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0066,
              1.0133,
              1.0200,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0066,
              1.0133,
              1.0194,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0065,
              1.0131,
              1.0209,
            ],
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Caja y \nbancos',
          'Financiamiento a \nMediano \nPlazo',
          'Cesión \nde \nDerechos',
          'Financia-\nmiento a \nCorto Plazo',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [0.92, 71.97, 4.14, 22.97],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 0.92
                ? -80
                : value === 71.97
                ? -185
                : value === 4.14
                ? -85
                : value === 22.97
                ? -130
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Industrial',
          "Constru-\ncción",
          'Educación',
          'Comercial',
          'Agrícola',
          'Trans-\nporte',
          'Automotriz',
          'Servicios',
          'Farmacéutico', // Servicios 12.08
          'Otros',

        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              20.87,17.10 ,13.86, 11.99,7.95, 7.07, 6.85, 6.61, 3.13, 4.56, 
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 20.87
                ? -80
                : value === 17.10
                ? -100
                : value === 13.86
                ? -80
                : value === 11.99
                ? -80
                : value ===7.95
                ? -80
                : value === 7.07
                ? -80
                : value === 6.85
                ? -105
                : value === 6.61
                ? -80
                : value === 3.13
                ? -80
                : value === 4.56
                ? -80
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}

*/


/*
//FONDO 07

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';

Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true })
  chartCanvasActivos!: ElementRef;
  @ViewChild('chartCanvasSectores', { static: true })
  chartCanvasSectores!: ElementRef;
  title = 'factsheet';

  ngOnInit(): void {
    this.renderChart();
    this.renderChartActivos();
    this.renderChartSectores();
  }

  renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-24',
          "",
          "",
          ""
        ],
        datasets: [
          {
            label: 'Sales',
            // data: [1.0000,1.0080,1.0159,1.0241,null,null,1.0000,1.0080,1.0160,1.0241,null,null,1.0000,1.0080,1.0160,1.0221,null,null,1.0000,1.0080,1.0156,1.0208,null,null,1.0000,1.0075],
            data: [1.0, 1.0027,1.0101],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          // {
          //   label: 'sale 2',
          //   data: [null, null, null, 1.0,
          //     1.0080,
          //     1.0140,
          //     1.0241,],
          //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
          //   borderColor: '#0A80BA',
          //   borderWidth: 1,
          //   pointStyle: 'circle',
          //   pointRadius: 1,
          // },
          // {
          //   label: 'sale 3',
          //   data: [
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     1.0,
          //     1.0053,
          //     1.0094,
          //     1.0190,
          //   ],
          //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
          //   borderColor: '#0A80BA',
          //   borderWidth: 1,
          //   pointStyle: 'circle',
          //   pointRadius: 1,
          // },
          // {
          //   label: 'sale 4',
          //   data: [
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     1.0,
          //     1.0073,
          //     1.0147,
          //     1.0229,
          //   ],
          //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
          //   borderColor: '#0A80BA',
          //   borderWidth: 1,
          //   pointStyle: 'circle',
          //   pointRadius: 1,
          // },
          // {
          //   label: 'sale 5',
          //   data: [
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     null,
          //     1.0,
          //     1.0075,
          //   ],
          //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
          //   borderColor: '#0A80BA',
          //   borderWidth: 1,
          //   pointStyle: 'circle',
          //   pointRadius: 1,
          // },
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
              `${value === 1 ? '' : value===1.0094?"1.0079": this.formatoNumberMiles(value, 4)}`,
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
              color: '#000000',
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
              color: '#000000', // Cambiar el color de los valores del eje Y
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

  renderChartActivos(): void {
    const ctx = this.chartCanvasActivos.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          'Financia-\nmiento a \nCorto \nPlazo',
          'Cesión \nde \nDerechos',
          'Financia-\nmiento a \nMediano \nPlazo',
          'Caja y \nbancos',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [54.21, 17.69,26.40,1.70],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 20, // Ajuste del margen izquierdo
            right: 20, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 80, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 1.70
                ? -100
                : value === 17.69
                ? -125
                : value === 26.40
                ? -130
                : value === 54.21
                ? -100
                : value === 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
            },
          },
        },
      },
    };

    new Chart(ctx, chartConfig);
  }
  renderChartSectores(): void {
    const ctx = this.chartCanvasSectores.nativeElement.getContext('2d');

    const chartConfig: any = {
      type: 'doughnut',
      data: {
        labels: [
          // 'Financiero',
          // 'Seguridad',
          // 'Transporte',
          // 'Construcción',
          'Servicios',
          'Hidrocarburos',
          'Inmobi-\nliario',
          'Educación',
          // 'Agrícola', // Servicios 12.08
          // 'Otros',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
              38.06,
              26.86,
              17.99,
              17.09
            ],
            backgroundColor: [
              '#0089B8', // Rojo 003459
              '#17B0EA', // Azul 005980
              '#005980', // Amarillo 0089B8
              '#003459', // Verde 17B0EA
            ],
          },
        ],
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false, // Desactiva el mantenimiento de la relación de aspecto
        layout: {
          padding: {
            left: 100, // Ajuste del margen izquierdo
            right: 100, // Ajuste del margen derecho
            top: 100, // Ajuste del margen superior
            bottom: 100, // Ajuste del margen inferior
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#10273D',
            anchor: 'end', // Anclar las etiquetas fuera del gráfico
            align: 'start',
            offset: (context) => {
              const index = context.dataIndex;
              const data = context.dataset.data;
              const value = data[index];

              // Aplica un offset mayor para valores más grandes
              return value === 38.06
                ? -100
                : value === 26.86
                ? -85
                : value === 17.99
                ? -95
                : value === 17.09
                ? -80
                : value ===6.13
                ? -60
                : value === 5.98
                ? -105
                : value === 3.60
                ? -90
                : value === 2.66
                ? -100
                : value === 2.44
                ? -100
                : value === 30.55
                ? -70
                : 0;
            },
            formatter: (value: any, ctx: any) => {
              let sum = 0;

              let dataArr = ctx.chart.data.datasets[0].data;
              const label = ctx.chart.data.labels[ctx.dataIndex];
              dataArr.forEach((data) => {
                sum += data;
              });
              let percentage = ((value / sum) * 100).toFixed(2) + '%';
              return percentage + '\n' + label; // Mostrar porcentaje
            },
            font: {
              size: 19, // Tamaño de la fuente
              // weight: 'bold', // Estilo de la fuente (negrita)
              family: 'Poppins, sans-serif', // Fuente personalizada
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

  async generarPDF() {
    try {
      console.log('estoy antes de la imagen');
      const imagenChart = this.chartCanvas.nativeElement.toDataURL('image/png');
      const imagenChartActivos =
        this.chartCanvasActivos.nativeElement.toDataURL('image/png');
      const imagenChartSectores =
        this.chartCanvasSectores.nativeElement.toDataURL('image/png');

      await LevFactSheetPDF.create(
        imagenChart,
        imagenChartActivos,
        imagenChartSectores
      );
    } catch (error) {}
  }
}
 */
/*
// PRUEBA NUEVO FS

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartOptions, layouts, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LevFactSheetPDF } from './lev-factsheet';
import { BrowserModule } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { JsonService } from './json.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';


Chart.register(ChartDataLabels, ...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  providers:[JsonService,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit,AfterViewInit  {
  @ViewChild('chartWrapper', { static: false }) chartWrapper!: ElementRef;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('chartWrapperActivos', { static: false }) chartWrapperActivos!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true }) chartCanvasActivos!: ElementRef;
  @ViewChild('chartContainerActivos', { static: true }) chartContainerActivos!: ElementRef;
  @ViewChild('chartVC', { static: true }) chartVC!: ElementRef;
  chart!: Chart;

  data_fs: any;
  activos_nombres=[];
  activos_valor=[];
  sectores_nombres=[];
  sectores_valor=[];
  async ngOnInit(): Promise<void> {
 
  }

  constructor(private json : JsonService){

  }
  
  async ngAfterViewInit() {
    this.data_fs= await this.json.getData("assets/data.json");
    console.log(this.data_fs);
    this.data_fs.activos.map((x)=>{
      this.activos_nombres.push(Object.values(x)[0])
      this.activos_valor.push(Object.values(x)[1])
    })
    this.data_fs.sectores.map((x)=>{
      this.sectores_nombres.push(Object.values(x)[0])
      this.sectores_valor.push(Object.values(x)[1])
    })

    this.createChart();
    this.createChartActivos();
    this.renderChart();
  }
  async createChart() {


    const data: ChartData<'doughnut'> = {
      // labels: ['Construcción', 'Salud', 'Agroindustrial', 'Seguridad','Telecomunicaciones','Educación','Forestal','Servicios','Otros'],
      labels:this.sectores_nombres,
      datasets: [
        {
          label: 'Valores',
          // data: [21.65, 11.65,10.48 ,10.27, 6.17,6.01,5.96,4.84,22.96],
          data:this.sectores_valor,
          backgroundColor: ['#117496', '#17B0EA', '#003459', '#0089B8','#3FBEEE','#22CFFA','#0089B8','#00A8E8','#001C36'],
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      cutout:"75%",
      animation: false, 
      plugins: {
        tooltip: { enabled: false },
        legend: {
          display: false,
        },
        datalabels:{
          display:false
        }
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data,
      options,
      plugins: [
        {
          id: 'customLabels',
          afterDraw: (chart) => this.addHtmlLabels(chart,this.chartContainer.nativeElement),
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
      cutout:"75%",
      animation: false, 
      plugins: {
        tooltip: { enabled: false }, 
        legend: {
          display: false,
        },
        datalabels:{
          display:false
        }
      },
    };

    this.chart = new Chart(this.chartCanvasActivos.nativeElement, {
      type: 'doughnut',
      data,
      options,
      plugins: [
        {
          id: 'customLabels',
          afterDraw: (chart) => this.addHtmlLabels(chart,this.chartContainerActivos.nativeElement),
        },
      ],
    });
  }

  addHtmlLabels(chart: Chart, contenedor:any) {
    const container = contenedor;
    container.innerHTML = ''; 

    const meta = chart.getDatasetMeta(0); 
    const ctx = chart.ctx;
    const total = (chart.data.datasets[0].data.reduce((a, b) => (a as number) + (b as number), 0)) as number;
    meta.data.forEach((bar, index) => {
      const position = bar.tooltipPosition(true);
      const { startAngle, endAngle } = bar.getProps(['startAngle', 'endAngle'], true);
      const angle = (startAngle + endAngle) / 2;
      const label2 = chart.data.labels[index]
      const { outerRadius } = bar.getProps(['outerRadius'], true);
      const radius = outerRadius * 0.96;
      const x = chart.width / 2 + radius * Math.cos(angle);
      const y = chart.height / 2 + radius * Math.sin(angle);
      
      const labelX = chart.width / 2 + radius * 1.3 * Math.cos(angle);
      const labelY = chart.height / 2 + radius * 1.3 * Math.sin(angle);

      
      const value = (chart.data.datasets[0].data[index]) as number;
      const percentage = ((value / total) * 100).toFixed(1); 
      
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(labelX, labelY);

      const label = document.createElement('div');
      label.innerHTML = `<div style='color: #10273D;text-align: end;font-size: 40px; font-weight: 700;'>
      ${value}%
      </div> <div style='color: #10273D; font-weight: 700;'>${label2}</div>`;
      label.style.position = 'absolute';
      label.style.left = `${labelX}px`;
      label.style.top = `${labelY}px`;
      label.style.transform = 'translate(-50%, -50%)';
      label.style.fontSize = '28px';

      container.appendChild(label);
    });
  }

  renderChart(): void {
    const ctx = this.chartVC.nativeElement.getContext('2d');

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // labels: ["","SEP-2023","","","",'',"","DIC-23","", "","","",'',"MAR-24","","","","","","","","JUN-24","","","","","","SEP-24","",""],
        labels: [
          'DIC-23',
          '',
          '',
          'MAR-24',
          '',
          '',
          'JUN-24',
          '',
          '',
          'SEP-24',
          '',
          '',
          'DIC-24',
          '',
          '',
          '',
          '',
          '',
        ],
        datasets: [
          {
            label: 'Sales',
            data: [1.0, 1.0080, 1.0160, 1.0241],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 2',
            data: [null, null, null, 1.0,
              1.0080,
              1.0160,
              1.0221,],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 3',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0080,
              1.0156,
              1.0208,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 4',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0075,
              1.0149,
              1.0230,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#0A80BA',
            borderWidth: 1,
            pointStyle: 'circle',
            pointRadius: 1,
          },
          {
            label: 'sale 5',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              1.0,
              1.0075,
            ],
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

  async generar(){
    let imgSectores;
    let imgActivos;
    if (!this.chartWrapper) {
      console.error('No se encontró el contenedor del gráfico');
      return;
    }

    const elementSectores = this.chartWrapper.nativeElement as HTMLDivElement;

    await html2canvas(elementSectores, { backgroundColor: null }).then((canvas) => {
      let imagenBase64 = canvas.toDataURL('image/png');
      imgSectores=imagenBase64
    });

    const elementActivos = this.chartWrapperActivos.nativeElement as HTMLDivElement;

    await html2canvas(elementActivos, { backgroundColor: null }).then((canvas) => {
      let imagenBase64 = canvas.toDataURL('image/png');
      imgActivos=imagenBase64
    });

    const imagenChart = this.chartVC.nativeElement.toDataURL('image/png');

    await LevFactSheetPDF.create(
      imagenChart,
      imgActivos,
      imgSectores,
    );
    
  }
}
*/