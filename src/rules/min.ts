import { ValidationRuleSchema } from '../types';

export const validator = (value: any, { min }: Record<string, number | Date>) => {
  return +value >= +min;
};

const schema: ValidationRuleSchema = {
  validator,
  name: 'min',
  for: ['number', 'date']
};

export default schema;
