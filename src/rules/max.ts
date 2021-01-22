import { ValidationRuleSchema } from '../types';

export const validator = (value: any, { max }: Record<string, number | Date>) => {
  if (value instanceof Date) {
    return +value <= +max;
  }

  return value <= max;
};

const schema: ValidationRuleSchema = {
  validator,
  name: 'max',
  for: ['number', 'date']
};

export default schema;
