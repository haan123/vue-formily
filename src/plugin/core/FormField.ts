import { FormFieldSchema, FormilyField, ValidationRule } from './types';
import FormElement from './FormElement';
import { def, isNumber, logError, setter } from './utils';
import { FormFieldValue, FormFieldType } from './types/FormField';
import Validation from './Validation';
import { minLength } from './validators';
import { mergeValidationRules } from './helpers';

function setProp(obj: FormField, propName: string, value: any, rule?: ValidationRule) {
  if (typeof value !== 'undefined') {
    def(obj, propName, value, false);
  }

  if (rule) {
    obj.validations[propName] = new Validation(rule);
  }
}

function cast(value: any, type: FormFieldType): FormFieldValue {
  let typedValue: FormFieldValue = null;

  if (type === 'string') {
    typedValue = '' + value;
  } else if (type === 'number') {
    if (!isNumber(value)) {
      throw new Error(`"${value}" is not a "number"`);
    }

    typedValue = +value;
  } else if (type === 'boolean') {
    typedValue = !!value;
  } else if (type === 'date') {
    try {
      typedValue = new Date(value);
    } catch (error) {
      throw new Error(`"${value}" is not a "date" value`);
    }
  }

  return typedValue;
}

const fieldProps: Record<string, any> = {
  default(value: string) {
    return value;
  },
  type(value: FormFieldType) {
    return value;
  },
  required(value?: boolean) {
    return !!value;
  },
  inputType(value?: string) {
    return !!value;
  },
  label(value?: string) {
    return !!value;
  },
  hint(value?: string) {
    return !!value;
  },
  placeholder(value?: string) {
    return !!value;
  },
  minLength(value?: number | ValidationRule) {
    if (isNumber(value)) {
      value = mergeValidationRules();
    }

    return [];
  }
};

export default class FormField extends FormElement {
  readonly inputType?: string;
  readonly label?: string;
  readonly hint?: string;
  readonly help?: string;
  readonly placeholder?: string;
  readonly options?: any[];
  readonly formatter?: () => FormFieldValue;
  readonly required!: boolean;
  readonly minLength!: number | ValidationRule;
  readonly maxLength!: number | ValidationRule;
  readonly min!: number | Date | ValidationRule;
  readonly max!: number | Date | ValidationRule;
  readonly pattern!: string;
  readonly type!: FormFieldType;
  raw!: string;
  formatted!: string;
  default!: FormFieldValue;
  value!: FormFieldValue;

  constructor(schema: FormFieldSchema, parent?: FormilyField) {
    super(schema.formId, parent);

    const { default: defaultValue, type, ...props } = schema;

    Object.keys(fieldProps).forEach(propName => {
      setProp(this, propName, fieldProps[propName].call(this, (props as Record<string, any>)[propName]));
    });

    // setProp(this, 'minLength', schema.minLength || 0, minLength);
    // setProp(this, 'maxLength', schema.maxLength || Number.MAX_VALUE);
    // setProp(this, 'min', schema.min);
    // setProp(this, 'max', schema.max);
    // setProp(this, 'pattern', pattern);
    // setProp(this, 'options', options);

    setter(this, 'value', defaultValue, (value: any) => {
      let typedValue = null;

      this.setRaw(value);

      try {
        typedValue = cast(value, type);

        this.validate();
      } catch (error) {
        typedValue = null;

        this.invalidate();

        logError(`${error} (error occurred at field with formid is "${this.formId}")`);
      }

      return typedValue;
    });
  }
  validate() {
    let isValid = this.valid;
    const value = this.value;
    const keys = Object.keys(this.validations);

    if (!value) {
      isValid = false;
    } else {
      keys.forEach(key => {
        const validation = this.validations[key];
        const valid = validation.validate(this);

        if (isValid && !valid) {
          isValid = false;
        }
      });
    }

    this.valid = isValid;
  }
  setRaw(value: string): void {
    this.raw = value;
  }
  setValue(value: any): void {
    this.value = value;
  }
}
