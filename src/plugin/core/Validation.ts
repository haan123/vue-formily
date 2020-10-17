import { FormField, ValidationMessageTemplate, ValidationParamSchema, ValidationSchema, Validator } from './types';
import { def, isCallable, isNullOrUndefined, isPlainObject, logMessage } from './utils';

export function parameterize(paramsSchema: ValidationParamSchema[], params?: any): Map<string, any> {
  const hasParams = isNullOrUndefined(params);
  const isArray = hasParams ? Array.isArray(params) : false;
  const isObject = isPlainObject(params);

  const vParams: [string, any][] = paramsSchema.map((paramSchema: ValidationParamSchema, i: number) => {
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

export default class Validation {
  readonly params!: Map<string, any>;
  valid!: boolean;
  message?: ValidationMessageTemplate;

  validate!: (field: FormField) => boolean;

  constructor(rule: ValidationSchema | Validator, params?: any) {
    def(this, 'valid', true);

    if (isNullOrUndefined(rule)) {
      throw new Error(logMessage('Missing validation rule when creating validation'));
    }

    if (isCallable(rule)) {
      def(this, 'validate', (value: any, context: any) => rule.call(context, value), false);
    } else if (typeof rule.validate !== 'undefined') {
      const vParams = rule.params ? parameterize(rule.params, params) : null;

      def(this, 'params', vParams, false);
      def(this, 'message', (value: string) => {
        return typeof rule.message === 'string' ? rule.message : rule.message.call(this)
      }, false);

      def(
        this,
        'validate',
        (value: any, context: any) => (rule.validate as Validator).call(context, value, vParams),
        false
      );
    } else {
      throw new Error(logMessage('Missing "validate(): boolean" method in validation rule'));
    }
  }
}
