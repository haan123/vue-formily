export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString;

export function isPlainObject(obj: any) {
  return _toString.call(obj) === '[object Object]';
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: any, key: string) {
  return hasOwnProperty.call(obj, key);
}

export function camelCase(input: string) {
  return input
    .replace(/^[_.\- ]+/, '')
    .toLocaleLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toLocaleUpperCase())
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toLocaleUpperCase());
}

const logPrefix = '[vue-formily]'
export function logWarn(message: string) {
  // eslint-disable-next-line no-console
  console.warn(`${logPrefix} ${message}`);
}

export function handleError(message: string, justLog = true) {
  if (justLog) {
    // eslint-disable-next-line no-console
    console.error(`${logPrefix} ${message}`);
  } else {
    throw new Error(`${logPrefix} ${message}`))
  }
}

export function def(obj: any, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

export function readOnlyDef(obj: any, key: string, val: any) {
  Object.defineProperty(obj, key, {
    value: val,
    writable: false
  });
}
