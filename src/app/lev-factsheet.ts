import html2pdf from 'html2pdf.js';

export class LevFactSheetPDF {
  static async getPdfBuffer(html: any) {
    var opt = {
      margin: 0,
      filename: `prueba.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { background: 'white', scale: 2, dpi: 1200 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    return await html2pdf()
      .from(html)
      .set(opt)
      .output('datauristring')
      .then((pdfData) => {
        console.log('PDF generado correctamente.');
        // Aquí puedes hacer algo con pdfData, como descargarlo o mostrarlo
      })
      .catch((error) => {
        console.error('Error al generar el PDF:', error);
      });
  }

  static async create(
    htmlChart: any,
    htmlChartActivos: any,
    htmlChartSectores: any,
    data_fs: any,
    prevComent?: any,
    chartWidth?: number,
    chartHeight?: number,
    doughnutSize?: { width: number, height: number },
    labelSpacing?: number,
    lastValueOffset?: number,
  ) {
    let rendimiento_anio = '';
    let rendimiento_anio_valor = '';


    // TABLA DE RENDIMIENTOS POR AÑO
    console.log("data_fs", data_fs)
    console.log("prevComent", prevComent)

    const parrafos = prevComent.split(/\n/); // Divide por tabulación o salto de línea
    console.log("parrafos", parrafos)

    // Asignar cada párrafo a una variable
    const parrafo_1 = parrafos[0];
    const parrafo_2 = parrafos[2];
    const parrafo_3 = parrafos[4];

    if (data_fs.rendimiento_anio && Array.isArray(data_fs.rendimiento_anio) && data_fs.rendimiento_anio.length > 0) {
      for (let rendimiento of data_fs.rendimiento_anio) {
        rendimiento_anio += `
      <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1;">
        <span style="font-size: 10px; color:#10273D; font-weight:bold">${rendimiento.anio}</span>
      </div>
    `;

        rendimiento_anio_valor += `
      <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1;">
        <span style="font-size: 10px;">${this.formatoNumberMiles(rendimiento.valor)}%</span>
      </div>
    `;
      }
    } else {
      // Si no hay datos de rendimiento anual, la tabla sigue visible con títulos pero sin valores
      rendimiento_anio = `
    <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1; min-height: 20px;">
      <span style="font-size: 10px; color:#10273D; font-weight:bold">&nbsp;</span> <!-- Espacio en blanco para mantener estructura -->
    </div>
  `;

      rendimiento_anio_valor = `
    <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1; min-height: 20px;">
      <span style="font-size: 10px;">&nbsp;</span> <!-- Espacio en blanco para evitar reducción -->
    </div>
  `;
    }





    // //TABLA DE RENDIMIENTOS POR AÑO
    // if (data_fs.rendimiento_anio && Array.isArray(data_fs.rendimiento_anio)) {
    //   for (let rendimiento of data_fs.rendimiento_anio) {
    //     rendimiento_anio += `
    //       <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1;">
    //                   <span style="font-size: 10px; color:#10273D; font-weight:bold">${rendimiento.anio}</span>
    //       </div>
    //     `;

    //     rendimiento_anio_valor += `
    //       <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1;">
    //                   <span style="font-size: 10px; ">${this.formatoNumberMiles(
    //                     rendimiento.valor
    //                   )}%</span>
    //       </div>
    //     `;
    //   }
    // } else {

    //   // Si no hay datos de rendimiento anual, mostramos un mensaje
    //   rendimiento_anio = `
    //     <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1;">
    //       <span style="font-size: 10px; color:#10273D; font-weight:bold"></span>
    //     </div>
    //   `;
    //   rendimiento_anio_valor = `
    //     <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1;">
    //       <span style="font-size: 10px; "></span>
    //     </div>
    //   `;
    // }

    //TEXTO PARA ACTIVOS

    let html = `
        <style>
        p {
          line-height: 1.2;
          margin: 0;
          font-size: 15px;
        }

        .flex {
          display: flex;
        }

        .flex-column {
          display: flex;
          flex-direction: column;
        }

        .flex.items-center.gap-48 {
          padding: 12px 20px;
          background-color: #E1EBF1;
          position: relative;
        }

        .flex-wrap {
          flex-wrap: wrap;
        }

        .items-center {
          align-items: center;
        }

        .items-end {
          align-items: flex-end;
        }

        .justify-space-between {
          justify-content: space-between;
        }

        .justify-center {
          justify-content: center;
        }

        .expanded {
          flex: 1 1;
        }

        .h100{
          height: 100%;
        }

        .py-16 {
          padding-top: 12px;
          padding-bottom: 12px;
        }

        .px-12 {
          padding-left: 10px;
          padding-right: 10px;
        }

        .py-24 {
          padding-top: 20px;
          padding-bottom: 20px;
        }

        .px-40 {
          padding-left: 30px;
          padding-right: 30px;
        }

        .px-24 {
          padding-left: 20px;
          padding-right: 20px;
        }

        .gap-4 {
          gap: 3px;
        }

        .gap-8 {
          gap: 6px;
        }

        .gap-12 {
          gap: 8px;
        }

        .gap-16 {
          gap: 12px;
        }
        .gap-48 {
          gap: 36px;
        }

        .fw-400 {
          font-weight: 400;
        }

        .fw-500 {
          font-weight: 500;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .text-subordinate {
          color: #818c8d;
        }

        .text-primary-6 {
          color: #7e8da6;
        }

        .border-radius {
          border-radius: 6px;
        }

        .triangle {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 70px 70px 0;
          border-color: transparent #10273D transparent transparent;
          position: absolute;
          top: 0;
          right: 0;
        }

        .imgEstadistica {
          width: 136%;
          margin: 0 auto;
          margin-left: -42px;
          margin-top: -42px;
          max-width: none;
          margin-bottom: 11px
        }

        @media (max-width: 1200px) { 
          .imgEstadistica {
            width: 136%;
            margin: 0 auto;
            margin-left: -42px;
            margin-top: -42px;
            max-width: none;
            margin-bottom: 11px
          }
        }

        @media (min-width: 1600px) {
          .imgEstadistica {
            width: 176%;
            margin: 0 auto;
            margin-left: -92px;
            margin-top: -42px;
            max-width: none;
            margin-bottom: 11px
          }
        }


      </style>

        <div class="flex-column expanded ">
        ${data_fs.caracteristicas_fondo.aniversario
        ? `<img src="/assets/sellos/${data_fs.caracteristicas_fondo.aniversario}.png" width="13.5%" style="position:absolute; z-index:1000; right:320px; top:50px; transform: rotate(12deg);"/>`
        : ''
      }
      <!-- CABECERA -->
      <div class="flex items-center gap-48 " style="padding:12px 24px 8px 24px; background-color: #10273D; position: relative;">
          <div class="flex-column" style="flex: 4; gap: 2px;">
            <span style="margin: 0 0 2px 0; color: #0A80BA; font-size: ${data_fs.caracteristicas_fondo.fondo === 'Conexa Peruvian Lending' ? '32px' : '36px'}; font-weight: 100; line-height:32px; display: block;">
                ${data_fs.caracteristicas_fondo.fondo} - ${data_fs.caracteristicas_fondo.moneda}
            </span>
            <span style="margin: 0 0 0px 0; color: #FFFFFF; font-size: 17px; font-weight: 100; line-height:20px; display: block;">
                Fondo de Inversión - ${data_fs.fecha}
            </span>
            <span style="margin: 0; color: #FFFFFF; font-size: 17px; font-weight: 100; display: block;">Clase A</span>
          </div>
          <div class="flex-column" style="flex: 1; margin-right:10px; display: flex; align-items: center; justify-content: center; height: 100%;">
            <img src="../assets/logos/logo_conexa_marca.svg" 
            style="display: block; width: 140px; height: auto; margin-top: -15px;" />
          </div>
          <div class="triangle"></div>
      </div>

      <!-- CUERPO DEL FACTSHEET -->
      <div style="padding:8px 24px 0 24px;">
        <div class="flex" style="gap:30px" >

        <!-- DATOS DEL VALOR CUOTA -->
          <div class="flex-column " style="background-color: white; flex: 5;">
            <p style="color: #0A80BA; font-weight: 500; font-size: 14px; margin-bottom: 4px;">Evolución del Valor Cuota</p>

            <div style="width: 410px; height: 400px; position: relative; overflow: visible; padding: 0; margin: 2px 0 9px 0;">
              <img  style="width: 410px; margin-bottom: 2px" src=" ${htmlChart}" />
              <div style="position:absolute; bottom:0; right:0">
                <span style='font-size:8px; color:#10273D;'>Al final de cada trimestre el valor cuota regresa a 1.0000</span>
              </div>
          </div>

          <div>
            <p style="color: #0A80BA; font-weight: 500; font-size: 14px; margin-bottom: 10px;">
              Comentarios de la Sociedad Gestora
            </p>
            <p style="word-spacing: 0.15em; font-size: 11px; text-align: justify; margin-bottom: 6px; line-height: 1.1;">
              ${parrafo_1}
            </p>
                
            <p style="word-spacing: 0.15em; font-size: 11px; text-align: justify; margin-bottom: 6px; line-height: 1.1;">
              ${parrafo_2}
            </p>
                          
            <p style="word-spacing: 0.15em; font-size: 11px; text-align: justify; margin-bottom: 6px; line-height: 1.1;">
              ${parrafo_3}
            </p>
          </div>

                <!-- TABLA DE RENDIMIENTO -->
                <div style="position:relative;">
                <p style="color: #0A80BA; font-weight: 500; font-size: 14px; margin-bottom: 12px;">

                Rendimiento del fondo</p>

                <div style="width: 100%; display: flex; margin-bottom: 2px; gap: 2px;">
                  <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1;">
                    <span style="font-size: 10px; color:#10273D; font-weight:bold">${data_fs.mes
      } ${data_fs.anio}</span>
                  </div>
                  <div style="flex: 1; padding:2px; text-align: center; background-color: #E1EBF1;">
                    <span style="font-size: 10px; color:#10273D; font-weight:bold">Últimos 3 meses</span>
                  </div>
                  <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1;">
                    <span style="font-size: 10px; color:#10273D; font-weight:bold">YTD</span>
                  </div>
                  <div style="flex: 1; padding: 2px; text-align: center; background-color: #E1EBF1;">
                    <span style="font-size: 10px; color:#10273D; font-weight:bold">Últimos 12 meses</span>
                  </div>
                </div>
                <div style="width: 100%; display: flex; margin-bottom: 12px; gap: 2px;">
                  <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1;">
                    <span style="font-size: 10px; ">${this.formatoNumberMiles(
        data_fs.rendimiento_fondo.actual
      )}%</span>
                  </div>
                  <div style="flex: 1; padding:2px; text-align: center; border: 1px solid #E1EBF1;">
                    <span style="font-size: 10px; ">${this.formatoNumberMiles(
        data_fs.rendimiento_fondo.tres_meses
      )}%</span>
                  </div>
                  <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1;">
                    <span style="font-size: 10px;">${this.formatoNumberMiles(
        data_fs.rendimiento_fondo.ytd
      )}%</span>
                  </div>
                <div style="flex: 1; padding: 2px; text-align: center; border: 1px solid #E1EBF1;">
  <span style="font-size: 10px;">
    ${data_fs.rendimiento_fondo.doce_meses === 0 ? "—" : `${this.formatoNumberMiles(data_fs.rendimiento_fondo.doce_meses)}%`}
  </span>
</div>
                </div>
                  <div style="position:absolute;  bottom: -2px; right:0;">
                  <span style='font-size:8px; color:#10273D;'>Fuente: Conexa Asset Management</span>
                </div>
               
                </div>
                <!-- TABLA DE AÑOS -->
                <div style="position:relative;">
                <p style="color: #0A80BA; font-weight: 500; font-size: 14px; margin-bottom: 12px; ">

                Rendimiento año calendario</p>

                <div style="width: 100%; display: flex; margin-bottom: 2px; gap: 2px;">


                  ${rendimiento_anio}

                </div>
                <div style="width: 100%; display: flex; margin-bottom: 16px; gap: 2px;">


                 ${rendimiento_anio_valor}

                </div>
                <div style="position:absolute; bottom:2px; right:0;">
                  <span style='font-size:8px; color:#10273D;'>Fuente: Conexa Asset Management</span>
                </div>
              </div>
              </div>

              <!-- CUADRO DE CARACTERÍSTICAS -->
             <div class="flex-column" style="padding:16px; border: 1px solid #0A80BA; flex: 3; border-radius: 12px;">
                <p style="text-align: center; color: #0A80BA; margin-bottom: 4px; font-size: 13px;">
                   Principales características
                </p>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 4px;">
                  <span style=" color: #10273D;">Inicio de Operaciones</span>
                  <span style="color: #0A80BA;">${data_fs.caracteristicas_fondo.ini_op
      }</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 4px;">
                  <span style=" color: #10273D;">Vencimiento</span>
                  <span style="color: #0A80BA;">${data_fs.caracteristicas_fondo.vencimiento
      }</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Moneda</span>
                  <span style="color: #0A80BA;">${data_fs.caracteristicas_fondo.iso
      }</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Tamaño del fondo (AUM)</span>
                  <span style="color: #0A80BA;">${this.formatoNumberMiles(
        data_fs.caracteristicas_fondo.aum,
        0
      )}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Valor cuota al ${data_fs.caracteristicas_fondo.valor_cuota_al} (NAV)</span>
                  <span style="color: #0A80BA;">${data_fs.caracteristicas_fondo.valor_cuota
      }</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Frecuencia de valorización</span>
                  <span style="color: #0A80BA;">Diaria</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Inversión mínima</span>
                  <span style="color: #0A80BA;">${this.formatoNumberMilesInv(
        data_fs.caracteristicas_fondo.inv_min,
        0
      )}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Rentabilidad Objetivo</span>
                  <span style="color: #0A80BA;">${data_fs.caracteristicas_fondo.rentabilidad_objetivo
      } anual</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Sociedad auditora</span>
                  <span style="color: #0A80BA;">Deloitte</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Fideicomiso de garantía</span>
                  <span style="color: #0A80BA;">${data_fs.caracteristicas_fondo.fideicomiso
      }</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; border-bottom: 1.5px solid #516C7D; padding: 0 8px 4px 8px; margin-bottom: 3px;">
                  <span style=" color: #10273D;">Comisión administrativa</span>
                  <span style="color: #0A80BA;">Hasta 5% anual del AUM</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; padding: 0 8px 4px 8px; margin-bottom: 8px;">
                  <span style=" color: #10273D;">Distribución de beneficios</span>
                  <span style="color: #0A80BA;">Trimestral</span>
                </div>

                <p style="font-size: 9px; text-align: justify; margin-bottom: 8px; color: #10273D;"> <span style="color: #0A80BA;">EL ${data_fs.caracteristicas_fondo.fondo.toUpperCase()} - FONDO DE INVERSIÓN</span> tiene como objetivo realizar inversiones principalmente en
                  pequeñas y medianas empresas (PYMEs) a través de
                  instrumentos representativos de deuda y la cesión de
                  derechos de empresas constituidas en el Perú. Todas sus
                  inversiones son aprobadas por un Comité de Inversiones según lo expuesto en su reglamento de participación.</p>

                <p style="font-size: 9px; text-align: justify;  margin-bottom: 8px; color: #10273D;"> <span style="color: #0A80BA;">CONEXA ASSET MANAGEMENT</span> es una sociedad gestora de
                  fondos de inversión privados, perteneciente a <span style="color: #0A80BA;">CONEXA FINANCIAL GROUP</span></p>

                <p style="font-size: 9px; text-align: justify;  margin-bottom: 8px; color: #10273D;">La principal fuente de ingresos del Fondo son los intereses y
                  las comisiones de desembolso que cobra por los
                  financiamientos, los cuales están sujetos al pago del IGV.</p>

                  <p style="font-size: 9px; text-align: justify;  margin-bottom: 8px; color: #10273D;"> <span style="color: #0A80BA;">EL ${data_fs.caracteristicas_fondo.fondo.toUpperCase()} - FONDO DE INVERSIÓN</span> solamente actúa como agente de retención sobre los
                    beneficios de los partícipes.</p>

                  <p style="font-size: 9px; text-align: justify;  margin-bottom: 8px; color:#10273D; font-weight:bold">IMPORTANTE:</p>

                  <p style="font-size: 9px; text-align: justify;  margin-bottom: 8px; color: #10273D; ">Esta información ha sido preparada únicamente con fines
                    informativos para los partícipes del ${data_fs.caracteristicas_fondo.fondo.toUpperCase()} - FONDO DE INVERSIÓN. Se recomienda consultar con su
                    asesor financiero antes de realizar inversiones en este tipo de
                    instrumentos financieros. CONEXA ASSET MANAGEMENT
                    S.A. y sus funcionarios no asumirán responsabilidad alguna
                    por las decisiones que pudieran ser tomadas en base a esta
                    información. Asimismo, las rentabilidades obtenidas en el
                    pasado no son garantía de resultados futuros.</p>

                    <p style="font-size: 9px; text-align: justify; color: #10273D;" >El patrimonio y la contabilidad del fondo son independientes al
                      de la sociedad gestora.</p>
              </div>
            </div>
          </div>


<!-- FOOTER GRÁFICOS -->

<div
  class="footer-graficos"
  style="
    padding: 0px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-evenly;
  "
>
  <!-- Gráfico 1: Diversificación por tipo de activos -->
  <div
    class="grafico"
    style="
      flex: 1;
      max-width: 34%;
      text-align: center;
      position:relative;
      margin: 8px;
    "
  >
    <span
      style="
        font-size: 11px;
        border-radius: 12px;
        padding: 4px 12px;
        color: #10273D;
        margin-bottom: 48px;
        border: 1px solid #0A80BA;
        display: inline-block;
      "
    >
      Diversificación por tipo de activos
    </span>

    <div
      style="
        padding: 0px;
        width: 100%;
      "
    >
      <img
        class="imgEstadistica"
        src="${htmlChartActivos}"
        alt="Gráfico de Diversificación por tipo de activos"
      />
    </div>
    <div style="position:absolute; bottom:0; left:0">
        <span style='font-size:8px; color:#10273D;'>Fuente: Conexa Asset Management</span>
    </div>
  </div>

  <!-- Gráfico 2: Diversificación por tipo de sectores -->
  <div
    class="grafico"
    style="
      flex: 1;
      max-width: 34%;
      text-align: center;
      position:relative;
      margin: 8px;
    "
  >
   <span
      style="
        font-size: 11px;
        border-radius: 12px;
        padding: 4px 12px;
        color: #10273D;
        margin-bottom: 48px;
        border: 1px solid #0A80BA;
        display: inline-block;
      "
    >
      Diversificación por tipo de sectores
    </span>
    <div
      style="
        padding: 0px;
        width: 100%;
      "
    >
      <img
        class="imgEstadistica"
        src="${htmlChartSectores}"
        alt="Gráfico de Diversificación por tipo de sectores"
      />
    </div>
    <div style="position:absolute; bottom:0; right:0; margin: 0; padding: 0">
        <span style='font-size:8px; color:#10273D;'>Fuente: Conexa Asset Management</span>
    </div>
  </div>
</div>
              </div>
           </div>
    </div>
    `;

    // let pdf = await this.getPdf(html);

    // let resul = await AmplifyHelper.fileUploadToStorageBuffer({
    //   name: "prueba.pdf",
    //   path: PathsS3.contratos.replace("#id", "32"),
    //   file: pdf,
    //   random_name: true,
    // });
    const response = await this.getPdf(html).save();

    // return resul;
  }

  // FEAT - NITIDEZ DE IMAGEN Y PDF
  private static getPdf(html) {
    var opt = {
      margin: 0,
      filename: `prueba.pdf`,
      image: { type: 'png', quality: 1 },
      html2canvas: {
        background: 'white',
        scale: 12,
        dpi: 3000,
        useCORS: true,
        logging: false,
        allowTaint: true
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        compress: false
      },
      pagebreak: { mode: 'avoid-all', before: '.romper_fila' },
    };
    return html2pdf().from(html).set(opt);
  }

  private static formatoNumberMiles(x: any, decimalLimit: number = 2) {
    if (x && !isNaN(Number(x))) {
      var myArray = Number(x).toFixed(decimalLimit).toString().split('.');
      return (
        myArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        (decimalLimit ? '.' + myArray[1] : '')
      );
    }
    return `${Number(0).toFixed(decimalLimit)}`;
  }

  private static formatoNumberMilesInv(x: any, decimalLimit: number = 2) {
    // Verifica si x es un número válido
    if (x && !isNaN(Number(x))) {
      // Convierte el número a un valor con los decimales indicados
      let myArray = Number(x).toFixed(decimalLimit).toString().split('.');

      // Agrega las comas como separadores de miles en la parte entera del número
      const formattedNumber = myArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Devuelve el número con los decimales, garantizando que siempre haya dos decimales
      return formattedNumber + '.' + (myArray[1] || '00'); // Si no hay parte decimal, agrega '00'
    }

    // Si el valor no es un número válido, devuelve 0.00 formateado
    return '0.00';
  }


}
