import {
  FormFieldSchema,
  FormilyField,
  ValidationSchema,
  FormFieldValue,
  FormFieldType,
  ValidationResult,
  FormField as CFormField
} from './types';
import FormElement from './FormElement';
import { def, each, merge, logError, setter, logWarn, logMessage, isCallable } from './utils';
import { maxLength, minLength, min, max } from './validations';
import Validation from './Validation';
import { cast, validate } from './validate';

function setValue(this: FormField, value: any | null = null) {
  return value;
}

const fieldProps: Map<string, any> = new Map([
  [
    'type',
    {
      readOnly: true,
      set(this: FormField, value: FormFieldType) {
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
    }
  ],
  [
    'default',
    {
      readOnly: true,
      set(this: CFormField, val: FormFieldValue) {
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
    }
  ],
  ['inputType', { readOnly: true, set: setValue }],
  ['label', { readOnly: false, set: setValue }],
  ['help', { readOnly: false, set: setValue }],
  ['hint', { readOnly: false, set: setValue }],
  ['placeholder', { readOnly: false, set: setValue }]
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

  readonly type!: FormFieldType;

  constructor(schema: FormFieldSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    fieldProps.forEach(({ readOnly, set }: any, propName: string) => {
      def(this, propName, set.call(this, schema[propName as keyof FormFieldSchema], schema), !readOnly);
    });
    console.log(this.type);
    each(schema.props || {}, (propValue, propName) => {
      setter(this, propName, (value: any) => {
        if (value !== undefined) {
          return value;
        }

        return isCallable(propValue) ? propValue.call(this, this.value) : propValue;
      });
    });

    const vSchemas: Record<string, ValidationSchema> = merge({}, schema.validations, defaultValidations);

    Object.keys(vSchemas).forEach((propName: string) => {
      const vSchema = vSchemas[propName];
      const { types } = vSchema;

      if (!types) {
        logWarn(`Missing "types" in validation rule with name "${propName}"`, {
          formId: this.formId
        });
      } else if (types.includes(this.type)) {
        const validation = new Validation(vSchema, (this as Record<string, any>)[propName], {
          field: this
        });

        this.validations[propName] = validation;
      }
    });

    setter(this, 'value', async (val: any) => {
      this.raw = val;

      const { value } = await this.validate(val);

      return value;
    });

    this.value = schema.default as any;
  }
  async validate(val: any): Promise<ValidationResult> {
    let value: FormFieldValue = null;
    let valid = false;

    try {
      const typedValue = cast(val, this.type);
      ({ valid } = await validate(typedValue, this.validations));

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
