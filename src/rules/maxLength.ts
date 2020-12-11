import { ValidationRuleSchema } from '../types';
import { getLength } from '../utils';

export const validate = (value: string, { maxLength }: Record<string, number>) => {
  return getLength(value) <= maxLength;
};

const schema: ValidationRuleSchema = {
  validate,
  cascade: true,
  types: ['string', 'group', 'groups'],
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
