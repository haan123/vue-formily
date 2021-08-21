import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validator = (value: any, { maxLength = Number.MAX_VALUE }: Record<string, number> = {}) => {
  return getLength(value) <= maxLength;
};

const schema: ValidationRuleSchema = {
  validator,
  name: 'maxLength',
  cascade: true,
  for: ['string', 'enum', 'set']
};

export default schema;
