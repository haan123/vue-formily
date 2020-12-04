import { RuleSchema, ValidationProps } from '../../types';

export const validate = (value: number | Date, { max }: ValidationProps) => {
  if (value instanceof Date) {
    return +value <= +max;
  }

  return value <= max;
};

const schema: RuleSchema = {
  validate,
  cascade: true,
  types: ['number', 'date']
};

export default schema;
