import {
  FormFieldSchema,
  ValidationRuleSchema,
  FormFieldValue,
  FormFieldType,
  ValidationResult,
  PropValue,
  FormContainer
} from './types';
import FormElement from './FormElement';
import { def, each, logError, logMessage, isCallable, getter, setter, ref, Ref } from './utils';
import Validation from './Validation';
import { cast } from './validate';
import { FORM_FIELD_TYPES } from './constants';
import { toProps } from './helpers';

export type FormFieldValidationResult = ValidationResult & {
  value: FormFieldValue;
};

export default class FormField extends FormElement {
  static accept(schema: any): schema is FormFieldSchema {
    return !!FORM_FIELD_TYPES[schema.type];
  }

  static create(schema: any, ...args: any[]): FormField {
    return new FormField(schema, ...args);
  }

  readonly type!: FormFieldType;
  readonly inputType!: string;
  readonly default!: FormFieldValue;
  readonly props!: Record<string, PropValue> | null;
  readonly model!: string;
  readonly formatted!: string | null;
  pending = false;
  raw!: string | null;
  value!: FormFieldValue;

  constructor(schema: FormFieldSchema, parent?: FormContainer) {
    super(schema, parent);

    const formatter = isCallable(schema.formatter)
      ? schema.formatter.bind(this)
      : (value: FormFieldValue) => value as string;

    let formattedValue = formatter(this.default);

    const raw = ref(schema.default !== undefined ? schema.default : null);

    setter(this, 'value', this.default, (val: any, typedValue: Ref) => {
      raw.value = val;

      this.validate(raw.value).then(({ value }) => {
        typedValue.value = value;
        formattedValue = formatter(typedValue.value);

        if (this.parent && isCallable(this.parent._sync)) {
          this.parent._sync(this);
        }
      });
    });

    setter(this, 'raw', raw, (val: any) => {
      raw.value = val;
      this.value = val;
    });

    getter(this, 'formatted', () => formattedValue);

    this.props = toProps(this, schema.props);
  }

  initialize(schema: FormFieldSchema) {
    const { type, rules, inputType = 'text' } = schema;
    let defaultValue = null;

    if (!FormField.accept(schema)) {
      throw new Error(
        logMessage(`Invalid schema`, {
          formId: this.formId
        })
      );
    }

    def(this, 'type', type, { writable: false });
    def(this, 'inputType', inputType, { writable: false });

    try {
      defaultValue = cast(schema.default, this.type);
    } catch (error) {
      logError(`${error}`, {
        formId: this.formId,
        field: 'default'
      });
    }

    def(this, 'default', defaultValue, { writable: false });

    const validationRules: Record<string, ValidationRuleSchema> = {};

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

    def(this, 'validation', new Validation(validationRules, { field: this }), { writable: false });
  }

  isValid() {
    return this.validation.errors !== null;
  }

  genHtmlName(path: string[], ...args: any[]): string {
    if (!this.parent) {
      return this.formId;
    }

    return this.parent.genHtmlName([this.formId], ...args);
  }

  async validate(val: any): Promise<FormFieldValidationResult> {
    let value: FormFieldValue = null;
    let result: ValidationResult = {
      valid: false,
      errors: null
    };

    this.pending = true;

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

    this.pending = false;

    return {
      ...result,
      value
    };
  }
}
