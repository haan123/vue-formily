import { isEmptyValue } from './helpers';
import { ValidationMessageTemplate, ValidationRuleSchema, Validator, ValidationProps } from './types';
import { def, isCallable, isPlainObject, logMessage, toMap } from './utils';

export type ValidationRuleResult = {
  valid: boolean;
  message: string | null;
};

export default class ValidationRule {
  readonly props!: ValidationProps;
  readonly _template!: ValidationMessageTemplate | null;
  readonly _validator!: Validator;
  data!: Map<string, any>;
  message!: string | null;
  valid: boolean;

  constructor(rule: ValidationRule | ValidationRuleSchema, data?: any) {
    if (!rule) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    let validator: Validator | null = null;
    let template = null;
    let vProps;

    if (isCallable(rule)) {
      validator = rule;
    } else if (isPlainObject(rule)) {
      if (!('allowEmpty' in rule)) {
        validator = (rule.validate as Validator) || null;
      } else if (!rule.allowEmpty && rule.validate) {
        validator = (value: any, props: ValidationProps, data: Map<string, any> | null) => {
          return !isEmptyValue(value) && (rule.validate as Validator).call(this, value, props, data);
        };
      }

      vProps = rule.props;
      template = isCallable(rule.message) ? rule.message : rule.message || null;
    }

    if (!validator) {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }

    this.valid = true;

    def(this, 'data', toMap(data || null), { writable: false });
    def(this, 'props', vProps || {}, { writable: false });
    def(this, '_template', template, { writable: false });
    def(this, '_validator', validator.bind(this), { writable: false });
  }

  addData(key: string, value: any) {
    this.data.set(key, value);
  }

  async validate(value: any): Promise<ValidationRuleResult> {
    const valid = await this._validator(value, this.props, this.data);
    let message = null;

    if (isCallable(this._template)) {
      message = this._template(value, this.props, this.data);
    } else if (typeof this._template === 'string') {
      message = this._template;
    }

    this.valid = valid;

    return {
      valid,
      message
    };
  }
}
