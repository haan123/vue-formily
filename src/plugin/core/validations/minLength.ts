import { ValidationSchema } from '../types';

export const validate = (value: string, { minLength }: Record<string, number>) => {
  return value.length >= minLength;
};

const schema: ValidationSchema = {
  validate,
  types: ['string']
};

export default schema;
