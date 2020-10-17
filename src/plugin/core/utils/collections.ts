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
