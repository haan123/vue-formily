import { ValidationRuleSchema } from '../types';
import { isEmpty } from '../utils';

export const validator = (value: any) => !isEmpty(value);

const schema: ValidationRuleSchema = {
  name: 'required',
  allowEmpty: false
};

export default schema;
