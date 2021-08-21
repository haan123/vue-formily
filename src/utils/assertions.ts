const _toString = Object.prototype.toString;

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

export function isDateObject(date: any) {
  try {
    if (_toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
      return false;
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
export function isNumber(value: any): value is number {
  return isPlainNumber(value) || rnumber.test(value);
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isCallable(fn: unknown): fn is (...args: any[]) => any {
  return typeof fn === 'function';
}

export function isArray(value: any): value is [] {
  return Array.isArray(value);
}
