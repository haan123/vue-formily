import { ValidationRuleSchema } from '../types';

export const validate = (value: any, { min }: Record<string, number | Date>) => {
  return +value >= +min;
};

const schema: ValidationRuleSchema = {
  validate,
  name: 'min',
  for: ['number', 'date']
};

export default schema;
