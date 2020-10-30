import { RuleSchema } from '../types';

export const validate = (value: string, { minLength }: Record<string, number>) => {
  return value.length >= minLength;
};

const schema: RuleSchema = {
  validate,
  types: ['string'],
  props: {
    minLength: 0
  }
};

export default schema;
