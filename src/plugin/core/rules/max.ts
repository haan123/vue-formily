import { RuleSchema } from '../types';

export const validate = (value: number | Date, { max }: Record<string, number | Date>) => {
  if (value instanceof Date) {
    return +value <= +max;
  }

  return value <= max;
};

const schema: RuleSchema = {
  validate,
  types: ['number', 'date']
};

export default schema;
