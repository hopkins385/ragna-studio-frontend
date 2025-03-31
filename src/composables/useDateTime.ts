export function useDateTime() {
  const { locale } = useI18n();

  function getDateTimeForHumans(
    value: string | number | Date,
    options: Intl.DateTimeFormatOptions = {},
  ) {
    const date = new Date(value);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    } as Intl.DateTimeFormatOptions;
    options = Object.assign(defaultOptions, options);
    return date.toLocaleString(locale.value ?? 'de-DE', options);
  }

  function getDateForHumans(
    value: string | number | Date,
    options: Intl.DateTimeFormatOptions = {},
  ) {
    const date = new Date(value);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions;
    options = Object.assign(defaultOptions, options);
    return date.toLocaleString(locale.value ?? 'de-DE', options);
  }

  return {
    getDateTimeForHumans,
    getDateForHumans,
  };
}
