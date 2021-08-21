import { isArray, isPlainObject, isString, isUndefined } from './assertions';

export function getLength(value: any): number {
  if (isArray(value)) {
    return value.length;
  }

  if (value !== null && isPlainObject(value)) {
    return Object.keys(value).length;
  }

  if (isString(value)) {
    return value.length;
  }

  return 0;
}

export function valueOrNull(value: any) {
  return !isUndefined(value) ? value : null;
}

export function now() {
  return Date.now();
}
