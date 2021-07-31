import { isObject, isPlainObject, isString } from './assertions';

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
  if (isObject(obj)) {
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

const rkey = /([^[\]]+)/g;

export function pick(path: string | string[], source: any) {
  const _path = isString(path) ? path.split('.') : path;
  let found = false;

  const value = _path.reduce((src, fullName: string) => {
    if (src) {
      const m = fullName.match(rkey);

      if (m) {
        m.forEach((name: string) => {
          if (isObject(src) && name in src) {
            src = src[name];
            found = true;
          } else {
            found = false;
          }
        });
      }
    }

    return found ? src : undefined;
  }, source);

  return {
    found,
    value
  };
}

export function picks(path: string | string[], ...args: any[]) {
  const length = args.length;
  let result;

  for (let i = 0; i < length; i++) {
    result = pick(path, args[i]);

    if (result.found) {
      return result.value;
    }
  }

  return result ? result.value : result;
}

export function findIndex(arr: any[], fn: (...args: any[]) => boolean) {
  let i = -1;

  if (arr) {
    arr.some((...args) => {
      i += 1;

      if (fn(...args)) {
        return true;
      }

      return false;
    });
  }

  return i;
}
