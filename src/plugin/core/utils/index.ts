import { isCallable } from './assertions';

export * from './assertions';
export * from './strings';
export * from './collections';

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: any, key: string) {
  return hasOwnProperty.call(obj, key);
}

export function def(obj: any, key: string, val: any, writable = true, enumerable = true) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    writable,
    configurable: writable
  });
}

function _set(value: any) {
  return value;
}

export function setter(obj: any, key: string, fn?: any) {
  const set = isCallable(fn) ? fn : _set;
  let val: any;

  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(value) {
      val = set.call(this, value);

      return val;
    },
    configurable: true,
    enumerable: true
  });
}
