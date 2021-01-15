import { isPlainObject } from './assertions';

export function merge(target: any, ...sources: any[]) {
  return sources.reduce((acc: any, source: any) => {
    if (!source) {
      return acc;
    }

    const keys = Object.keys(source);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
      const key = keys[i];
      const item = source[key];

      if (isPlainObject(item)) {
        if (!acc[key]) {
          acc[key] = {};
        }

        acc[key] = merge(target[key], item);
      } else {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(acc, key, descriptor || item);
      }
    }

    return acc;
  }, target);
}

export function each(obj: any, fn: (propValue: any, propName: string, index: number) => void | boolean) {
  if (isPlainObject(obj)) {
    const keys = Object.keys(obj);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
      const key = keys[i];

      if (fn(obj[key], key, i) === false) {
        break;
      }
    }
  }
}
