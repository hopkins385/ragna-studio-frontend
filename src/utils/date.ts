function getDaysInMonth(payload: { year: string | number; month: string | number }) {
  const year = typeof payload.year === 'string' ? parseInt(payload.year, 10) : payload.year;
  const month = typeof payload.month === 'string' ? parseInt(payload.month, 10) : payload.month;
  if (year < 1970 || year > 2100) {
    throw new Error('Year must be between 1970 and 2100');
  }
  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12');
  }
  const days = [];
  const date = new Date(year, month - 1, 1); // Month is zero-indexed in JavaScript

  while (date.getMonth() === month - 1) {
    days.push(new Date(date)); // Add a copy of the date
    date.setDate(date.getDate() + 1); // Increment day
  }

  return {
    daysArrayString: days.map(date =>
      date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }),
    ),
    days,
  };
}

export { getDaysInMonth };
export default getDaysInMonth;
