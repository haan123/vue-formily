import {
  FormField,
  FormFieldValue,
  RuleParamSchema,
  ValidationMessageTemplate,
  ValidationRule,
  ValidationRuleFunction
} from './types';
import { def, vfMessage } from './utils';

export default class Validation {
  valid!: boolean;
  message?: ValidationMessageTemplate;

  validate!: (field: FormField) => boolean;

  constructor(rule: ValidationRule = {}) {
    def(this, 'valid', false);
    def(this, 'message', '', false);

    let validator: ValidationRuleFunction;
    let params: RuleParamSchema[] | undefined;

    if (typeof rule === 'function') {
      validator = rule;
    } else {
      if (typeof rule.validate === 'undefined') {
        throw new Error(vfMessage('missing "validate(): boolean" method in validation rule'));
      }

      validator = rule.validate;
      params = rule.params;
    }

    def(
      this,
      'validate',
      (field: FormField) => {
        return validator.call(field, field.value, params);
      },
      false
    );
  }
}
