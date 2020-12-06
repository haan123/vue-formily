import { getLength } from '../utils';
import { RuleSchema, Validator } from '../types';

export const validate: Validator = (value: string, { maxLength }: Record<string, number>) => {
  return getLength(value) <= maxLength;
};

const schema: RuleSchema = {
  validate,
  cascade: true,
  types: ['string', 'group', 'groups'],
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
