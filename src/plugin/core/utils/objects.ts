import { isCallable } from './assertions';

export function def(obj: any, key: string, val: any, writable = true, enumerable = true) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    writable,
    configurable: writable
  });
}

export function getter(
  obj: any,
  key: string,
  val: any,
  { get, reactive = true }: { get?: any; reactive?: boolean } = {}
) {
  Object.defineProperty(obj, key, {
    get() {
      return isCallable(get) ? get() : val;
    },
    configurable: reactive,
    enumerable: true
  });
}

function _set(value: any) {
  return value;
}

export function setter(obj: any, key: string, val: any, fn?: any, reactive = true) {
  const set = isCallable(fn) ? fn : _set;

  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(value) {
      val = set.call(this, value);

      return val;
    },
    configurable: reactive,
    enumerable: true
  });
}
