import { RuleSchema, ValidationMessageTemplate, ValidationRuleResult, Validator } from './types';

import { def, isCallable, isPlainObject, logMessage, isEmpty } from '../../utils';
import { getLocalizer } from '@/helpers';

const localizer = getLocalizer();
export default class ValidationRule {
  readonly props!: Record<string, any>;
  readonly _template!: ValidationMessageTemplate | null;
  readonly _validator!: Validator;
  data!: Record<string, any>;
  message!: string | null;
  valid: boolean;

  constructor(rule: ValidationRule | RuleSchema | Validator, data?: any) {
    if (!rule) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    let validator: Validator | null = null;
    let template = null;
    let vProps;

    if (isCallable(rule)) {
      validator = rule;
    } else if (isPlainObject(rule)) {
      if (!('allowEmpty' in rule) || rule.allowEmpty) {
        validator = (rule.validate as Validator) || null;
      } else if (!rule.allowEmpty) {
        validator = (value: any, props: Record<string, any>, data: Record<string, any> | null) => {
          return !isEmpty(value) && (!rule.validate || (rule.validate as Validator).call(this, value, props, data));
        };
      }

      vProps = rule.props;
      template = isCallable(rule.message) ? rule.message : rule.message || null;
    }

    if (!validator) {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }

    this.valid = true;

    def(this, 'data', data || {}, { reactive: false });
    def(this, 'props', vProps || {}, { writable: false });
    def(this, '_template', template, { writable: false });
    def(this, '_validator', validator.bind(this), { writable: false });
  }

  addData(key: string, value: any) {
    this.data[key] = value;
  }

  async validate(value: any): Promise<ValidationRuleResult> {
    const valid = await this._validator(value, this.props, this.data);
    let error = null;

    if (!valid) {
      if (isCallable(this._template)) {
        error = this._template(value, this.props, this.data);
      } else if (typeof this._template === 'string') {
        error = this._template;
      }

      error = localizer(typeof error === 'string' ? error : 'validation.invalid', this.props, this.data);
    }

    this.valid = valid;

    return {
      error
    };
  }
}
