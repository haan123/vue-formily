import { ValidationMessageTemplate, ValidationRuleSchema, Validator } from './types';
import { def, isCallable, isPlainObject, logMessage, toMap } from './utils';

export type ValidationRuleResult = {
  valid: boolean;
  message: string | null;
};

export default class ValidationRule {
  readonly data!: Map<string, any>;
  readonly props!: Map<string, any>;
  readonly _template!: ValidationMessageTemplate | null;
  readonly _validator!: Validator;
  message: string | null = null;
  valid: boolean;

  constructor(rule: ValidationRule | ValidationRuleSchema, data?: any) {
    if (!rule) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    let validator = null;
    let template = null;
    let vProps = null;

    if (isCallable(rule)) {
      validator = rule;
    } else if (isPlainObject(rule)) {
      validator = rule.validate;
      vProps = rule.props || null;
      template = isCallable(rule.message) ? rule.message : rule.message || null;
    }

    if (!validator) {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }

    this.valid = true;

    def(this, 'data', toMap(data), false);
    def(this, 'props', vProps, false);
    def(this, '_template', template, false);
    def(this, '_validator', validator.bind(this), false);
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
