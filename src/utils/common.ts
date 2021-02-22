import { isPlainNumber, isPlainObject, isString } from "./assertions";

export function getLength(value: any): number {
  if (Array.isArray(value)) {
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
  return value !== undefined ? value : null;
}

export function now() {
  return Date.now();
}

export function noop(value: any) { return value; }
