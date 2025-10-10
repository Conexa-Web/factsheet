import moment from "moment";

export function formatDecimal(data) {
  return data.map(item => ({
    ...item,
    valor: parseFloat(item.valor)
  }));
}

export function convertirFechaDesdeExcel(n: number): string {
  return moment('1899-12-30').add(n, 'days').format('DD/MM/YYYY');
}

export function formatoNumberMiles(x: any, decimalLimit: number = 2) {
  if (x && !isNaN(Number(x))) {
    const parts = Number(x).toFixed(decimalLimit).split('.');
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
  }
  return Number(0).toFixed(decimalLimit);
}

export function formatoNumberMilesInv(x: any, decimalLimit: number = 2) {
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

/* export function formatoNumberMilesHtml(x: any, decimalLimit: number = 2) {
  if (x && !isNaN(Number(x))) {
    var myArray = Number(x).toFixed(decimalLimit).toString().split('.');
    return (
      myArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (decimalLimit ? '.' + myArray[1] : '')
    );
  }
  return `${Number(0).toFixed(decimalLimit)}`;
} */

export function formatoNumberMilesHtml(x: any, decimalLimit: number = 2) {
  if (x && !isNaN(Number(x))) {
    const num = Number(x).toFixed(decimalLimit);
    const [entero, decimales] = num.split('.');

    const tieneDecimales = decimalLimit > 0 && /[^0]/.test(decimales); // al menos un dígito ≠ 0

    return entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
           (tieneDecimales ? '.' + decimales : '');
  }

  return decimalLimit > 0 ? '0.00' : '0';
}

export function formatTextoFecha(fechaStr: string) {
  const meses = {
    Jan: "Enero", Feb: "Febrero", Mar: "Marzo", Apr: "Abril",
    May: "Mayo", Jun: "Junio", Jul: "Julio", Aug: "Agosto",
    Sep: "Septiembre", Set: "Setiembre", Oct: "Octubre",
    Nov: "Noviembre", Dec: "Diciembre"
  };

  const partes = fechaStr.split(" - ");
  /* if (partes.length !== 3) return "Formato inválido"; */

  const [dia, mesAbrev] = partes;
  const mesCompleto = meses[mesAbrev];

  return mesCompleto ? `${parseInt(dia)} de ${mesCompleto}` : "Mes inválido";
}