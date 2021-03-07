import { isDateObject } from '@/utils';
import { ValidationRuleSchema } from '../types';

export const validator = (value: any) => isDateObject(new Date(value))

const schema: ValidationRuleSchema = {
  validator,
  name: 'dateTime',
};

export default schema;
