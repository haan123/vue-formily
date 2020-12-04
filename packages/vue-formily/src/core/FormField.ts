import {
  FormFieldSchema,
  ValidationResult,
  SchemaValidation,
  FormElementData,
  FormFieldValidationResult
} from '../../types';
import FormElement from './FormElement';
import { def, logError, logMessage, isCallable, getter, setter, ref, Ref } from '../utils';
import Validation from './Validation';
import {
  cast,
  genValidationRules,
  genProps,
  indentifySchema,
  invalidateSchemaValidation,
  genHtmlName
} from '../helpers';

type FormFieldData = FormElementData;
const _privateData = new WeakMap<FormField, FormFieldData>();

const FIELD_TYPES: Record<string, any> = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date'
};

export default class FormField extends FormElement {
  static FORM_TYPE = 'field';

  static FIELD_TYPE_STRING = FIELD_TYPES.STRING;
  static FIELD_TYPE_NUMBER = FIELD_TYPES.NUMBER;
  static FIELD_TYPE_BOOLEAN = FIELD_TYPES.BOOLEAN;
  static FIELD_TYPE_DATE = FIELD_TYPES.DATE;

  static accept(schema: any): SchemaValidation {
    const type = FIELD_TYPES[schema.type && schema.type.toUpperCase()];
    const { identified, sv } = indentifySchema(schema, type);

    if (!identified) {
      if (schema.formType !== 'field') {
        invalidateSchemaValidation(sv, `'formType' value must be 'field'`, { formId: schema.formId });
      } else if (!type) {
        invalidateSchemaValidation(sv, `type '${schema.type}' is not supported for FormField`, {
          formId: schema.formId
        });
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

  readonly formType!: 'field';
  readonly type!: 'string' | 'number' | 'boolean' | 'date';
  readonly inputType!: string;
  readonly default!: FormField['value'];
  readonly props: Record<string, any> | null;
  readonly formatted!: string | null;
  pending = false;
  raw!: string | null;
  value!: string | number | boolean | Date | null;

  constructor(schema: FormFieldSchema, parent?: any) {
    super(schema, parent);

    const accepted = FormField.accept(schema);

    if (!accepted.valid) {
      throw new Error(logMessage(`Invalid schema, ${accepted.reason}`, accepted.infos));
    }

    const { type, rules, inputType = 'text' } = schema;

    let defaultValue = null;

    def(this, 'formType', schema.formType, { writable: false });
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

    const formatter = isCallable(schema.formatter) ? schema.formatter.bind(this) : (value: any): string => value;

    let formattedValue = formatter(this.default);

    const raw = ref(schema.default !== undefined ? schema.default : '');

    setter(this, 'value', null, (val: any, typedValue: Ref) => {
      raw.value = val;

      this.validate(raw.value).then(({ value }) => {
        typedValue.value = value;
        formattedValue = formatter(typedValue.value);
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
    return !this.invalidated() && this.validation.valid;
  }

  initialize(schema: FormFieldSchema, parent: any, data: FormFieldData) {
    _privateData.set(this, data);
  }

  getHtmlName(): string {
    return genHtmlName(this, (_privateData.get(this) as FormFieldData).ancestors);
  }

  async validate(val: any): Promise<FormFieldValidationResult> {
    let value: FormField['value'] = null;
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
