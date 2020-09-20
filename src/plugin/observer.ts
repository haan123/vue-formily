import Formily from './Formily';
import { FormilyField } from './types';
import { isPlainObject, isObject, hasOwn, def } from './utils';

const methodsToPatch = ['push', 'unshift'];

function bindProto(target: any) {
  /* eslint-disable no-proto */
  const proto = target.__proto__;

  Object.defineProperty(target, '__proto__', {
    get() {
      return proto;
    },
    set(newValue) {
      proto.__proto__ = newValue;
    }
  });
  /* eslint-enable no-proto */
}

const arrayMethods = Object.create(Array.prototype);

methodsToPatch.forEach(function(method) {
  // cache original method
  def(arrayMethods, method, function mutator(this: any, ...args: any[]) {
    // eslint-disable-next-line no-proto
    const original = this.__proto__.__proto__[method];
    const result = original.apply(this, args);

    this.__fo__.observeArray(args);

    return result;
  });
});

export class Observer {
  value: any;
  field: FormilyField;

  constructor(value: any, field: FormilyField) {
    this.value = value;
    this.field = field;

    def(value, '__fo__', this);

    if (Array.isArray(value)) {
      // eslint-disable-next-line no-proto
      Object.setPrototypeOf(value, arrayMethods);
      bindProto(value);
      // patchArray(value)
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      reactor(obj, keys[i], this.field);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: any[]) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i], this.field);
    }
  }
}

export function observe(value: any, field: FormilyField) {
  if (!isObject(value)) {
    return;
  }
  let ob;
  if (hasOwn(value, '__fo__') && value.__fo__ instanceof Observer) {
    ob = value.__fo__;
  } else if ((Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
    ob = new Observer(value, field);
  }
  return ob;
}

export function reactor(obj: object, key: string, field: FormilyField, val?: any) {
  const property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  }

  observe(val, field);

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (typeof field.formatter === 'function') {
        val = field.formatter.call(obj);
      }

      return val;
    },
    set: function reactiveSetter(newVal) {
      val = newVal;

      observe(newVal, field);
    }
  });
}
