export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString;

export function isPlainObject(obj: any) {
  return _toString.call(obj) === '[object Object]';
}

const rnumber = /^\d+$/;
export function isNumber(value: any) {
  return typeof value === 'number' || rnumber.test(value);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: any, key: string) {
  return hasOwnProperty.call(obj, key);
}

export function camelCase(input: string) {
  return input
    .replace(/^[_.\- ]+/, '')
    .toLocaleLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toLocaleUpperCase())
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toLocaleUpperCase());
}

export function vfMessage(message: string) {
  return `[vue-formily] ${message}`;
}

export function logWarn(message: string) {
  // eslint-disable-next-line no-console
  console.warn(vfMessage(message));
}

export function logError(message: string) {
  console.error(vfMessage(message));
}

export function def(obj: any, key: string, val: any, writable = true, enumerable = true) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    writable,
    configurable: writable
  });
}

export function setter(obj: any, key: string, val: any, set?: any) {
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(value) {
      if (typeof set === 'function') {
        val = set.call(this, value);
      } else {
        val = value;
      }
    },
    configurable: true,
    enumerable: true
  });
}
