import {
  FormFieldSchema,
  FormilyField,
  ValidationRuleSchema,
  FormFieldValue,
  FormFieldType,
  ValidationResult,
  PropValue
} from './types';
import FormElement from './FormElement';
import { def, each, logError, setter, logMessage, isCallable, getter } from './utils';
import Validation from './Validation';
import { cast } from './validate';
import { FORM_FIELD_TYPES } from './constants';
import { genHtmlName, isFormFieldType } from './helpers';

export type FormFieldValidationResult = ValidationResult & {
  value: FormFieldValue;
};

export default class FormField extends FormElement {
  readonly type!: FormFieldType;
  readonly inputType!: string;
  readonly default!: FormFieldValue;
  readonly options?: any[];
  props?: Record<string, PropValue>;
  raw!: string | null;
  formatted!: string | null;
  value!: FormFieldValue;

  constructor(schema: FormFieldSchema, parent?: FormilyField) {
    super(schema, parent);

    const formatter = isCallable(schema.formatter) ? schema.formatter.bind(this) : (value: FormFieldValue) => value;

    let typedValue = this.default;
    let rawValue = this.default;
    let formattedValue = formatter(this.default);

    setter(this, 'value', async (val: any) => {
      rawValue = val;

      const { value } = await this.validate(rawValue);

      typedValue = value;
      formattedValue = formatter(typedValue);

      return typedValue;
    });

    setter(
      this,
      'raw',
      (val: any) => {
        if (val !== undefined) {
          rawValue = val;
        }

        this.value = rawValue;

        return rawValue;
      },
      { eager: true }
    );

    getter(this, 'formatted', () => formattedValue);

    if (schema.props) {
      this.props = {};

      each(schema.props, (propValue, propName) => {
        getter(this.props, propName, (value: any) => {
          if (value !== undefined) {
            return value;
          }

          return isCallable(propValue) ? propValue.call(this, this.value) : propValue;
        });
      });
    }
  }

  initialize(schema: FormFieldSchema) {
    const { type, rules, inputType = 'text' } = schema;
    let defaultValue = null;

    if (!isFormFieldType(type)) {
      throw new Error(
        logMessage(
          `Unsupported field type, the type must be one of these types ${Object.keys(FORM_FIELD_TYPES).join(', ')}`,
          {
            formId: this.formId
          }
        )
      );
    }

    def(this, 'type', type, false);
    def(this, 'inputType', inputType, false);
    def(this, 'htmlName', genHtmlName(this), false);

    try {
      defaultValue = cast(schema.default, this.type);
    } catch (error) {
      logError(`${error}`, {
        formId: this.formId,
        field: 'default'
      });
    }

    def(this, 'default', defaultValue, false);

    const validationRules: Record<string, ValidationRuleSchema> = {};

    if (rules) {
      const props = this.props;

      each(rules, (rule: ValidationRuleSchema, key: string) => {
        /**
         * Only apply validation rule to 'function' or 'undefined' or field that has type is included in 'types' property of the rule
         */
        if (isCallable(rule)) {
          validationRules[key] = rule;
        } else if (!rule.types || rule.types.includes(this.type)) {
          let _rule: ValidationRuleSchema = rule;

          if (props && props[key] !== undefined) {
            _rule = {
              ...rule,
              props: {
                ...rule.props,
                [key]: props[key]
              }
            };
          }

          validationRules[key] = _rule;
        }
      });
    }

    def(this, 'validation', new Validation(validationRules, { field: this }), false);
  }

  async validate(val: any): Promise<FormFieldValidationResult> {
    let value: FormFieldValue = null;
    let result: ValidationResult = {
      valid: false,
      errors: null
    };

    try {
      const typedValue = cast(val, this.type);

      result = await this.validation.validate(typedValue);

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
