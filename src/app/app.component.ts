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
import { JsonService } from './json.service';
import { LevFactSheetPDF } from './lev-factsheet';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from './shared/components/loading/loading.component'
import moment from 'moment';
import { saveStorageData_fs, getStorageData_fs } from './shared/utils/localStorage';
import { convertirFechaDesdeExcel, formatDecimal, formatoNumberMiles, formatTextoFecha } from './shared/utils/format';
import { EjemploServiceService } from './shared/services/ejemplo-service.service';

Chart.register(ChartDataLabels, ...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, LoadingComponent],
  providers: [JsonService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('chartWrapper', { static: false }) chartWrapper!: ElementRef;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('chartWrapperActivos', { static: false }) chartWrapperActivos!: ElementRef;
  @ViewChild('chartCanvasActivos', { static: true }) chartCanvasActivos!: ElementRef;
  @ViewChild('chartContainerActivos', { static: true }) chartContainerActivos!: ElementRef;
  @ViewChild('chartVC', { static: true }) chartVC!: ElementRef;

  chart!: Chart; // Gráfico lineas (doughnut)
  chart2!: Chart; // Gráfico de activos (doughnut)
  chart3!: Chart; // Gráfico de sectores (doughnut)
  data_fs: any;
  activos_nombres: string[] = [];
  activos_valor: number[] = [];
  sectores_nombres: string[] = [];
  sectores_valor: number[] = [];
  datosPorHoja: Record<string, any[]> = {};
  prevComent: string = "";
  isLoading = false;
  statusMessage_1 = "";
  ascendente = "ASC";
  descendente = "DESC";
  opcionSeleccionada: string = '';
  isPlantillaCargada: boolean = true;

  constructor(
    private json: JsonService,
    private ejemploServiceService: EjemploServiceService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.ejemploServiceService.list();
      console.log("dataaaaa", data)

      this.data_fs = await this.json.getData("assets/data/fondos_modelo.json");
      console.log("inicio data_fs", this.data_fs)

      const { storage_data } = getStorageData_fs();

      if (storage_data) {
        console.log("data storage", JSON.parse(storage_data))

        this.data_fs = JSON.parse(storage_data);
        this.isPlantillaCargada = false;
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  clearPagina() {
    localStorage.clear();
    this.prevComent = "";
    window.location.reload();
  }

  updatedComent(event) {
    localStorage.setItem("PREV_COMENTARIO", event);
  }

  alternarValor(datas, order = this.ascendente) {
    const ordenado = order === this.descendente
      ? [...datas].sort((a, b) => b.valor - a.valor)
      : [...datas].sort((a, b) => a.valor - b.valor);

    let alternado = [];
    while (ordenado.length) {
      if (ordenado.length) alternado.push(ordenado.shift()); // Mayor
      if (ordenado.length) alternado.push(ordenado.pop());   // Menor
    }

    return alternado;
  }

  alternarValorGrafico(datas, type) {
    let alternado = this.alternarValor(datas, this.descendente);

    if (type === "sector") {
      alternado = alternado.map(item => {
        const newItem = { ...item };
        if (newItem.sector.toLowerCase() === "telecomunicaciones") {
          newItem.sector = "Tele \ncomunica \nciones";
        }
        if (newItem.sector.toLowerCase() === "alquiler de equipos") {
          newItem.sector = "Alquiler de\nequipos";
        }
        if (newItem.sector.toLowerCase() === "hidrocarburos") {
          newItem.sector = "Hidro \ncarburos";
        }
        return newItem;
      })
    }
    return alternado;
  }

  async ejecutarGraficas(dataFondoFs) {
    console.log("ejecutarGraficas - dataFondoFs", dataFondoFs)
    // Procesa los datos de "activos"
    const dataActivo = this.alternarValorGrafico(dataFondoFs.activos, "activo");
    dataActivo.forEach((x: any) => {
      this.activos_nombres.push(x.nombre_activo);
      this.activos_valor.push(x.valor);
    });

    // Procesa los datos de "sectores"
    const dataSector = this.alternarValorGrafico(dataFondoFs.sectores, "sector");
    dataSector.forEach((x: any) => {
      this.sectores_nombres.push(x.sector);
      this.sectores_valor.push(x.valor);
    });

    this.renderChartLineas(dataFondoFs); // Gráfico de líneas.
    this.createChartSectores(); // Gráfico doughnut de sectores.
    this.createChartActivos(); // Gráfico doughnut activos.

  }

  obtenerArticulo_Activo(nombreActivo) {
    let articulo = '';

    if (nombreActivo.startsWith('cesión') || nombreActivo.startsWith('caja')) {
      articulo = 'la';
    } else if (nombreActivo.startsWith('capital') || nombreActivo.startsWith('factoring')) {
      articulo = 'el';
    } else if (nombreActivo.startsWith('financiamientos')) {
      articulo = 'los';
    }

    return articulo;
  }

  prevComentarios(data_fs) {
    let activo_texto = '';
    let sectores_texto = '';

    //TEXTO PARA ACTIVOS
    let activos_data = data_fs.activos.filter((x) => x.nombre_activo !== "Caja y Bancos");
    activos_data.sort((a, b) => b.valor - a.valor);

    activos_data.forEach((activo, i) => {
      let nombreActivo_original = activo.nombre_activo;
      let nombreActivo = activo.nombre_activo.toLowerCase();

      // Verificar si el nombre contiene la palabra "Financiamiento" y agregar "s" solo a esa palabra
      if (nombreActivo.includes("financiamiento")) {
        nombreActivo = nombreActivo_original.replace(/financiamiento/gi, 'financiamientos').toLowerCase();
      }

      activo_texto += `${this.obtenerArticulo_Activo(nombreActivo)
        } ${nombreActivo} con ${activo.valor.toFixed(2)}%${
        i === activos_data.length - 1 ? ''
          : i === activos_data.length - 2 ? ' y '
            : ', '
      }`;
    });

    //TEXTO PARA SECTORES
    const ordenarSectores = data_fs.sectores.sort((a, b) => b.valor - a.valor);
    console.log("ordenarSectoressss", ordenarSectores)

    const primerosSeis = ordenarSectores.filter(item => item.sector !== 'Otros').slice(0, 6);
    
    const idsTop = primerosSeis.map(s => s.sector);
    const restantes = ordenarSectores.filter(s => !idsTop.includes(s.sector));

    const suma_restante = restantes.reduce((acc, curr) => acc + curr.valor, 0);

    primerosSeis.forEach((sector, i) => {
      const porcentaje = `${sector.valor.toFixed(2)}% en ${sector.sector.toLowerCase()}`;
      const esUltimo = i === primerosSeis.length - 1;
      const mostrarRestante = suma_restante && Number(suma_restante) !== 0;
  
      sectores_texto += porcentaje;
  
      if (esUltimo && mostrarRestante) {
        sectores_texto += ` y ${formatoNumberMiles(suma_restante, 2)}% en los demás sectores`;
      } else if (!esUltimo) {
        sectores_texto += ', ';
      }
    });

    // Construir Párrafos
    const {
      iso,
      valor_cuota,
      es_nuevo,
      fondo,
      ini_op
    } = data_fs.caracteristicas_fondo;
    
    const {
      doce_meses,
      ytd: nueve_meses_ytd
    } = data_fs.rendimiento_fondo;
    
    let completar_parrafo_1 = '';
    let completar_parrafo_3 = '';
    const PYME_7 = "Fondo Impulso PYME 07";
    const cajaBancos = data_fs.activos.find(x => x.nombre_activo === "Caja y Bancos");
    const liquidez_cajaBancos = cajaBancos?.valor ?? 0;

    if (es_nuevo) {
      completar_parrafo_1 = `con este resultado la rentabilidad acumulada desde el ${formatTextoFecha(ini_op)} es de ${nueve_meses_ytd.toFixed(2)}%`;
      completar_parrafo_3 = `lo que resulta normal en un fondo nuevo en la etapa inicial de levantamiento de capitales`;
    } else {
      if (fondo === PYME_7) {
        completar_parrafo_1 = !nueve_meses_ytd ? "—" : `9 meses es de ${nueve_meses_ytd.toFixed(2)}%`;
      } else {
        completar_parrafo_1 = !doce_meses ? "—" : `12 meses es de ${doce_meses.toFixed(2)}%`;
      }

      completar_parrafo_1 = `con este resultado la rentabilidad acumulada de los últimos ${completar_parrafo_1}`;
      completar_parrafo_3 = `ubicándose ${liquidez_cajaBancos > 10 ? 'por encima' : 'dentro'} del rango meta de hasta 10.00% de los activos`;
    }

    let parrafo_1 = `El valor cuota al cierre de ${data_fs.mes.toLowerCase()} alcanzó ${iso} ${valor_cuota.toFixed(4)}, ${completar_parrafo_1}. La Gestora viene haciendo seguimiento a la cartera de créditos otorgados, así como impulsando la diversificación de la cartera de clientes; ambas iniciativas deberían contribuir a alcanzar la rentabilidad anual objetivo del Fondo.`;
    let parrafo_2 = `Las operaciones más frecuentes son: ${activo_texto}. Los sectores en los que se invierte mantienen un alto potencial de crecimiento, destacando: ${sectores_texto}. La Gestora mantiene su énfasis en la diversificación sectorial, con el objetivo de mantener la participación en cada industria por debajo del 20.00% de los activos del Fondo.`;
    let parrafo_3 = `El Fondo cerró el mes con una liquidez de ${liquidez_cajaBancos.toFixed(2)}%, ${completar_parrafo_3}. La gestora está monitoreando activamente el contexto macroeconómico y financiero local, enfocándose en los sectores, empresas e instrumentos de inversión con mejores perspectivas para los inversionistas del fondo.`;

    this.prevComent = parrafo_1 + "\n\n" + parrafo_2 + "\n\n" + parrafo_3;
    localStorage.setItem("PREV_COMENTARIO", this.prevComent);
  }

  obtenerNameFondo(index) {
    let name_fondo = `fondo_${index + 1}`;
    return name_fondo;
  }

  transformarPorFondo(data, fondoKey, valor_propiedad) {
    return data.flatMap((item) => {
      if (item[fondoKey] !== undefined) {
        return {
          [valor_propiedad]: item[valor_propiedad],
          valor: item[fondoKey]
        };
      }
      return [];
    });
  }

  obtenerCabeceraFondo(dataHoja) {
    const cabecera_activos = Object.keys(dataHoja.reduce((acc, item) => (
      { ...acc, ...item }
    ), {})).filter(key => key.startsWith('fondo_'));

    return cabecera_activos;
  }

  fusionarData(datosPorHoja) {
    if (Object.keys(datosPorHoja).length > 0) {
      const dataCaracteristicasFondo = datosPorHoja['caracteristicas_fondo'];
      const dataRendimientoFondo = datosPorHoja['rendimiento_fondo'];
      const dataValorCuota = datosPorHoja['valor_cuota'];
      const dataActivos = datosPorHoja['activos'];
      const dataSectores = datosPorHoja['sectores'];
      const dataRendimientoAnio = datosPorHoja['rendimiento_anio'];

      // Carga - caracteristicas_fondo -----------------------------------------
      dataCaracteristicasFondo.forEach((item_caract, index) => {
        let name_fondo = this.obtenerNameFondo(index);

        this.data_fs[name_fondo].caracteristicas_fondo.valor_cuota_al = typeof item_caract.valor_cuota_al === 'number'
          ? convertirFechaDesdeExcel(item_caract.valor_cuota_al)
          : item_caract.valor_cuota_al;
        this.data_fs[name_fondo].caracteristicas_fondo.fondo = item_caract.fondo || "";
        this.data_fs[name_fondo].caracteristicas_fondo.moneda = item_caract.moneda || "";
        this.data_fs[name_fondo].caracteristicas_fondo.ini_op = item_caract.ini_op || "";
        this.data_fs[name_fondo].caracteristicas_fondo.vencimiento = item_caract.vencimiento || "";
        this.data_fs[name_fondo].caracteristicas_fondo.iso = item_caract.iso || "";
        this.data_fs[name_fondo].caracteristicas_fondo.aum = item_caract.aum || 0;
        this.data_fs[name_fondo].caracteristicas_fondo.valor_cuota = item_caract.valor_cuota || 0;
        this.data_fs[name_fondo].caracteristicas_fondo.inv_min = item_caract.inv_min || 0;
        this.data_fs[name_fondo].caracteristicas_fondo.rentabilidad_objetivo = item_caract.rentabilidad_objetivo || "";
        this.data_fs[name_fondo].caracteristicas_fondo.aniversario = Number(item_caract.aniversario) !== 0 ? item_caract.aniversario : null;
        this.data_fs[name_fondo].caracteristicas_fondo.es_nuevo = item_caract.es_nuevo || 0;
      })
      console.log("completado carga - caracteristicas_fondo ... 1");

      // Carga - rendimiento_fondo --------------------------------------------
      dataRendimientoFondo.forEach((item_rendimiento, index) => {
        let name_fondo = this.obtenerNameFondo(index);

        this.data_fs[name_fondo].rendimiento_fondo.tipo = item_rendimiento.tipo || "";
        this.data_fs[name_fondo].rendimiento_fondo.actual = item_rendimiento.actual || 0;
        this.data_fs[name_fondo].rendimiento_fondo.tres_meses = item_rendimiento.tres_meses || 0;
        this.data_fs[name_fondo].rendimiento_fondo.ytd = item_rendimiento.ytd || 0;
        this.data_fs[name_fondo].rendimiento_fondo.doce_meses = item_rendimiento.doce_meses || 0;
      })
      console.log("completado carga - rendimiento_fondo ... 2");

      // Ordenar - valor_cuota por Periodo y Fondo ----------------------------
      const valor_cuota = {};
      const periodosMap = {};

      //-- Agrupar por periodo
      dataValorCuota.forEach(entry => {
        const { periodo, ...fondosData } = entry;
        if (!periodo) return;

        if (!periodosMap[periodo]) {
          periodosMap[periodo] = [];
        }
        periodosMap[periodo].push(fondosData);
      });

      //-- Reorganizar por fondo
      Object.entries(periodosMap).forEach(([periodo, registros]) => {
        if (!Array.isArray(registros) || registros.length === 0) return;

        const primerRegistro = registros.find(r => typeof r === 'object' && r !== null);
        if (!primerRegistro) return;

        const fondosEnPeriodo = Object.keys(primerRegistro);

        fondosEnPeriodo.forEach(fondo => {
          if (!valor_cuota[fondo]) {
            valor_cuota[fondo] = [];
          }

          const valores = registros.flatMap(r => r[fondo] ?? []);
          valor_cuota[fondo].push({ periodo, valores });
        });
      });
      console.log("completado carga - valor_cuota ... 3");

      // Ordenar - activos por fondo ----------------------------------------
      const activos = {};
      const cabecera_activos = this.obtenerCabeceraFondo(dataActivos);
      const activosFilter = dataActivos.filter(item => item.nombre_activo.toLowerCase() !== "total");

      cabecera_activos.forEach(name_fondo => {
        activos[name_fondo] = this.transformarPorFondo(activosFilter, name_fondo, 'nombre_activo');
      });
      console.log("completado carga - activos ... 4");

      // Ordenar - sectores por fondo -------------------------------------
      const sectores = {};
      const cabecera_sectores = this.obtenerCabeceraFondo(dataSectores);
      const sectoresFilter = dataSectores.filter(item => item.sector.toLowerCase() !== "total");

      cabecera_sectores.forEach(name_fondo => {
        sectores[name_fondo] = this.transformarPorFondo(sectoresFilter, name_fondo, 'sector');
      });
      console.log("completado carga - sectores ... 5");

      // Ordenar - rendimiento_anio por fondo ------------------------------
      const rendimiento_anio = {};
      const cabecera_rendimientoAnio = this.obtenerCabeceraFondo(dataRendimientoAnio);

      cabecera_rendimientoAnio.forEach(name_fondo => {
        rendimiento_anio[name_fondo] = this.transformarPorFondo(dataRendimientoAnio, name_fondo, 'anio');
      });
      console.log("completado carga - rendimiento_anio ... 6");

      // Carga - datos, valor_cuota, activos, sectores, rendimiento_anio -----------
      Array.from({ length: 10 }).forEach((_, i) => {
        let name_fondo = this.obtenerNameFondo(i);

        // Carga - datos
        this.data_fs[name_fondo].fecha = datosPorHoja['datos'][0]['fecha'] || "";
        this.data_fs[name_fondo].mes = datosPorHoja['datos'][0]['mes'] || "";
        this.data_fs[name_fondo].anio = datosPorHoja['datos'][0]['anio'] || "";

        // Carga - valor cuota
        this.data_fs[name_fondo].valor_cuota = valor_cuota[name_fondo] || [];
        this.data_fs[name_fondo].activos = formatDecimal(activos[name_fondo] || []);
        this.data_fs[name_fondo].sectores = formatDecimal(sectores[name_fondo] || []);
        this.data_fs[name_fondo].rendimiento_anio = formatDecimal(rendimiento_anio[name_fondo] || []);
      });
      console.log("completado carga Final ...", this.data_fs);
    }

    return this.data_fs;
  }

  async onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    const reader: FileReader = new FileReader();
    this.statusMessage_1 = "";

    if (target.files.length !== 1) return;

    try {
      reader.onload = (e: any) => {
        const binaryStr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });

        workbook.SheetNames.forEach(sheetName => {
          const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];
          this.datosPorHoja[sheetName] = XLSX.utils.sheet_to_json(sheetData); // Guardar cada hoja en una lista separada
        });
        console.log("Inicio carga datosPorHoja Excel", this.datosPorHoja);

        const dataFs = this.fusionarData(this.datosPorHoja);
        saveStorageData_fs(dataFs);
        this.isPlantillaCargada = false;

        /* this.ejecutarGraficas();
        this.prevComentarios(this.data_fs); */
      };

      reader.readAsBinaryString(target.files[0]);
    } catch (error) {
      console.log("Error", error);
    }
  }

  onSeleccionar() {
    console.log('Seleccionaste:', this.opcionSeleccionada);
    console.log('this.data_fs seleccionado:', this.data_fs[this.opcionSeleccionada]);

    this.statusMessage_1 = "";
    this.activos_nombres = [];
    this.activos_valor = [];
    this.sectores_nombres = [];
    this.sectores_valor = [];
    document.getElementById('visorPDF')?.setAttribute('src', "");

    this.ejecutarGraficas(this.data_fs[this.opcionSeleccionada]);
    this.prevComentarios(this.data_fs[this.opcionSeleccionada]);
  }

  async createChartSectores() {
    if (this.chart3) {
      this.chart3.destroy();
    }
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

    this.chart3 = new Chart(this.chartCanvas.nativeElement, {
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
    if (this.chart2) {
      this.chart2.destroy();
    }
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

    this.chart2 = new Chart(this.chartCanvasActivos.nativeElement, {
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
    /* const ctx = chart.ctx;
    const total = (chart.data.datasets[0].data.reduce((a, b) => (a as number) + (b as number), 0)) as number; */

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
    const labelRadius = baseRadius * (es_sector ? 1.25 : 1.23);

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
      // TODO MOFIDICAR TEXTO DE GRAFICO ACTIVO ESPACIADO facsheet
      label.style.minWidth = '170px'; // espaciado del texto en la gráfica para TODOS LOS FONDOS
      // label.style.minWidth = '208px'; // espaciado del texto en la gráfica para FONDO 09

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
        ${formatoNumberMiles(value)}%
        </div>
        <div style='color: #10273D; font-weight: 700; font-size: 28px; line-height: 1.0'>
          ${label2}
        </div>
      `;

      container.appendChild(label);
    });
  }


  // TODO - GRAFICO LINEAS
  renderChartLineas(dataFondoFs): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const valorCuotaArray = dataFondoFs.valor_cuota;

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
            
            // FEAT FONDO 8 Y 9 (nuevos valores)
            // anchor: 'start',
            // align: 'top',
            // offset: 3,
            // clip: false,

            // FEAT ALL FONDOS
            anchor: 'end',
            align: 'right',
            offset: 5,
            
            color: '#59BCE2',
            font: {
              size: 16,
              family: 'TT Hoves Pro Trial',
            },
            formatter: (value) =>
              value === 1 ? '' : formatoNumberMiles(value, 4),
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
              callback: (value) => ` ${formatoNumberMiles(value, 4)}`,
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, chartConfig);
  }

  async configurarCanvas() {
    if (!this.chartWrapper || !this.chartVC || !this.chartWrapperActivos) {
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

  async generar(accion: string = "") {
    const { storage_data, storage_coment } = getStorageData_fs();
    this.statusMessage_1 = "";

    if (!storage_data && !storage_coment) {
      this.statusMessage_1 = accion === "edit"
        ? "No hay información para previsualizar"
        : "No hay información para generar el pdf";
      return;
    }

    if (!this.opcionSeleccionada) {
      this.statusMessage_1 = "Debe seleccionar el fondo a generar";
      return;
    }

    try {
      this.isLoading = true;
      const canva = await this.configurarCanvas();

      if (Object.keys(canva).length > 0) {
        await LevFactSheetPDF.create(canva.imagenChart, canva.imgActivos, canva.imgSectores, this.data_fs[this.opcionSeleccionada], this.prevComent, accion);
        this.isLoading = false;
      }

    } catch (error) {
      console.log("Error", error);
      this.isLoading = false;
    }
  }
}