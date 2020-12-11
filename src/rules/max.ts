import { ValidationRuleSchema } from '../types';

export const validate = (value: number | Date, { max }: Record<string, number | Date>) => {
  if (value instanceof Date) {
    return +value <= +max;
  }

  return value <= max;
};

const schema: ValidationRuleSchema = {
  validate,
  cascade: true,
  types: ['number', 'date']
};

export default schema;
