import { RuleSchema } from '../types';
import { isEmptyValue } from '../helpers';

export const validate = (value: any) => isEmptyValue(value);

const schema: RuleSchema = {
  validate,
  allowEmpty: false
};

export default schema;
