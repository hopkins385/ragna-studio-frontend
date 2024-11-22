export function getRoute<T extends string>(route: T, id?: string): T {
  if (!route) {
    throw new Error('Route is required');
  }

  if (!id) {
    return route;
  }

  if (!route.includes(':id')) {
    throw new Error('[route helper] Route does not contain :id');
  }

  return route.replace(':id', id.toString().toLowerCase()) as T;
}
