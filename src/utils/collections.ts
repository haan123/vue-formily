import { isPlainObject, isString } from './assertions';

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

const rindex = /\[(\d+)\]/g;

export function pick(path: string | string[], obj: any) {
  const _path = isString(path) ? path.split('.') : path;
  let found = true;
  const value = _path.reduce((acc, fullName: string) => {
    if (acc) {
      let name = fullName.split('[')[0];

      if (!(name in acc)) {
        found = false;
      }

      acc = acc[name];

      // matches name[0], name[0][1]
      let m = rindex.exec(fullName)

      do {
        if (m) {
          name = m[1];

          if (!(name in acc)) {
            found = false;
          }

          acc = acc[name]
        }

        m = rindex.exec(acc);
      } while (m)
    }

    return acc
  }, obj);

  return {
    found,
    value
  }
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

  return result;
}

export function findIndex(arr: any[], fn: (...args: any[]) => boolean) {
  let i = -1;

  if (arr) {
    arr.some((...args) => {
      if (fn(...args)) {
        i += 1;

        return true;
      }

      return false;
    })
  }

  return i;
}
