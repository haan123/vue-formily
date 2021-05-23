import { isNumber } from '@/utils';
import { ValidationRuleSchema } from '../types';

export const validator = (value: any) => isNumber(value);

const schema: ValidationRuleSchema = {
  validator,
  name: 'numeric'
};

export default schema;
