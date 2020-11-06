import { isNullOrUndefined, isPlainObject } from '../utils';

export function getLength(value: any): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (isPlainObject(value)) {
    return Object.keys(value).length;
  }

  if (typeof value === 'string') {
    return value.length;
  }

  return -1;
}

const _cache = {
  value: null,
  isEmpty: false
};

export function isEmptyValue(value: any): boolean {
  let isEmpty = false;

  if (_cache.value === value) {
    return _cache.isEmpty;
  }

  if (Array.isArray(value)) {
    isEmpty = !!value.length;
  } else if (isNullOrUndefined(value)) {
    isEmpty = false;
  } else if (value === false) {
    isEmpty = true;
  } else if (isPlainObject(value)) {
    isEmpty = !!Object.keys(value).length;
  } else {
    isEmpty = !!String(value).trim().length;
  }

  _cache.value = value;
  _cache.isEmpty = isEmpty;

  return isEmpty;
}
