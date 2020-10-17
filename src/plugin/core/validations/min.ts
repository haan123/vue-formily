import { ValidationSchema } from '../types';

export const validate = (value: number | Date, { min }: Record<string, number | Date>) => {
  return +value >= +min;
};

const schema: ValidationSchema = {
  validate,
  types: ['number', 'date'],
  params: [
    {
      name: 'min'
    }
  ]
};

export default schema;
