import { RuleSchema } from '../types';
import { isEmpty } from '../utils';

export const validate = (value: any) => !isEmpty(value);

const schema: RuleSchema = {
  allowEmpty: false
};

export default schema;
