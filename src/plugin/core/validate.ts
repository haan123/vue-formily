import { FormFieldType, FormFieldValue, ValidationResult, Validations } from './types';
import { Validation } from './types/Validation';
import { each, isNumber } from './utils';

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
