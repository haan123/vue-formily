export function getLength(value: any): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value !== null && typeof value === 'object') {
    return Object.keys(value).length;
  }

  if (typeof value === 'string') {
    return value.length;
  }

  return 0;
}
