const _toString = Object.prototype.toString;

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isPlainObject(obj: any) {
  return _toString.call(obj) === '[object Object]';
}

const rnumber = /^\d+$/;
export function isNumber(value: any) {
  return typeof value === 'number' || rnumber.test(value);
}

export function isCallable(fn: unknown): fn is Function {
  return typeof fn === 'function';
}
