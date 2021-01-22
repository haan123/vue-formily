import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validator = (value: any, { maxLength }: Record<string, number>) => {
  return getLength(value) <= maxLength;
};

const schema: ValidationRuleSchema = {
  validator,
  name: 'maxLength',
  cascade: true,
  for: ['string', 'enum', 'set'],
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
