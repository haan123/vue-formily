import { ValidationRuleSchema } from '../types';
import { isEmpty } from '../utils';

export const validator = (value: any) => !isEmpty(value);

const schema: ValidationRuleSchema = {
  validator,
  name: 'required'
};

export default schema;
