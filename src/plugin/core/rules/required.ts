import { RuleSchema } from '../types';
import { isNullOrUndefined } from '../utils';

export const validate = (value: any, { maxLength }: Record<string, number>) => {
  if (Array.isArray(value)) return !!value.length;

  if (isNullOrUndefined(value)) {
    return false;
  }

  if (value === false) {
    return true;
  }

  return !!String(value).trim().length;
};

const schema: RuleSchema = {
  validate,
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
