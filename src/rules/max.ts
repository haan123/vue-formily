import { ValidationRuleSchema } from '../types';

export const validate = (value: any, { max }: Record<string, number | Date>) => {
  if (value instanceof Date) {
    return +value <= +max;
  }

  return value <= max;
};

const schema: ValidationRuleSchema = {
  validate,
  name: 'max',
  for: ['number', 'date']
};

export default schema;
