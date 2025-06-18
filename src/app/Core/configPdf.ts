export const opt_pdf = {
  margin: 0,
  filename: `prueba.pdf`,
  image: { type: 'png', quality: 1 },
  html2canvas: {
    background: 'white',
    scale: 7,
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