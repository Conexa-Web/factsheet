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
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';

Chart.register(ChartDataLabels, ...registerables);

@Component({
  selector: 'fs-nuevo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [JsonService],
  templateUrl: './fs-nuevo.component.html',
  styleUrls: ['./fs-nuevo.component.scss'],
})
export class FsNuevoComponent implements OnInit {
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
  datosPorHoja: Record<string, any[]> = {};
  datos_final: any;
  prevComent: string = "";

  constructor(
    private json: JsonService,
  ) {}

  async ngOnInit(): Promise<void> { }

  alternarValorGrafico(datas) {
    const ordenado = [...datas].sort((a, b) => b.valor - a.valor);

    const alternado = [];
    while (ordenado.length) {
        if (ordenado.length) alternado.push(ordenado.shift()); // Mayor
        if (ordenado.length) alternado.push(ordenado.pop());   // Menor
    }

    return alternado;
  }

  async ejecutarGraficas() {
    // Carga del JSON desde assets (por ejemplo, fondo07.json, lending.json)
    //this.data_fs = await this.json.getData("assets/data/fondo07.json");
    // this.data_fs = await this.json.getData("assets/data/lending.json");
    
    // Procesa los datos de "activos"
    const dataActivo = this.alternarValorGrafico(this.data_fs.activos);
    dataActivo.forEach((x: any) => {
      this.activos_nombres.push(x.nombre_activo);
      this.activos_valor.push(x.valor);
    });

    // Procesa los datos de "sectores"
    const dataSector = this.alternarValorGrafico(this.data_fs.sectores);
    dataSector.forEach((x: any) => {
      this.sectores_nombres.push(x.sector);
      this.sectores_valor.push(x.valor);
    });

    // Crea los gráficos doughnut de sectores y activos
    this.createChart();
    this.createChartActivos();

    // Crea el gráfico de líneas usando "valor_cuota"
    this.renderChart();
  }

  prevComentarios(data_fs) {
    let activo_texto = '';
    let sectores_texto = '';

    //TEXTO PARA ACTIVOS
    let activos_data = data_fs.activos.filter((x) => x.nombre_activo !== "Caja y Bancos");
    activos_data.sort((a, b) => b.valor - a.valor);

    activos_data.forEach((activo, i) => {
      let nombreActivo = activo.nombre_activo;

      // Verificar si el nombre contiene la palabra "Financiamiento" y agregar "s" solo a esa palabra
      if (nombreActivo.toLowerCase().includes("financiamiento")) {
        nombreActivo = nombreActivo.replace(/financiamiento/gi, 'financiamientos');
      }

      activo_texto += `${nombreActivo.toLowerCase()} con ${activo.valor.toFixed(2)}%${i === activos_data.length - 1
          ? ''
          : i === activos_data.length - 2
            ? ' y '
            : ', '
        }`;
    });

    //TEXTO PARA SECTORES
    const primerosSeis = data_fs.sectores.slice(0, 6);
    const restantes = data_fs.sectores.slice(6);
    const suma_restante = restantes.reduce((acc, curr) => acc + curr.valor, 0);

    primerosSeis.sort((a, b) => b.valor - a.valor);

    primerosSeis.forEach((sector, i) => {
      sectores_texto += `${sector.valor.toFixed(2)}% en ${sector.sector.toLowerCase()}${i === primerosSeis.length - 1
        ? ` y ${this.formatoNumberMiles(suma_restante, 2)}% en los demás sectores`
        : ', '
      }`;
    });

    let parrafo_1 = `El valor cuota al cierre de ${data_fs.mes.toLowerCase()} alcanzó ${data_fs.caracteristicas_fondo.iso} ${data_fs.caracteristicas_fondo.valor_cuota}. Con este resultado la rentabilidad acumulada de los últimos 12 meses es de ${(data_fs.rendimiento_fondo.doce_meses === undefined || data_fs.rendimiento_fondo.doce_meses === 0) ? "—" : `${data_fs.rendimiento_fondo.doce_meses}%`}. La Gestora viene haciendo seguimiento a la cartera de créditos otorgados, así como impulsando la diversificación de la cartera de clientes; ambas iniciativas deberían contribuir a alcanzar la rentabilidad anual objetivo del Fondo.`;
    let parrafo_2 = `Las operaciones más frecuentes son: ${activo_texto}. Los sectores en los que se invierte mantienen un alto potencial de crecimiento, destacando: ${sectores_texto}. La Gestora mantiene su énfasis en la diversificación sectorial, con el objetivo de mantener la participación en cada industria por debajo del 20% de los activos del Fondo.`;
    let parrafo_3 = `El Fondo cerró el mes con una liquidez de ${data_fs.activos.find((x) => x.nombre_activo === "Caja y Bancos").valor}%, ubicándose ${data_fs.activos.find((x) => x.nombre_activo === "Caja y Bancos").valor > 10? 'por encima' : 'dentro' } del rango meta de hasta 10% de los activos. La gestora está monitoreando activamente el contexto macroeconómico y financiero local, enfocándose en los sectores, empresas e instrumentos de inversión con mejores perspectivas para los inversionistas del fondo.`;

    this.prevComent = parrafo_1 + "\n\n" + parrafo_2 + "\n\n" + parrafo_3;
  }

