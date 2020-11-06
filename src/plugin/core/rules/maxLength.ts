import { getLength } from '../helpers';
import { RuleSchema, Validator, ValidationProps } from '../types';

export const validate: Validator = (value: string, { maxLength }: ValidationProps) => {
  return getLength(value) <= maxLength;
};

const schema: RuleSchema = {
  validate,
  cascade: true,
  types: ['string'],
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
