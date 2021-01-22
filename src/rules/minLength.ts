import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validator = (value: any, { minLength }: Record<string, number>) => {
  return getLength(value) >= minLength;
};

const schema: ValidationRuleSchema = {
  validator,
  name: 'minLength',
  cascade: true,
  for: ['string', 'enum', 'set'],
  props: {
    minLength: 0
  }
};

export default schema;
