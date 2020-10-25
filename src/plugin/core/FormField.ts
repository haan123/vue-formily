import {
  FormFieldSchema,
  FormilyField,
  ValidationSchema,
  ValidationRuleSchema,
  FormFieldValue,
  FormFieldType,
  ValidationResult,
  PropValue
} from './types';
import FormElement from './FormElement';
import { def, each, merge, logError, setter, logWarn, logMessage, isCallable, getter } from './utils';
import { maxLength, minLength, min, max } from './validations';
import Validation from './Validation';
import { cast, validate } from './validate';

const defaultRules: Record<string, ValidationSchema> = {
  minLength,
  maxLength,
  min,
  max
};

export type FormFieldValidationResult = ValidationResult & {
  value: FormFieldValue;
};
export default class FormField extends FormElement {
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  readonly type!: FormFieldType;
  readonly inputType!: string;
  readonly default!: FormFieldValue;
  readonly props?: Record<string, PropValue>;
  readonly options?: any[];
  raw: string | null;
  formatted!: string | null;
  value: FormFieldValue;

  constructor(schema: FormFieldSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    const { type, inputType = 'text' } = schema;
    let defaultValue = null;

    if (!type) {
      throw new Error(
        logMessage('field type can not be null or undefined', {
          formId: this.formId
        })
      );
    } else if (!['string', 'number', 'boolean', 'date'].includes(type)) {
      throw new Error(
        logMessage(
          'Unsupported field type, the type must be one of these types ["string", "number", "boolean", "date"]',
          {
            formId: this.formId
          }
        )
      );
    }

    try {
      defaultValue = cast(schema.default, this.type);
    } catch (error) {
      logError(`${error}`, {
        formId: this.formId,
        field: 'default'
      });
    }

    def(this, 'type', type, false);
    def(this, 'default', defaultValue, false);
    def(this, 'inputType', inputType, false);

    each(schema.props || {}, (propValue, propName) => {
      setter(this, propName, (value: any) => {
        if (value !== undefined) {
          return value;
        }

        return isCallable(propValue) ? propValue.call(this, this.value) : propValue;
      });
    });

    const ruleSchemas: Record<string, ValidationRuleSchema> = merge({}, defaultRules, schema.rules);

    each(schemas, (schema: ValidationRuleSchema, key: string) => {});

    const validation = new Validation(ruleSchemas);

    const formatter = isCallable(schema.formatter) ? schema.formatter.bind(this) : (value: FormFieldValue) => value;

    let typedValue = this.default;
    let formattedValue = formatter(this.default);

    setter(this, 'raw', schema.default, async (val: any) => {
      const { value } = await this.validate(val);

      typedValue = value;
      formattedValue = formatter(typedValue);

      return val;
    });

    getter(this, 'value', () => typedValue);
    getter(this, 'formatted', () => formattedValue);
  }
  async validate(val: any): Promise<FormFieldValidationResult> {
    let value: FormFieldValue = null;
    let result: ValidationResult = {
      valid: false,
      errors: []
    };

    try {
      const typedValue = cast(val, this.type);
      result = await validate(typedValue, this.validations);

      if (result.valid) {
        value = typedValue;
      }
    } catch (error) {
      this.invalidate();

      logError(`${error}`, {
        formId: this.formId
      });
    }

    this.valid = result.valid;

    return {
      ...result,
      value
    };
  }
}
