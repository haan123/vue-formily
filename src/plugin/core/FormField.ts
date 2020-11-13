import {
  FormFieldSchema,
  FormFieldValue,
  FormFieldType,
  ValidationResult,
  PropValue,
  FormContainer,
  SchemaValidation
} from './types';
import FormElement from './FormElement';
import { def, logError, logMessage, isCallable, getter, setter, ref, Ref } from './utils';
import Validation from './Validation';
import { FORM_FIELD_TYPES } from './constants';
import { cast, genValidationRules, genProps, indentifySchema, invalidateSchemaValidation } from './helpers';

export type FormFieldValidationResult = ValidationResult & {
  value: FormFieldValue;
};

export default class FormField extends FormElement {
  static accept(schema: any): SchemaValidation {
    const type = FORM_FIELD_TYPES[schema.type];
    const { identified, sv } = indentifySchema(schema, type);

    if (!identified) {
      if (!type) {
        invalidateSchemaValidation(sv, `type "${schema.type}" is not supported for form field element`);
      }

      if (sv.valid) {
        schema.__is__ = type;
      }
    }

    return sv;
  }

  static create(schema: any, ...args: any[]): FormField {
    return new FormField(schema, ...args);
  }

  readonly type!: FormFieldType;
  readonly inputType!: string;
  readonly default!: FormFieldValue;
  readonly props: Record<string, PropValue> | null;
  readonly formatted!: string | null;
  pending = false;
  raw!: string;
  value!: FormFieldValue;

  constructor(schema: FormFieldSchema, parent?: FormContainer) {
    super(schema, parent, FormField);

    const accepted = FormField.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, { formId: this.formId }));
    }

    const { type, rules, inputType = 'text' } = schema;

    let defaultValue = null;

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

    const props = (this.props = genProps([schema.props], this));

    const validationRules = genValidationRules(rules, props, this.type, this);

    def(this, 'validation', new Validation(validationRules, { field: this }), { writable: false });

    const formatter = isCallable(schema.formatter)
      ? schema.formatter.bind(this)
      : (value: FormFieldValue) => value as string;

    let formattedValue = formatter(this.default);

    const raw = ref(schema.default !== undefined ? schema.default : '');

    setter(this, 'value', null, (val: any, typedValue: Ref) => {
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

    // trigger validation for value
    this.value = this.raw;
  }

  isValid() {
    return !this._invalidated && this.validation.valid;
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
      errors: null,
      invalidRules: null
    };

    this.pending = true;

    try {
      const typedValue = cast(val, this.type);
      result = await this.validation.validate(typedValue);

      if (result.valid) {
        value = typedValue;
      }
    } catch (error) {
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
