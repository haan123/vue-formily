import { getLength } from '../utils';
import { RuleSchema } from '../types';

export const validate = (value: string, { minLength }: Record<string, number>) => {
  return getLength(value) >= minLength;
};

const schema: RuleSchema = {
  validate,
  cascade: true,
  types: ['string', 'group', 'groups'],
  props: {
    minLength: 0
  }
};

export default schema;
