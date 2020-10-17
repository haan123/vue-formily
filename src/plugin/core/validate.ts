import { FormFieldType, FormFieldValue, Validations } from './types';
import { isNumber } from './utils';

export function cast(value: any, type: FormFieldType): FormFieldValue {
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

export function validate(value: FormFieldValue, validations: Validations, context?: any) {
  const keys = Object.keys(validations);
  let isValid = true;

  keys.forEach((key: string) => {
    const validation = validations[key];
    const valid = validation.validate(value, context);

    if (isValid && !valid) {
      isValid = valid;
    }
  });

  return {
    valid: isValid
  };
}
