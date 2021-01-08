import { isCallable, isPlainObject } from './assertions';
import { each } from './collections';

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
  const fns: Record<string, any> = {};

  return {
    get value() {
      return value;
    },
    set value(val: any) {
      value = val;
      each(fns, (fn) => fn(this, value))
    },
    on(name: 'updated', fn: () => void, context: any) {
      fns[name] = fn.bind(context || this);

      return this;
    }
  };
}

export function isRefValue(value: any): value is Ref {
  return isPlainObject(value) && 'value' in value;
}

export type Ref = {
  value: any;
  on: (name: 'updated', fn: () => void, context: any) => void;
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

  return _ref;
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
