import { RuleSchema } from '../types';

export const validate = (value: string, { maxLength }: Record<string, number>) => {
  return value.length <= maxLength;
};

const schema: RuleSchema = {
  validate,
  types: ['string'],
  props: {
    maxLength: Number.MAX_VALUE
  }
};

export default schema;
