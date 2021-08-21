import { ValidationRuleSchema } from '../types';

export const validator = (value: any, { max }: Record<string, number | Date> = {}) => {
  return value !== null && +value <= +max;
};

const schema: ValidationRuleSchema = {
  validator,
  name: 'max',
  for: ['number', 'date']
};

export default schema;
