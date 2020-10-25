import { ValidationMessageTemplate, RuleParamSchema, ValidationRuleSchema, Validator } from './types';
import { def, isCallable, isNullOrUndefined, isPlainObject, logMessage, logWarn } from './utils';

export function parameterize(paramsSchema: RuleParamSchema[], params?: any): Map<string, any> {
  const hasParams = isNullOrUndefined(params);
  const isArray = hasParams ? Array.isArray(params) : false;
  const isObject = isPlainObject(params);

  const vParams: [string, any][] = paramsSchema.map((paramSchema: RuleParamSchema, i: number) => {
    let param = paramSchema.default;

    if (hasParams) {
      if (isArray) {
        param = params[i];
      } else if (isObject) {
        param = params[paramSchema.name];
      }
    }

    return [paramSchema.name, param];
  });

  return new Map(vParams);
}

export default class ValidationRule {
  readonly data!: Map<string, unknown>;
  readonly params!: Map<string, unknown>;
  readonly _template!: ValidationMessageTemplate | null;
  readonly _validator!: Validator;
  message: string | null = null;
  valid!: boolean;

  constructor(rule: ValidationRuleSchema, params?: unknown, data?: unknown) {
    def(this, 'valid', true);

    if (isNullOrUndefined(rule)) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    let validator = null;
    let vParams = null;
    let template = null;
    let vData = null;

    if (isCallable(rule)) {
      validator = rule;
    } else if (isPlainObject(rule)) {
      validator = rule.validate;
      vParams = rule.params ? parameterize(rule.params, params) : null;
      template = isCallable(rule.message) ? rule.message : rule.message || null;
    }

    if (!validator) {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }

    try {
      vData = new Map(data as Map<string, unknown>);
    } catch (error) {
      if (isPlainObject(data)) {
        vData = new Map(Object.keys(data).map(key => [key, (data as Record<string, unknown>)[key]]));
      } else {
        logWarn('The optional data is no valid, it has to be a "Map", an array of "[key, value]" or a plain "object"');
      }
    }

    def(this, 'data', vData, false);
    def(this, 'params', vParams, false);
    def(this, '_template', template, false);
    def(this, '_validator', validator.bind(this), false);
  }

  addData(key: string, value: unknown) {
    this.data.set(key, value);
  }

  async validate(
    value: unknown
  ): Promise<{
    valid: boolean;
    message: string | null;
  }> {
    const valid = await this._validator(value, this.params, this.data);
    let message = null;

    if (isCallable(this._template)) {
      message = this._template(value, this.params, this.data);
    } else if (typeof this._template === 'string') {
      message = this._template;
    }

    return {
      valid,
      message
    };
  }
}
