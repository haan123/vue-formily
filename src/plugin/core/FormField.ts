import { FormFieldSchema, FormilyField, ValidationSchema, FormFieldValue, FormFieldType } from './types';
import FormElement from './FormElement';
import { def, merge, logError, setter, logWarn, logMessage } from './utils';
import { maxLength, minLength, min, max } from './validations';
import Validation from './Validation';
import { cast, validate } from './validate';

function setValue(this: FormField, value: any | null = null) {
  return value;
}

const defaultProps: Map<string, any> = new Map([
  [
    'type',
    function(value: FormFieldType) {
      if (!value) {
        throw new Error(
          logMessage('field type can not be null or undefined', {
            formId: this.formId
          })
        );
      } else if (!['string', 'number', 'boolean', 'date'].includes(value)) {
        throw new Error(
          logMessage(
            'Unsupported field type, the type must be one of these types ["string", "number", "boolean", "date"]',
            {
              formId: this.formId
            }
          )
        );
      }

      return value;
    }
  ],
  [
    'default',
    function(val: FormFieldValue) {
      let value = null;
      try {
        value = cast(val, this.type);
      } catch (error) {
        logError(`${error}`, {
          formId: this.formId,
          field: 'default'
        });
      }

      return value;
    }
  ],
  ['inputType', setValue],
  ['label', setValue],
  ['hint', setValue],
  ['placeholder', setValue],
  ['minLength', setValue],
  ['maxLength', setValue],
  ['min', setValue],
  ['max', setValue]
]);

const defaultValidations: Record<string, ValidationSchema> = {
  minLength,
  maxLength,
  min,
  max
};
export default class FormField extends FormElement {
  static FIELD_TYPE_STRING = 'string';
  static FIELD_TYPE_NUMBER = 'number';
  static FIELD_TYPE_BOOLEAN = 'boolean';
  static FIELD_TYPE_DATE = 'date';

  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly type!: FormFieldType;
  readonly default!: FormFieldValue;
  raw: string | null = null;
  formatted: string | null = null;
  value: FormFieldValue = null;

  constructor(schema: FormFieldSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    defaultProps.forEach((valueFn: any, propName: string) => {
      def(this, propName, valueFn.call(this, schema[propName as keyof FormFieldSchema], schema), false);
    });

    const vSchemas: Record<string, ValidationSchema> = merge({}, schema.validations, defaultValidations);

    Object.keys(vSchemas).forEach((propName: string) => {
      const vSchema = vSchemas[propName];
      const { types } = vSchema;

      if (!types) {
        logWarn(`Missing "types" in validation rule with name "${propName}" at formid "${this.formId}"`);
      } else if (types.includes(this.type)) {
        const validation = new Validation(vSchema, (this as Record<string, any>)[propName]);

        this.validations[propName] = validation;
      }
    });

    setter(this, 'value', (val: any) => {
      this.raw = val;

      const { value } = this.validate(val);

      return value;
    });

    this.value = schema.default as any;
  }
  validate(val: any) {
    let value = null;
    let valid = true;

    try {
      const typedValue = cast(val, this.type);
      ({ valid } = validate(typedValue, this.validations, this));

      if (valid) {
        value = typedValue;
      }
    } catch (error) {
      this.invalidate();

      logError(`${error}`, {
        formId: this.formId
      });
    }

    this.valid = valid;

    return {
      valid,
      value
    };
  }
}
