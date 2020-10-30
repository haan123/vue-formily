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
        acc[key] = item;
      }
    }

    return acc;
  }, target);
}

export function each(obj: any, fn: (propValue: any, propName: string, index: number) => void) {
  if (isPlainObject(obj)) {
    Object.keys(obj).forEach((propName, index) => fn(obj[propName], propName, index));
  }
}
