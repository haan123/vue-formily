import { isCallable, isPlainObject } from './assertions';

export function toMap(data: any) {
  if (!data) {
    return null;
  }

  if (isPlainObject(data)) {
    return new Map(Object.keys(data).map(key => [key, (data as Record<string, any>)[key]]));
  }

  return new Map(data as Map<string, any>);
}

export function def(obj: any, key: string, val: any, writable = true, enumerable = true) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    writable,
    configurable: writable
  });
}

export function getter(obj: any, key: string, val: any, { reactive = true }: { reactive?: boolean } = {}) {
  Object.defineProperty(obj, key, {
    get() {
      return isCallable(val) ? val() : val;
    },
    configurable: reactive,
    enumerable: true
  });
}

function _set(value: any) {
  return value;
}

export function setter(
  obj: any,
  key: string,
  fn?: any,
  { initValue, reactive = true, eager = false }: { reactive?: boolean; eager?: boolean; initValue?: any } = {}
) {
  const set = isCallable(fn) ? fn : _set;
  let value = eager ? set() : initValue;

  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    async set(val) {
      value = await set.call(this, val);

      return value;
    },
    configurable: reactive,
    enumerable: true
  });
}
