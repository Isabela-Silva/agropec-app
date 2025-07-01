// Função para máscara de data DD/MM/YYYY
export function applyDateMask(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
}

// Função para máscara de hora HH:MM
export function applyTimeMask(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  // Aplica a máscara progressivamente
  if (numbers.length <= 2) {
    return numbers;
  } else {
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  }
}

// Função para validar data DD/MM/YYYY
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// Função para validar hora HH:MM
export function isValidTime(timeString: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/;

  if (!timeRegex.test(timeString)) {
    return false;
  }

  const [hours, minutes] = timeString.split(':').map(Number);

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

// Função para converter data brasileira para ISO (yyyy-mm-dd)
export function brazilianDateToISO(brazilianDate: string): string {
  if (!isValidDate(brazilianDate)) {
    return '';
  }

  const [day, month, year] = brazilianDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Função para converter data ISO para brasileira (dd/mm/yyyy)
export function isoDateToBrazilian(isoDate: string): string {
  if (!isoDate) return '';

  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
