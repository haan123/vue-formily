import { ValidationRuleSchema } from '../types';
import { isEmpty } from '../utils';

export const validate = (value: any) => !isEmpty(value);

const schema: ValidationRuleSchema = {
  allowEmpty: false
};

export default schema;
