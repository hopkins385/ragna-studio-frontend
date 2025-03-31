export function getFileSizeForHumans(value: number) {
  const size = Number(value);
  if (size === 0) return '';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  if (i === 0) return '';
  return Number((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