  async onFileChange(event: any) {
    this.data_fs = await this.json.getData("assets/data/fondo01_modelo.json");

    console.log(this.data_fs);

    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });

      //const sheetName = workbook.SheetNames.includes('Hoja1') ? 'Hoja1' : workbook.SheetNames[0];
      //const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];
      workbook.SheetNames.forEach(sheetName => {
        const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];
        this.datosPorHoja[sheetName] = XLSX.utils.sheet_to_json(sheetData); // Guardar cada hoja en una lista separada
      });

      console.log(this.datosPorHoja);

      //this.data_fs = this.data_fs.map((item: any) => {
      if (Object.keys(this.datosPorHoja).length > 0) {
        this.data_fs.activos = this.datosPorHoja['activos'];
        this.data_fs.sectores = this.datosPorHoja['sectores'];

        this.data_fs.rendimiento_fondo = this.datosPorHoja['rendimiento_fondo'][0];

        this.data_fs.caracteristicas_fondo.fondo = this.datosPorHoja['caracteristicas_fondo'][0]['fondo'];
        this.data_fs.caracteristicas_fondo.moneda = this.datosPorHoja['caracteristicas_fondo'][0]['moneda'];
        this.data_fs.caracteristicas_fondo.iso = this.datosPorHoja['caracteristicas_fondo'][0]['iso'];
        this.data_fs.caracteristicas_fondo.valor_cuota_al = this.datosPorHoja['caracteristicas_fondo'][0]['valor_cuota_al'];
        this.data_fs.caracteristicas_fondo.aum = this.datosPorHoja['caracteristicas_fondo'][0]['aum'];
        this.data_fs.caracteristicas_fondo.valor_cuota = this.datosPorHoja['caracteristicas_fondo'][0]['valor_cuota'];
        this.data_fs.caracteristicas_fondo.aniversario = this.datosPorHoja['caracteristicas_fondo'][0]['aniversario'];
        
        this.data_fs.fecha = this.datosPorHoja['datos'][0]['fecha'];
        this.data_fs.mes = this.datosPorHoja['datos'][0]['mes'];
        this.data_fs.anio = this.datosPorHoja['datos'][0]['anio'];

        const valor_cuota = Object.values(
          this.datosPorHoja['valor_cuota'].reduce((acc, { periodo, valores }) => {
            if (!acc[periodo]) {
              acc[periodo] = { periodo, valores: [] };
            }
            acc[periodo].valores.push(parseFloat(valores));
            return acc;
          }, {})
        );

        this.data_fs.valor_cuota = valor_cuota;
      }

      console.log("final", this.data_fs);
      this.ejecutarGraficas();
      this.prevComentarios(this.data_fs);

      //this.datos = XLSX.utils.sheet_to_json(sheetData);
    };
    reader.readAsBinaryString(target.files[0]);
    /* this.generar("edit") */
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
    
    // Ordenamos los datos por valor para mejor distribución
    const sortedData = meta.data.map((bar, index) => ({
      bar,
      index,
      value: chart.data.datasets[0].data[index] as number,
      label: chart.data.labels[index]
    })).sort((a, b) => b.value - a.value);

    // Calculamos el espaciado base
    const baseRadius = meta.data[0].getProps(['outerRadius'], true)['outerRadius'];
    // Radio base para las etiquetas
    const labelRadius = baseRadius * (es_sector ? 1.24 : 1.22);

    sortedData.forEach((item, i) => {
      const { startAngle, endAngle } = item.bar.getProps(['startAngle', 'endAngle'], true);
      const angle = (startAngle + endAngle) / 2;
      const label2 = item.label as string;
      const value = item.value;

      // Calculamos el radio adicional para textos largos
      const isLongText = label2.toLowerCase().includes('financiamiento');
      const extraRadius = isLongText ? baseRadius * 0.06 : 0;
      const finalRadius = labelRadius + extraRadius;

      // Calculamos la posición de la etiqueta
      const labelX = chart.width / 2 + finalRadius * Math.cos(angle);
      const labelY = chart.height / 2 + finalRadius * Math.sin(angle);

      // Creamos el contenedor de la etiqueta
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.left = `${labelX}px`;
      label.style.top = `${labelY}px`;
      label.style.transform = 'translate(-50%, -50%)';
      label.style.textAlign = 'center';
      label.style.minWidth = '200px';

      // Ajustamos el estilo según el ángulo
      const isLeft = Math.cos(angle) < 0;
      const isTop = Math.sin(angle) < 0;
      
      // Ajustamos el margen según la posición
      const marginAdjust = isLeft ? 15 : 5;
      if (isLeft) {
        label.style.marginLeft = `-${marginAdjust}px`;
      } else {
        label.style.marginLeft = `${marginAdjust}px`;
      }

      // Creamos el contenido de la etiqueta
      label.innerHTML = `
        <div style='color: #10273D; font-size: 36px; font-weight: 700; line-height: 1.0'>
        ${this.formatoNumberMiles(value)}%
        </div>
        <div style='color: #10273D; font-weight: 700; font-size: 28px; line-height: 1.0'>
          ${label2}
        </div>
      `;

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
    const totalLength = (validElements.length - 1) * (n - 1) + n;
    const labels = new Array(totalLength).fill('');
    validElements.forEach((item: any, index: number) => {
      const offset = index * (n - 1);
      labels[offset] = item.periodo;
    });
    // Agregamos un label extra para el espacio a la derecha
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
        maintainAspectRatio: true,
        devicePixelRatio: 2,
        layout: {
          padding: {
            right: 40 // Agregamos padding solo a la derecha
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 5,
            color: '#59BCE2',
            font: {
              size: 15,
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
              font: { size: 15, family: 'TT Hoves Pro Trial' },
            },
            type: 'category'
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            beginAtZero: false,
            ticks: {
              color: '#10273D',
              font: { size: 15, family: 'TT Hoves Pro Trial' },
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

/*   async configurarCanvas() {
    let imgSectores: any;
    let imgActivos: any;
    let imagenChart: any;
    if (!this.chartWrapper || !this.chartVC || !this.chartWrapperActivos || !this.data_fs) {
        console.error('Error: Falta algún contenedor o data_fs no está definido');
        return {};
    }

    const elementChart = this.chartVC.nativeElement as HTMLDivElement;
    const elementSectores = this.chartWrapper.nativeElement as HTMLDivElement;
    const elementActivos = this.chartWrapperActivos.nativeElement as HTMLDivElement;
    
    await html2canvas(elementChart, { scale: 2, backgroundColor: 'white' }).then((canvas) => {
      imagenChart = canvas.toDataURL('image/png');
    });

    await html2canvas(elementSectores, { scale: 2, backgroundColor: 'white' }).then((canvas) => {
      imgSectores = canvas.toDataURL('image/png');
    });

    await html2canvas(elementActivos, { scale: 2, backgroundColor: 'white' }).then((canvas) => {
      imgActivos = canvas.toDataURL('image/png');
    });

    return {
      imagenChart,
      imgActivos,
      imgSectores
    }
  } */

  async configurarCanvas() {
    if (!this.chartWrapper || !this.chartVC || !this.chartWrapperActivos || !this.data_fs) {
        console.error('Error: Falta algún contenedor o data_fs no está definido');
        return {};
    }

    const elementChart = this.chartVC.nativeElement as HTMLDivElement;
    const elementSectores = this.chartWrapper.nativeElement as HTMLDivElement;
    const elementActivos = this.chartWrapperActivos.nativeElement as HTMLDivElement;

    const [imagenChart, imgSectores, imgActivos] = await Promise.all([
        html2canvas(elementChart, { scale: 2, backgroundColor: 'white' }).then(canvas => canvas.toDataURL('image/png')),
        html2canvas(elementSectores, { scale: 2, backgroundColor: 'white' }).then(canvas => canvas.toDataURL('image/png')),
        html2canvas(elementActivos, { scale: 2, backgroundColor: 'white' }).then(canvas => canvas.toDataURL('image/png'))
    ]);

    return { imagenChart, imgActivos, imgSectores };
  }

  async generar(accion:string = "") {
    try {
      const canva = await this.configurarCanvas();

      if (Object.keys(canva).length > 0) {
        await LevFactSheetPDF.create(canva.imagenChart, canva.imgActivos, canva.imgSectores, this.data_fs, this.prevComent, accion);
      }
    } catch (error) {
      console.log("Error", error)
    }
  }
}

