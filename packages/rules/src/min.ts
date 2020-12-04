import { RuleSchema, ValidationProps } from '../../types';

export const validate = (value: number | Date, { min }: ValidationProps) => {
  return +value >= +min;
};

const schema: RuleSchema = {
  validate,
  cascade: true,
  types: ['number', 'date']
};

export default schema;
