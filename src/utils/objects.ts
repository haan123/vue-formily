import { isCallable, isPlainObject } from './assertions';

export function toMap(data?: any) {
  if (data === undefined) {
    return null;
  }

  if (isPlainObject(data)) {
    return new Map(Object.keys(data).map(key => [key, (data as Record<string, any>)[key]]));
  }

  return new Map(data as Map<string, any>);
}

export function def(
  obj: any,
  key: string,
  val: any,
  { initValue, reactive = false, writable = true }: { reactive?: boolean; writable?: boolean; initValue?: any } = {}
) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable,
    configurable: reactive
  });

  if (writable && initValue !== undefined) {
    obj[key] = initValue;
  }
}

export function ref(value: any): Ref {
  return {
    value
  };
}

export function isRefValue(value: any): value is Ref {
  return isPlainObject(value) && 'value' in value;
}

export type Ref = {
  value: any;
};

export function getter(obj: any, key: string, value: any, { reactive = true }: { reactive?: boolean } = {}) {
  let _ref: Ref;
  let get = (r: Ref) => r.value;

  if (isCallable(value)) {
    _ref = ref(null);
    get = value;
  } else {
    _ref = isRefValue(value) ? value : ref(value);
  }

  Object.defineProperty(obj, key, {
    get() {
      return get.call(this, _ref);
    },
    configurable: reactive,
    enumerable: true
  });
}

export function setter(obj: any, key: string, value: any, set: any, { reactive = true }: { reactive?: boolean } = {}) {
  const _ref = isRefValue(value) ? value : ref(value);

  Object.defineProperty(obj, key, {
    get() {
      return _ref.value;
    },
    set(val) {
      const value = set.call(this, val, _ref);

      if (value !== undefined && _ref.value !== value) {
        _ref.value = value;
      }
    },
    configurable: reactive,
    enumerable: true
  });
}
