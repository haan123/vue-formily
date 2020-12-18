
import { isNumber } from '@/utils';
import { ValidationRuleSchema } from '../types';

export const validate = (value: any) => isNumber(value);

const schema: ValidationRuleSchema = {
  validate,
  cascade: false,
  for: ['number']
};

export default schema;
