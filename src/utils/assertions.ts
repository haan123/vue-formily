import { getLength } from './common';

const _toString = Object.prototype.toString;

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

export function isDateObject(date: any) {
  try {
    if (_toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
      return false
    }
  } catch (error) {
    return false;
  }

  return true;
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isPlainObject(obj: any): obj is Record<string, any> {
  return _toString.call(obj) === '[object Object]';
}

export function isPlainNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

const rnumber = /^\d+$/;
export function isNumber(value: any) {
  return isPlainNumber(value) || rnumber.test(value);
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
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

export function isNotEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
