import { ValidationRuleSchema } from '../types';

export const validate = (value: number | Date, { min }: Record<string, number | Date>) => {
  return +value >= +min;
};

const schema: ValidationRuleSchema = {
  validate,
  cascade: true,
  types: ['number', 'date']
};

export default schema;
