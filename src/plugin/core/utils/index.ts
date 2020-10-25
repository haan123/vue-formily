export * from './assertions';
export * from './strings';
export * from './collections';
export * from './objects';

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: any, key: string) {
  return hasOwnProperty.call(obj, key);
}
