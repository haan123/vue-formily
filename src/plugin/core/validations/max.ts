import { ValidationSchema } from '../types';

export const validate = (value: number | Date, { max }: Record<string, number | Date>) => {
  if (value instanceof Date) {
    return +value <= +max;
  }

  return value <= max;
};

const schema: ValidationSchema = {
  validate,
  types: ['number', 'date'],
  params: [
    {
      name: 'max'
    }
  ]
};

export default schema;
