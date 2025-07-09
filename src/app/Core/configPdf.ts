export const opt_pdf = {
  margin: 0,
  filename: `prueba.pdf`,
  image: { type: 'png', quality: 1 },
  html2canvas: {
    background: 'white',
    scale: 4,
    dpi: 500,
    useCORS: true,
    logging: false,
    allowTaint: true
  },
  jsPDF: {
    unit: 'in',
    format: 'a4',
    orientation: 'portrait',
    compress: true
  },
  pagebreak: { mode: 'avoid-all', before: '.romper_fila' },
};