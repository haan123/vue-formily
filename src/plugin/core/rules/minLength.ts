import { getLength } from '../helpers';
import { RuleSchema, ValidationProps } from '../types';

export const validate = (value: string, { minLength }: ValidationProps) => {
  return getLength(value) >= minLength;
};

const schema: RuleSchema = {
  validate,
  cascade: true,
  types: ['string'],
  props: {
    minLength: 0
  }
};

export default schema;
