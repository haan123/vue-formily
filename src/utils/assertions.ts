import { getLength } from './common';

const _toString = Object.prototype.toString;

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isPlainObject(obj: any): obj is Record<string, any> {
  return _toString.call(obj) === '[object Object]';
}

const rnumber = /^\d+$/;
export function isNumber(value: any) {
  return typeof value === 'number' || rnumber.test(value);
}

export function isCallable(fn: unknown): fn is Function {
  return typeof fn === 'function';
}

const _cache = {
  value: null,
  isEmpty: false
};

export function isEmpty(value: any): value is (null | undefined | false) {
  let empty = false;

  if (_cache.value === value) {
    return _cache.isEmpty;
  }

  if (isNullOrUndefined(value) || value === false || !getLength(value)) {
    empty = true;
  }

  _cache.value = value;
  _cache.isEmpty = empty;

  return empty;
}

export function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function hasIntl() {
  return typeof Intl !== "undefined" && Intl.DateTimeFormat;
}
