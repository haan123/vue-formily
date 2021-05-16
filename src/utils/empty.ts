import { isNullOrUndefined } from "./assertions";
import { getLength } from "./common";

const _cache = {
  value: null,
  isEmpty: false
};

export function isEmpty(value: any): value is (null | undefined | false) {
  let empty = false;

  if (_cache.value === value) {
    return _cache.isEmpty;
  }

  if (isNullOrUndefined(value) || value === false || !getLength(value)) {
    empty = true;
  }

  _cache.value = value;
  _cache.isEmpty = empty;

  return empty;
}
