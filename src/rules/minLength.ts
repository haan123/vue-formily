import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validate = (value: string, { minLength }: Record<string, number>) => {
  return getLength(value) >= minLength;
};

const schema: ValidationRuleSchema = {
  validate,
  cascade: true,
  types: ['string', 'group', 'groups'],
  props: {
    minLength: 0
  }
};

export default schema;
