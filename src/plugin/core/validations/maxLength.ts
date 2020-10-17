import { ValidationSchema } from '../types';

export const validate = (value: string, { length }: Record<string, number>) => {
  return value.length <= length;
};

const schema: ValidationSchema = {
  validate,
  types: ['string'],
  params: [
    {
      name: 'length',
      default: Number.MAX_VALUE
    }
  ]
};

export default schema;
