import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validate = (value: any, { minLength }: Record<string, number>) => {
  return getLength(value) >= minLength;
};

const schema: ValidationRuleSchema = {
  validate,
  for: ['string', 'group', 'groups'],
  props: {
    minLength: 0
  }
};

export default schema;
