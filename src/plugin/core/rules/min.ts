import { RuleSchema } from '../types';

export const validate = (value: number | Date, { min }: Record<string, number | Date>) => {
  return +value >= +min;
};

const schema: RuleSchema = {
  validate,
  types: ['number', 'date']
};

export default schema;
