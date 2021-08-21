import { isNullOrUndefined } from './assertions';
import { getLength } from './common';

export function isEmpty(value: any): value is null | undefined {
  return isNullOrUndefined(value) || !getLength(value);
}
