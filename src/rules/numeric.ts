
import { isNumber } from '@/utils';
import { ValidationRuleSchema } from '../types';

export const validate = (value: any) => isNumber(value);

const schema: ValidationRuleSchema = {
  validate,
  name: 'numeric'
};

export default schema;
