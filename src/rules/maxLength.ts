import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validate = (value: any, { maxLength }: Record<string, number>) => {
  return getLength(value) <= maxLength;
};

const schema: ValidationRuleSchema = {
  validate,
  for: ['string', 'group', 'groups'],
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
